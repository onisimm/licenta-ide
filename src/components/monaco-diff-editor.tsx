import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../shared/hooks';
import { GitDiffResult, GitStagedDiffResult } from '../main/types/git';

interface MonacoDiffEditorProps {
  filePath: string;
  onClose: () => void;
  showStaged?: boolean; // Whether to show staged diff or working tree diff
}

export const MonacoDiffEditor: React.FC<MonacoDiffEditorProps> = ({
  filePath,
  onClose,
  showStaged = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);
  const [diffData, setDiffData] = useState<
    GitDiffResult | GitStagedDiffResult | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const folderPath = useAppSelector(state => state.main.folderStructure.root);

  // Load diff data
  const loadDiffData = async () => {
    if (!folderPath || !filePath) return;

    setLoading(true);
    setError(null);

    try {
      let result: GitDiffResult | GitStagedDiffResult;

      if (showStaged) {
        result = await window.electron.gitGetStagedDiff(folderPath, filePath);
      } else {
        result = await window.electron.gitGetFileDiff(folderPath, filePath);
      }

      setDiffData(result);
    } catch (err) {
      console.error('Error loading diff data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load diff');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Monaco diff editor
  useEffect(() => {
    if (!containerRef.current || !diffData) return;

    // Dispose existing editor
    if (editorRef.current) {
      editorRef.current.dispose();
    }

    // Get file extension for language detection
    const fileExtension = filePath.split('.').pop() || '';
    const language =
      monaco.languages
        .getLanguages()
        .find(lang => lang.extensions?.includes(`.${fileExtension}`))?.id ||
      'plaintext';

    // Create models for original and modified content
    const originalContent = diffData.originalContent;
    const modifiedContent = showStaged
      ? (diffData as GitStagedDiffResult).stagedContent
      : (diffData as GitDiffResult).currentContent;

    const originalModel = monaco.editor.createModel(originalContent, language);
    const modifiedModel = monaco.editor.createModel(modifiedContent, language);

    // Create diff editor
    const diffEditor = monaco.editor.createDiffEditor(containerRef.current, {
      theme: 'vs-dark',
      readOnly: true,
      renderSideBySide: true,
      enableSplitViewResizing: true,
      renderOverviewRuler: true,
      scrollBeyondLastLine: false,
      minimap: { enabled: true },
      wordWrap: 'on',
      fontSize: 14,
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      selectOnLineNumbers: true,
      automaticLayout: true,
    });

    // Set the models
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    editorRef.current = diffEditor;

    // Cleanup function
    return () => {
      originalModel.dispose();
      modifiedModel.dispose();
      diffEditor.dispose();
    };
  }, [diffData, filePath, showStaged]);

  // Load diff data on mount and when dependencies change
  useEffect(() => {
    loadDiffData();
  }, [folderPath, filePath, showStaged]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}>
        <Typography variant="body2" color="text.secondary">
          Loading diff...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
        <IconButton onClick={loadDiffData} size="small">
          <RefreshIcon />
        </IconButton>
      </Box>
    );
  }

  if (!diffData?.hasChanges) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}>
        <Typography variant="body2" color="text.secondary">
          No changes detected in this file
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 1,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
          {showStaged ? 'Staged Changes' : 'Working Tree Changes'}: {filePath}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh diff">
            <IconButton onClick={loadDiffData} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close diff view">
            <IconButton onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Diff Editor */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          minHeight: 0, // Important for flex child to shrink
        }}
      />
    </Box>
  );
};
