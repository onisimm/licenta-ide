import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import { Box, styled, CircularProgress, Typography } from '@mui/material';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { logError, normalizeError } from '../shared/utils';
import { useAppSelector, useAppDispatch } from '../shared/hooks';
import { updateSelectedFileContent } from '../shared/rdx-slice';
import type { RootState } from '../shared/store';
import loader from '@monaco-editor/loader';

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

// Helper function to normalize language for Monaco
const getMonacoLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    jsx: 'javascript', // Use javascript for JSX
    tsx: 'typescript', // Use typescript for TSX
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    xml: 'xml',
    yaml: 'yaml',
    markdown: 'markdown',
    python: 'python',
    java: 'java',
    csharp: 'csharp',
    cpp: 'cpp',
    c: 'c',
    php: 'php',
    ruby: 'ruby',
    go: 'go',
    rust: 'rust',
    swift: 'swift',
    kotlin: 'kotlin',
    scala: 'scala',
    shell: 'shell',
    powershell: 'powershell',
    sql: 'sql',
    dockerfile: 'dockerfile',
    plaintext: 'plaintext',
  };

  return languageMap[language] || 'plaintext';
};

export const CodeEditor: React.FC<CodeEditorProps> = memo(
  ({ value, language, fileName, onChange, readOnly = false }) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    // Redux hooks
    const dispatch = useAppDispatch();
    const selectedFile = useAppSelector(
      (state: RootState) => state.main.selectedFile,
    );

    // Save file function
    const saveFile = useCallback(async () => {
      if (!selectedFile || !selectedFile.path) {
        console.warn('No file selected to save');
        return;
      }

      if (isSaving) {
        console.log('Save already in progress');
        return;
      }

      // Get current content directly from Monaco editor
      const currentContent = editorRef.current?.getValue();
      if (currentContent === undefined) {
        console.warn('Could not get content from editor');
        return;
      }

      try {
        setIsSaving(true);
        console.log(
          'Saving file:',
          selectedFile.path,
          'with content length:',
          currentContent.length,
        );

        const result = await window.electron.saveFile(
          selectedFile.path,
          currentContent,
        );

        if (result.success) {
          console.log('File saved successfully:', result.path);

          // Verify the save by reading the file back
          try {
            const verifyResult = await window.electron.readFile(
              selectedFile.path,
            );
            if (verifyResult.content === currentContent) {
              console.log(
                '✅ Save verified - file content matches what we saved',
              );
            } else {
              console.error(
                '❌ Save verification failed - file content does not match',
              );
              console.log(
                'Expected length:',
                currentContent.length,
                'Actual length:',
                verifyResult.content.length,
              );
            }
          } catch (verifyError) {
            console.warn('Could not verify save:', verifyError);
          }

          // Update Redux state with the saved content to keep it in sync
          dispatch(updateSelectedFileContent(currentContent));
          // You could add a toast notification here if you have one
        }
      } catch (error) {
        console.error('Error saving file:', error);
        logError('File Save', error);

        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        alert(`Error saving file: ${errorMessage}`);
      } finally {
        setIsSaving(false);
      }
    }, [selectedFile, isSaving, dispatch]);

    // Menu event listeners
    useEffect(() => {
      const unsubscribeSave = window.electron.onMenuSaveFile?.(saveFile);
      const unsubscribeOpen = window.electron.onMenuOpenFile?.(() => {
        // You could implement open file from menu here if needed
        console.log('Open file from menu');
      });

      return () => {
        unsubscribeSave?.();
        unsubscribeOpen?.();
      };
    }, [saveFile]);

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

    const handleEditorDidMount = (
      editor: monaco.editor.IStandaloneCodeEditor,
      monacoInstance: Monaco,
    ) => {
      try {
        console.log('Monaco Editor mounting...');
        editorRef.current = editor;

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

        // Configure Monaco for VS Code-like behavior
        monacoInstance.editor.defineTheme('vs-dark-custom', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': '#0d1117',
            'editor.foreground': '#fafafa',
            'editor.lineHighlightBackground': '#1c2333',
            'editor.selectionBackground': '#264f78',
            'editor.inactiveSelectionBackground': '#3a3d41',
            'editorCursor.foreground': '#fafafa',
            'editorWhitespace.foreground': '#3c4043',
          },
        });

        monacoInstance.editor.setTheme('vs-dark-custom');

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
          editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS,
            () => {
              try {
                saveFile();
              } catch (error) {
                logError('Monaco Save Command', error);
              }
            },
          );
        } catch (error) {
          logError('Monaco Command Registration', error);
        }

        // Focus the editor safely
        try {
          editor.focus();
        } catch (error) {
          logError('Monaco Focus', error);
        }

        console.log('Monaco Editor mounted successfully');
      } catch (error) {
        console.error('Error configuring Monaco Editor:', error);
        logError('Monaco Editor configuration', error);
        setHasError(true);
        setErrorMessage(`Configuration error: ${error}`);
        throw normalizeError(error);
      }
    };

    const handleEditorChange = (value: string | undefined) => {
      try {
        // Update Redux state with the new content for real-time tracking
        if (value !== undefined && selectedFile) {
          dispatch(updateSelectedFileContent(value));
        }

        // Call the original onChange callback
        onChange?.(value);
      } catch (error) {
        console.error('Error in editor change callback:', error);
        logError('Monaco Editor change', error);
        setHasError(true);
        setErrorMessage(`Change error: ${error}`);
      }
    };

    // Handle Monaco Editor loading errors
    const handleBeforeMount = (monaco: Monaco) => {
      try {
        console.log('Monaco Editor pre-configuration...');

        // Set up global Monaco error handling
        if (typeof window !== 'undefined') {
          (window as any).MonacoEnvironment = {
            ...(window as any).MonacoEnvironment,
            onError: (error: any) => {
              console.error('Monaco Environment Error:', error);
              logError('Monaco Environment', error);
              setHasError(true);
              setErrorMessage(`Environment error: ${error}`);
            },
          };
        }
      } catch (error) {
        console.error('Error in Monaco beforeMount:', error);
        logError('Monaco Editor beforeMount', error);
        setHasError(true);
        setErrorMessage(`Before mount error: ${error}`);
        throw normalizeError(error);
      }
    };

    // Error fallback component
    if (hasError) {
      return (
        <EditorContainer>
          <EditorHeader>
            <FileName>{fileName}</FileName>
          </EditorHeader>
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

    return (
      <EditorContainer>
        <EditorHeader>
          <FileName>
            {fileName}
            {isSaving && (
              <Box component="span" ml={1}>
                <CircularProgress size={12} />
              </Box>
            )}
          </FileName>
        </EditorHeader>
        <EditorWrapper>
          <Editor
            height="100%"
            language={monacoLanguage}
            value={value}
            path={`file:///${fileName}`}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            beforeMount={handleBeforeMount}
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
