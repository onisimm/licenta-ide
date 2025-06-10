import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import {
  Box,
  styled,
  CircularProgress,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { logError, normalizeError } from '../shared/utils';
import { useProjectOperations, useAppDispatch } from '../shared/hooks';
import { updateActiveFileContent } from '../shared/rdx-slice';
import loader from '@monaco-editor/loader';
import { getMonacoLanguage } from '../constants/languages';
import { useThemeToggle } from '../theme/themeProvider';

loader.config({ monaco });

interface CodeEditorProps {
  value: string;
  language: string;
  fileName: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

const EditorContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
}));

const SaveIndicator = styled(Box, {
  shouldForwardProp: prop => prop !== 'hasUnsavedChanges',
})<{ hasUnsavedChanges: boolean }>(({ theme, hasUnsavedChanges }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  display: hasUnsavedChanges ? 'flex' : 'none',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  padding: theme.spacing(0.25, 0.75),
  borderRadius: theme.spacing(0.5),
  fontSize: '11px',
  fontWeight: 500,
  zIndex: 1000,
  boxShadow: theme.shadows[2],
}));

const EditorHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  minHeight: 40,
}));

const FileName = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  fontFamily: 'monospace',
}));

const EditorWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
}));

export const CodeEditor: React.FC<CodeEditorProps> = memo(
  ({ value, language, fileName, onChange, readOnly = false }) => {
    // TODO: fix variables tooltips being underneath other components
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoInstanceRef = useRef<Monaco | null>(null);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const theme = useTheme();
    const { isDarkMode, currentTheme } = useThemeToggle();

    // Project operations hook - centralized file/folder operations
    const {
      saveFile,
      closeFile,
      closeFolder,
      selectedFile,
      activeFile,
      hasOpenFiles,
    } = useProjectOperations();
    const dispatch = useAppDispatch();

    // Track if this is an empty/placeholder state
    const isEmpty = !activeFile && !selectedFile;

    // Get the current file to work with (prefer activeFile from tabs)
    const currentFile = activeFile || selectedFile;

    // Editor content getter function
    const getEditorContent = useCallback(() => {
      return editorRef.current?.getValue();
    }, []);

    // Save file function using the hook - only if not empty
    const handleSaveFile = useCallback(async () => {
      if (isSaving || isEmpty) {
        console.log('Save skipped - empty state or already saving');
        return;
      }

      try {
        setIsSaving(true);
        await saveFile(getEditorContent);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        alert(`Error saving file: ${errorMessage}`);
      } finally {
        setIsSaving(false);
      }
    }, [saveFile, getEditorContent, isSaving, isEmpty]);

    // Close file function using the hook - only if not empty
    const handleCloseFile = useCallback(() => {
      if (!isEmpty) {
        closeFile(getEditorContent);
      }
    }, [closeFile, getEditorContent, isEmpty]);

    // Close folder function using the hook
    const handleCloseFolder = useCallback(() => {
      closeFolder(getEditorContent);
    }, [closeFolder, getEditorContent]);

    // Real-time content change tracking - updated for tabs
    const handleEditorChange = useCallback(
      (value: string | undefined) => {
        try {
          // Update the active file content in tabs
          if (value !== undefined && currentFile && !isEmpty) {
            dispatch(updateActiveFileContent(value));
          }

          // Call the original onChange callback
          onChange?.(value);
        } catch (error) {
          console.error('Error in editor change callback:', error);
          logError('Monaco Editor change', error);
          setHasError(true);
          setErrorMessage(`Change error: ${error}`);
        }
      },
      [currentFile, dispatch, onChange, isEmpty],
    );

    // Menu event listeners and keyboard shortcuts
    useEffect(() => {
      const unsubscribeSave = window.electron.onMenuSaveFile?.(handleSaveFile);
      const unsubscribeClose =
        window.electron.onMenuCloseFile?.(handleCloseFile);

      // Global keyboard event listener as fallback for Monaco shortcuts
      const handleKeyDown = (event: KeyboardEvent) => {
        // Only handle when Monaco editor is focused or when no other input is focused
        const activeElement = document.activeElement;
        const isMonacoFocused =
          activeElement?.classList.contains('monaco-editor') ||
          activeElement?.closest('.monaco-editor') ||
          (activeElement?.tagName === 'TEXTAREA' &&
            activeElement.className.includes('monaco'));

        if (
          !isMonacoFocused &&
          activeElement?.tagName !== 'INPUT' &&
          activeElement?.tagName !== 'TEXTAREA'
        ) {
          return; // Let other components handle their shortcuts
        }

        const isCtrlOrCmd = event.ctrlKey || event.metaKey;

        if (isCtrlOrCmd && event.key === 's') {
          event.preventDefault();
          event.stopPropagation();
          handleSaveFile();
          return;
        }

        if (isCtrlOrCmd && event.key === 'w') {
          event.preventDefault();
          event.stopPropagation();
          if (event.shiftKey) {
            handleCloseFolder();
          } else {
            handleCloseFile();
          }
          return;
        }
      };

      // Add global keyboard listener
      document.addEventListener('keydown', handleKeyDown, true); // Use capture phase

      return () => {
        unsubscribeSave?.();
        unsubscribeClose?.();
        document.removeEventListener('keydown', handleKeyDown, true);
      };
    }, [handleSaveFile, handleCloseFile, handleCloseFolder]);

    // Handle scrolling to line when Monaco is ready - ULTRA FAST
    const handleScrollToLine = useCallback((lineNumber: number) => {
      if (!editorRef.current) return;

      const scrollToLineImpl = () => {
        if (editorRef.current) {
          const model = editorRef.current.getModel();
          if (model && model.getLineCount() >= lineNumber) {
            // Immediate scroll with no logging for maximum performance
            editorRef.current.revealLineInCenter(lineNumber);
            editorRef.current.setPosition({ lineNumber, column: 1 });
            editorRef.current.focus();
            editorRef.current.setSelection({
              startLineNumber: lineNumber,
              startColumn: 1,
              endLineNumber: lineNumber,
              endColumn: model.getLineMaxColumn(lineNumber),
            });
          } else {
            // Quick retry
            requestAnimationFrame(scrollToLineImpl);
          }
        }
      };

      scrollToLineImpl();
    }, []);

    // Listen for custom scroll events - NO REDUX DEPENDENCY
    useEffect(() => {
      const handleCustomScrollEvent = (event: CustomEvent) => {
        const { lineNumber } = event.detail;
        if (lineNumber && editorRef.current) {
          handleScrollToLine(lineNumber);
        }
      };

      window.addEventListener(
        'monaco-scroll-to-line',
        handleCustomScrollEvent as EventListener,
      );

      return () => {
        window.removeEventListener(
          'monaco-scroll-to-line',
          handleCustomScrollEvent as EventListener,
        );
      };
    }, [handleScrollToLine]);

    // More aggressive global error handling
    useEffect(() => {
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        console.error('Monaco unhandled promise rejection:', event.reason);
        logError('Monaco Promise Rejection', event.reason);
        setHasError(true);
        setErrorMessage(`Promise rejection: ${event.reason}`);
        event.preventDefault();
        event.stopPropagation();
      };

      const handleError = (event: ErrorEvent) => {
        console.error('Monaco global error:', event.error || event.message);
        logError('Monaco Global Error', event.error || event.message);
        setHasError(true);
        setErrorMessage(`Global error: ${event.message}`);
        event.preventDefault();
        event.stopPropagation();
      };

      // Capture Monaco-specific errors
      const handleMonacoError = (error: any) => {
        console.error('Monaco editor error:', error);
        logError('Monaco Editor Error', error);
        setHasError(true);
        setErrorMessage(`Monaco error: ${error}`);
      };

      window.addEventListener(
        'unhandledrejection',
        handleUnhandledRejection,
        true,
      );
      window.addEventListener('error', handleError, true);

      // Add Monaco-specific error handling
      if (typeof window !== 'undefined' && (window as any).MonacoEnvironment) {
        (window as any).MonacoEnvironment.onError = handleMonacoError;
      }

      return () => {
        window.removeEventListener(
          'unhandledrejection',
          handleUnhandledRejection,
          true,
        );
        window.removeEventListener('error', handleError, true);
        if (
          typeof window !== 'undefined' &&
          (window as any).MonacoEnvironment
        ) {
          (window as any).MonacoEnvironment.onError = undefined;
        }
      };
    }, []);

    // Update theme when theme changes
    useEffect(() => {
      if (editorRef.current && monacoInstanceRef.current) {
        try {
          // Redefine themes with current theme colors
          monacoInstanceRef.current.editor.defineTheme('vs-dark-custom', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
              'editor.background': theme.palette.editor.background,
              'editor.foreground': theme.palette.editor.foreground,
              'editor.lineHighlightBackground':
                theme.palette.editor.lineHighlight,
              'editor.selectionBackground': theme.palette.editor.selection,
              'editor.inactiveSelectionBackground':
                theme.palette.editor.inactiveSelection,
              'editorCursor.foreground': theme.palette.editor.cursor,
              'editorWhitespace.foreground': theme.palette.editor.whitespace,
            },
          });

          monacoInstanceRef.current.editor.defineTheme('vs-light-custom', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
              'editor.background': theme.palette.editor.background,
              'editor.foreground': theme.palette.editor.foreground,
              'editor.lineHighlightBackground':
                theme.palette.editor.lineHighlight,
              'editor.selectionBackground': theme.palette.editor.selection,
              'editor.inactiveSelectionBackground':
                theme.palette.editor.inactiveSelection,
              'editorCursor.foreground': theme.palette.editor.cursor,
              'editorWhitespace.foreground': theme.palette.editor.whitespace,
            },
          });

          // Set the appropriate theme
          monacoInstanceRef.current.editor.setTheme(
            isDarkMode ? 'vs-dark-custom' : 'vs-light-custom',
          );
        } catch (error) {
          console.error('Error setting Monaco theme:', error);
          logError('Monaco Theme Switch', error);
        }
      }
    }, [currentTheme, theme.palette.editor]);

    const handleEditorDidMount = (
      editor: monaco.editor.IStandaloneCodeEditor,
      monacoInstance: Monaco,
    ) => {
      try {
        console.log('Monaco Editor mounting...');
        editorRef.current = editor;
        monacoInstanceRef.current = monacoInstance;

        // Add editor-specific error handling
        editor.onDidChangeModelContent(e => {
          try {
            // Handle content changes safely
            console.log('Editor content changed');
          } catch (error) {
            console.error('Error in content change handler:', error);
            logError('Monaco Content Change', error);
          }
        });

        // Add error handling for editor events
        editor.onDidChangeModel(e => {
          try {
            console.log('Editor model changed');
          } catch (error) {
            console.error('Error in model change handler:', error);
            logError('Monaco Model Change', error);
          }
        });

        // Configure Monaco themes for both light and dark (initial setup)
        monacoInstance.editor.defineTheme('vs-dark-custom', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': theme.palette.editor.background,
            'editor.foreground': theme.palette.editor.foreground,
            'editor.lineHighlightBackground':
              theme.palette.editor.lineHighlight,
            'editor.selectionBackground': theme.palette.editor.selection,
            'editor.inactiveSelectionBackground':
              theme.palette.editor.inactiveSelection,
            'editorCursor.foreground': theme.palette.editor.cursor,
            'editorWhitespace.foreground': theme.palette.editor.whitespace,
          },
        });

        monacoInstance.editor.defineTheme('vs-light-custom', {
          base: 'vs',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': theme.palette.editor.background,
            'editor.foreground': theme.palette.editor.foreground,
            'editor.lineHighlightBackground':
              theme.palette.editor.lineHighlight,
            'editor.selectionBackground': theme.palette.editor.selection,
            'editor.inactiveSelectionBackground':
              theme.palette.editor.inactiveSelection,
            'editorCursor.foreground': theme.palette.editor.cursor,
            'editorWhitespace.foreground': theme.palette.editor.whitespace,
          },
        });

        // Set the appropriate theme based on current mode
        monacoInstance.editor.setTheme(
          isDarkMode ? 'vs-dark-custom' : 'vs-light-custom',
        );

        // Configure TypeScript compiler options for better JSX/TSX support
        if (language === 'typescript' || language === 'tsx') {
          monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions(
            {
              target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
              allowNonTsExtensions: true,
              moduleResolution:
                monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
              module: monacoInstance.languages.typescript.ModuleKind.CommonJS,
              noEmit: true,
              esModuleInterop: true,
              jsx: fileName.endsWith('.tsx')
                ? monacoInstance.languages.typescript.JsxEmit.React
                : monacoInstance.languages.typescript.JsxEmit.None,
              reactNamespace: 'React',
              allowJs: true,
              typeRoots: ['node_modules/@types'],
              strict: false, // Allow more lenient TypeScript for better editor experience
              skipLibCheck: true, // Skip type checking of declaration files
            },
          );

          // Configure diagnostics
          monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
            {
              noSemanticValidation: true,
              noSyntaxValidation: false,
              noSuggestionDiagnostics: false,
            },
          );
        }

        // Configure JavaScript for JSX support
        if (language === 'javascript' || language === 'jsx') {
          monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions(
            {
              target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
              allowNonTsExtensions: true,
              allowJs: true,
              jsx: fileName.endsWith('.jsx')
                ? monacoInstance.languages.typescript.JsxEmit.React
                : monacoInstance.languages.typescript.JsxEmit.None,
            },
          );

          monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
            {
              noSemanticValidation: true, // Disable semantic validation for JS
              noSyntaxValidation: false,
              noSuggestionDiagnostics: true,
            },
          );
        }

        // Configure editor options for better performance
        editor.updateOptions({
          fontSize: 13,
          fontFamily:
            'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
          lineHeight: 22,
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
          minimap: {
            enabled: true,
            scale: 1,
            maxColumn: 120,
          },
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          wordWrap: 'off',
          readOnly,
          contextmenu: true,
          selectOnLineNumbers: true,
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          // Performance optimizations
          renderValidationDecorations: 'editable',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
          },
        });

        // Add keyboard shortcuts with error handling
        try {
          // Create stable command handlers by capturing current handler references
          const saveCommand = () => {
            try {
              console.log('Monaco save command triggered');
              handleSaveFile();
            } catch (error) {
              console.error('Error in Monaco save command:', error);
              logError('Monaco Save Command', error);
            }
          };

          const closeCommand = () => {
            try {
              console.log('Monaco close command triggered');
              handleCloseFile();
            } catch (error) {
              console.error('Error in Monaco close command:', error);
              logError('Monaco Close Command', error);
            }
          };

          const closeFolderCommand = () => {
            try {
              console.log('Monaco close folder command triggered');
              handleCloseFolder();
            } catch (error) {
              console.error('Error in Monaco close folder command:', error);
              logError('Monaco Close Folder Command', error);
            }
          };

          // Register Monaco commands with proper context
          const saveCommandId = editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS,
            saveCommand,
            '',
          );

          const closeCommandId = editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyW,
            closeCommand,
            '',
          );

          const closeFolderCommandId = editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd |
              monacoInstance.KeyMod.Shift |
              monacoInstance.KeyCode.KeyW,
            closeFolderCommand,
            '',
          );

          console.log('Monaco commands registered:', {
            saveCommandId,
            closeCommandId,
            closeFolderCommandId,
          });
        } catch (error) {
          console.error('Failed to register Monaco commands:', error);
          logError('Monaco Command Registration', error);
        }

        // Focus the editor safely
        try {
          editor.focus();
        } catch (error) {
          logError('Monaco Focus', error);
        }

        console.log('Monaco Editor mounted successfully');

        // Monaco is now ready to receive scroll commands if needed
      } catch (error) {
        console.error('Error configuring Monaco Editor:', error);
        logError('Monaco Editor configuration', error);
        setHasError(true);
        setErrorMessage(`Configuration error: ${error}`);
        throw normalizeError(error);
      }
    };

    // Error fallback component
    if (hasError) {
      return (
        <EditorContainer>
          <EditorWrapper>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
              flexDirection="column"
              gap={2}>
              <Typography color="error">Monaco Editor Error</Typography>
              <Typography variant="body2" color="text.secondary">
                {errorMessage}
              </Typography>
              <button
                onClick={() => {
                  setHasError(false);
                  setErrorMessage('');
                }}>
                Retry
              </button>
            </Box>
          </EditorWrapper>
        </EditorContainer>
      );
    }

    // Get normalized language for Monaco
    const monacoLanguage = getMonacoLanguage(language);

    // Check if current file has unsaved changes
    const hasUnsavedChanges = activeFile?.hasUnsavedChanges || false;

    return (
      <EditorContainer>
        {/* Save indicator for unsaved changes */}
        <SaveIndicator hasUnsavedChanges={hasUnsavedChanges && !isSaving}>
          {isSaving ? 'Saving...' : 'Unsaved changes'}
        </SaveIndicator>

        <EditorWrapper>
          <Editor
            height="100%"
            language={monacoLanguage}
            value={value}
            path={`file:///${fileName}`}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            loading={
              <LoadingContainer>
                <CircularProgress size={24} />
                <LoadingText>Loading Monaco Editor...</LoadingText>
              </LoadingContainer>
            }
            options={{
              automaticLayout: true,
            }}
          />
        </EditorWrapper>
      </EditorContainer>
    );
  },
);
