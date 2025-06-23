import React, { memo, useState, useEffect, useCallback } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import {
  CloudUpload as PushIcon,
  CloudDownload as PullIcon,
  Commit as CommitIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../shared/hooks';
import { useProjectOperations } from '../../shared/hooks';
import { BranchInfo } from './BranchInfo';
import { FileList } from './FileList';
import { CommitSection } from './CommitSection';
import { Dialogs } from './Dialogs';
import { BranchDialog } from './BranchDialog';
import { UncommittedChangesDialog } from './UncommittedChangesDialog';
import {
  SourceContainer,
  ActionButtonsContainer,
  EmptyState,
  NoFolderMessage,
  LoadingContainer,
  ScrollableFileArea,
} from './styles';
import {
  GitStatus,
  GitBranchInfo,
  DialogState,
  ExpandedSections,
  GitFileStatus,
  GitBranch,
  BranchDialogState,
} from './types';

export const SourceSection = memo(() => {
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [branchInfo, setBranchInfo] = useState<GitBranchInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    changes: true,
    staged: true,
  });
  const [restoreDialog, setRestoreDialog] = useState<DialogState>({
    open: false,
    filePath: '',
  });
  const [deleteDialog, setDeleteDialog] = useState<DialogState>({
    open: false,
    filePath: '',
  });
  const [pullDialog, setPullDialog] = useState<DialogState>({
    open: false,
    errorInfo: null,
  });
  const [branchDialog, setBranchDialog] = useState<BranchDialogState>({
    open: false,
    type: null,
    branches: [],
    selectedBranch: '',
  });
  const [uncommittedChangesDialog, setUncommittedChangesDialog] = useState<{
    open: boolean;
    targetBranch: string;
  }>({
    open: false,
    targetBranch: '',
  });

  // Get folder info from Redux
  const folderStructure = useAppSelector(state => state.main.folderStructure);
  const hasFolder = folderStructure && Object.keys(folderStructure).length > 0;
  const folderPath = folderStructure?.root;

  // Get project operations for opening files
  const { openFileAtLineWithOptions } = useProjectOperations();

  // Load Git status
  const loadGitStatus = useCallback(async () => {
    if (!folderPath) return;

    setIsLoading(true);
    try {
      const status = await window.electron.getGitStatus(folderPath);
      setGitStatus(status);

      const branch = await window.electron.getGitBranch(folderPath);
      setBranchInfo(branch);
    } catch (error) {
      console.error('Error loading Git status:', error);
      setGitStatus(null);
      setBranchInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [folderPath]);

  // Load Git status when folder changes
  useEffect(() => {
    if (hasFolder && folderPath) {
      loadGitStatus();
    } else {
      setGitStatus(null);
      setBranchInfo(null);
    }
  }, [hasFolder, folderPath, loadGitStatus]);

  // Stage/unstage file
  const handleStageFile = useCallback(
    async (filePath: string, staged: boolean) => {
      if (!folderPath) return;

      try {
        if (staged) {
          await window.electron.gitUnstageFile(folderPath, filePath);
        } else {
          await window.electron.gitStageFile(folderPath, filePath);
        }
        await loadGitStatus();
      } catch (error) {
        console.error('Error staging/unstaging file:', error);
      }
    },
    [folderPath, loadGitStatus],
  );

  // Stage all changes
  const handleStageAll = useCallback(async () => {
    if (!folderPath || !gitStatus) return;

    try {
      await window.electron.gitStageAll(folderPath);
      await loadGitStatus();
    } catch (error) {
      console.error('Error staging all files:', error);
    }
  }, [folderPath, gitStatus, loadGitStatus]);

  // Unstage all changes
  const handleUnstageAll = useCallback(async () => {
    if (!folderPath || !gitStatus) return;

    try {
      await window.electron.gitUnstageAll(folderPath);
      await loadGitStatus();
    } catch (error) {
      console.error('Error unstaging all files:', error);
    }
  }, [folderPath, gitStatus, loadGitStatus]);

  // Commit staged files
  const handleCommit = useCallback(async () => {
    if (!folderPath || !commitMessage.trim()) return;

    try {
      await window.electron.gitCommit(folderPath, commitMessage);
      setCommitMessage('');
      await loadGitStatus();
    } catch (error) {
      console.error('Error committing files:', error);
    }
  }, [folderPath, commitMessage, loadGitStatus]);

  // Push changes
  const handlePush = useCallback(async () => {
    if (!folderPath) return;

    try {
      await window.electron.gitPush(folderPath);
      await loadGitStatus();
    } catch (error) {
      console.error('Error pushing changes:', error);
    }
  }, [folderPath, loadGitStatus]);

  // Pull changes
  const handlePull = useCallback(async () => {
    if (!folderPath) return;

    try {
      const result = await window.electron.gitPull(folderPath);

      if (result.success) {
        await loadGitStatus();
      } else if (result.error?.type === 'divergent_branches') {
        setPullDialog({
          open: true,
          errorInfo: result.error,
        });
      } else {
        console.error('Pull failed:', result.error?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error pulling changes:', error);
    }
  }, [folderPath, loadGitStatus]);

  // Toggle section expansion
  const toggleSection = useCallback((section: 'changes' | 'staged') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Handle restore file confirmation
  const handleRestoreFileClick = useCallback((filePath: string) => {
    setRestoreDialog({
      open: true,
      filePath,
    });
  }, []);

  // Handle delete file confirmation for untracked files
  const handleDeleteFileClick = useCallback((filePath: string) => {
    setDeleteDialog({
      open: true,
      filePath,
    });
  }, []);

  // Handle discard action - either restore or delete based on file status
  const handleDiscardClick = useCallback(
    (file: GitFileStatus) => {
      if (file.status === 'untracked') {
        handleDeleteFileClick(file.path);
      } else {
        handleRestoreFileClick(file.path);
      }
    },
    [handleDeleteFileClick, handleRestoreFileClick],
  );

  // Handle restore file confirmation
  const handleRestoreFileConfirm = useCallback(async () => {
    if (!folderPath || !restoreDialog.filePath) return;

    try {
      await window.electron.gitRestoreFile(folderPath, restoreDialog.filePath);
      await loadGitStatus();
      setRestoreDialog({ open: false, filePath: '' });
    } catch (error) {
      console.error('Error restoring file:', error);
    }
  }, [folderPath, restoreDialog.filePath, loadGitStatus]);

  // Handle restore dialog close
  const handleRestoreDialogClose = useCallback(() => {
    setRestoreDialog({ open: false, filePath: '' });
  }, []);

  // Handle delete file confirmation
  const handleDeleteFileConfirm = useCallback(async () => {
    if (!folderPath || !deleteDialog.filePath) return;

    try {
      const fullPath =
        folderPath.endsWith('/') || folderPath.endsWith('\\')
          ? folderPath + deleteDialog.filePath
          : folderPath + '/' + deleteDialog.filePath;

      await window.electron.deleteFile(fullPath);
      await loadGitStatus();
      setDeleteDialog({ open: false, filePath: '' });
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }, [folderPath, deleteDialog.filePath, loadGitStatus]);

  // Handle delete dialog close
  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialog({ open: false, filePath: '' });
  }, []);

  // Handle pull dialog close
  const handlePullDialogClose = useCallback(() => {
    setPullDialog({ open: false, errorInfo: null });
  }, []);

  // Handle pull strategy selection
  const handlePullStrategy = useCallback(
    async (strategy: string) => {
      if (!folderPath) return;

      try {
        let result;
        switch (strategy) {
          case 'merge':
            result = await window.electron.gitPullMerge(folderPath);
            break;
          case 'rebase':
            result = await window.electron.gitPullRebase(folderPath);
            break;
          case 'reset':
            result = await window.electron.gitResetToRemote(folderPath);
            break;
          default:
            console.error('Unknown pull strategy:', strategy);
            return;
        }

        if (result.success) {
          await loadGitStatus();
          setPullDialog({ open: false, errorInfo: null });
        }
      } catch (error) {
        console.error(`Error with ${strategy} strategy:`, error);
      }
    },
    [folderPath, loadGitStatus],
  );

  // Branch operation handlers
  const handleBranchDialogOpen = useCallback(
    async (type: 'switch' | 'create' | 'delete') => {
      if (!folderPath) return;

      try {
        // Load branches for switch/delete operations
        if (type === 'switch' || type === 'delete') {
          const result = await window.electron.gitListBranches(folderPath);
          setBranchDialog({
            open: true,
            type,
            branches: result.branches,
            selectedBranch: '',
          });
        } else {
          setBranchDialog({
            open: true,
            type,
            branches: [],
            selectedBranch: '',
          });
        }
      } catch (error) {
        console.error('Error loading branches:', error);
      }
    },
    [folderPath],
  );

  const handleBranchDialogClose = useCallback(() => {
    setBranchDialog({
      open: false,
      type: null,
      branches: [],
      selectedBranch: '',
    });
  }, []);

  const handleSwitchBranch = useCallback(
    async (branchName: string, force: boolean = false) => {
      if (!folderPath) return;

      try {
        const result = await window.electron.gitSwitchBranch(
          folderPath,
          branchName,
          force,
        );

        // If the switch failed due to uncommitted changes, show the dialog
        if (!result.success && result.error?.type === 'uncommitted_changes') {
          setUncommittedChangesDialog({
            open: true,
            targetBranch: branchName,
          });
          return;
        }

        await loadGitStatus();
      } catch (error) {
        console.error('Error switching branch:', error);
        throw error;
      }
    },
    [folderPath, loadGitStatus],
  );

  const handleCreateBranch = useCallback(
    async (branchName: string, switchToBranch: boolean) => {
      if (!folderPath) return;

      try {
        const result = await window.electron.gitCreateBranch(
          folderPath,
          branchName,
          switchToBranch,
        );

        // If successful, refresh Git status
        if (result.success) {
          await loadGitStatus();
        }

        // Return the result so BranchDialog can handle errors
        return result;
      } catch (error) {
        console.error('Error creating branch:', error);
        throw error;
      }
    },
    [folderPath, loadGitStatus],
  );

  const handleDeleteBranch = useCallback(
    async (branchName: string, force: boolean) => {
      if (!folderPath) return;

      try {
        await window.electron.gitDeleteBranch(folderPath, branchName, force);
        await loadGitStatus();
      } catch (error) {
        console.error('Error deleting branch:', error);
        throw error;
      }
    },
    [folderPath, loadGitStatus],
  );

  // Uncommitted changes dialog handlers
  const handleUncommittedChangesDialogClose = useCallback(() => {
    setUncommittedChangesDialog({
      open: false,
      targetBranch: '',
    });
  }, []);

  const handleStashAndSwitch = useCallback(
    async (stashMessage?: string) => {
      if (!folderPath || !uncommittedChangesDialog.targetBranch) return;

      try {
        await window.electron.gitStashAndSwitch(
          folderPath,
          uncommittedChangesDialog.targetBranch,
          stashMessage,
        );
        await loadGitStatus();
      } catch (error) {
        console.error('Error stashing and switching branch:', error);
        throw error;
      }
    },
    [folderPath, uncommittedChangesDialog.targetBranch, loadGitStatus],
  );

  const handleForceSwitch = useCallback(async () => {
    if (!folderPath || !uncommittedChangesDialog.targetBranch) return;

    try {
      await handleSwitchBranch(uncommittedChangesDialog.targetBranch, true);
    } catch (error) {
      console.error('Error force switching branch:', error);
      throw error;
    }
  }, [folderPath, uncommittedChangesDialog.targetBranch, handleSwitchBranch]);

  // Handle file click to open in editor
  const handleFileClick = useCallback(
    async (file: GitFileStatus) => {
      if (!folderPath) return;

      try {
        // Construct full file path
        const fullPath =
          folderPath.endsWith('/') || folderPath.endsWith('\\')
            ? folderPath + file.path
            : folderPath + '/' + file.path;

        // Open file in editor at line 1, with read-only for staged files
        await openFileAtLineWithOptions(fullPath, 1, { readOnly: file.staged });

        console.log(
          `Opened file: ${file.path} (staged: ${file.staged}, readOnly: ${file.staged})`,
        );
      } catch (error) {
        console.error('Error opening file:', error);
      }
    },
    [folderPath, openFileAtLineWithOptions],
  );

  // Handle show diff for file
  const handleShowDiff = useCallback(
    async (file: GitFileStatus) => {
      if (!folderPath) return;

      try {
        // First, open the file in the main editor
        const fullPath =
          folderPath.endsWith('/') || folderPath.endsWith('\\')
            ? folderPath + file.path
            : folderPath + '/' + file.path;

        // Open file in editor at line 1, with read-only for staged files
        await openFileAtLineWithOptions(fullPath, 1, { readOnly: file.staged });

        // Then trigger diff view in the editor after a small delay
        // to ensure the file is fully loaded
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('show-git-diff', {
              detail: {
                filePath: file.path,
                showStaged: file.staged,
              },
            }),
          );
        }, 100);

        console.log(
          `Opened file with diff view: ${file.path} (staged: ${file.staged})`,
        );
      } catch (error) {
        console.error('Error opening file with diff:', error);
      }
    },
    [folderPath, openFileAtLineWithOptions],
  );

  // No folder opened
  if (!hasFolder) {
    return (
      <SourceContainer>
        <NoFolderMessage>
          <CommitIcon sx={{ fontSize: 48, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary">
            No Folder Opened
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Open a folder to see Git status
          </Typography>
        </NoFolderMessage>
      </SourceContainer>
    );
  }

  // Loading state
  if (isLoading && !gitStatus) {
    return (
      <SourceContainer>
        <LoadingContainer>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Loading Git status...
          </Typography>
        </LoadingContainer>
      </SourceContainer>
    );
  }

  // Not a Git repository
  if (!gitStatus) {
    return (
      <SourceContainer>
        <EmptyState>
          <CommitIcon sx={{ fontSize: 48, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary">
            Not a Git Repository
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Initialize Git or open a Git repository to see version control
            features
          </Typography>
        </EmptyState>
      </SourceContainer>
    );
  }

  // Separate files by staging status
  const unstagedFiles = gitStatus.files.filter(file => !file.staged);
  const stagedFiles = gitStatus.files.filter(file => file.staged);

  return (
    <SourceContainer>
      {/* Branch Information */}
      {branchInfo && (
        <BranchInfo
          branchInfo={branchInfo}
          onRefresh={loadGitStatus}
          onSwitchBranch={() => handleBranchDialogOpen('switch')}
          onCreateBranch={() => handleBranchDialogOpen('create')}
          onDeleteBranch={() => handleBranchDialogOpen('delete')}
        />
      )}

      {/* Action Buttons */}
      <ActionButtonsContainer>
        {branchInfo?.behind > 0 && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<PullIcon />}
            onClick={handlePull}
            fullWidth>
            Pull
          </Button>
        )}
        {branchInfo?.ahead > 0 && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<PushIcon />}
            onClick={handlePush}
            fullWidth>
            Push
          </Button>
        )}
      </ActionButtonsContainer>

      {/* Scrollable File Lists Area */}
      {stagedFiles.length > 0 || unstagedFiles.length > 0 ? (
        <>
          <ScrollableFileArea>
            <FileList
              title="Changes"
              files={unstagedFiles}
              expanded={expandedSections.changes}
              onToggle={() => toggleSection('changes')}
              onStageFile={handleStageFile}
              onDiscardFile={handleDiscardClick}
              onStageAll={handleStageAll}
              onFileClick={handleFileClick}
              onShowDiff={handleShowDiff}
            />
            {stagedFiles.length > 0 && (
              <FileList
                title="Staged Changes"
                files={stagedFiles}
                expanded={expandedSections.staged}
                onToggle={() => toggleSection('staged')}
                onStageFile={handleStageFile}
                onDiscardFile={handleDiscardClick}
                onUnstageAll={handleUnstageAll}
                onFileClick={handleFileClick}
                onShowDiff={handleShowDiff}
              />
            )}
          </ScrollableFileArea>

          {/* Commit Section - Always at bottom when there are staged files */}
          {stagedFiles.length > 0 && (
            <CommitSection
              commitMessage={commitMessage}
              onCommitMessageChange={setCommitMessage}
              onCommit={handleCommit}
            />
          )}
        </>
      ) : (
        /* Clean repository message */
        gitStatus.isClean && (
          <EmptyState>
            <CheckCircleIcon sx={{ fontSize: 32, opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              No changes detected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Your working tree is clean
            </Typography>
          </EmptyState>
        )
      )}

      {/* Dialogs */}
      <Dialogs
        restoreDialog={restoreDialog}
        deleteDialog={deleteDialog}
        pullDialog={pullDialog}
        onRestoreDialogClose={handleRestoreDialogClose}
        onRestoreFileConfirm={handleRestoreFileConfirm}
        onDeleteDialogClose={handleDeleteDialogClose}
        onDeleteFileConfirm={handleDeleteFileConfirm}
        onPullDialogClose={handlePullDialogClose}
        onPullStrategy={handlePullStrategy}
      />

      {/* Branch Dialog */}
      <BranchDialog
        dialogState={branchDialog}
        onClose={handleBranchDialogClose}
        onSwitchBranch={handleSwitchBranch}
        onCreateBranch={handleCreateBranch}
        onDeleteBranch={handleDeleteBranch}
      />

      {/* Uncommitted Changes Dialog */}
      <UncommittedChangesDialog
        open={uncommittedChangesDialog.open}
        targetBranch={uncommittedChangesDialog.targetBranch}
        onClose={handleUncommittedChangesDialogClose}
        onStashAndSwitch={handleStashAndSwitch}
        onForceSwitch={handleForceSwitch}
      />
    </SourceContainer>
  );
});
