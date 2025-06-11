import React, { memo, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  TextField,
  Divider,
  Collapse,
  styled,
  alpha,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Refresh as RefreshIcon,
  CloudUpload as PushIcon,
  CloudDownload as PullIcon,
  Commit as CommitIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UnstagedIcon,
  Restore as RestoreIcon,
  Undo as UndoIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../shared/hooks';

// Types for Git status
interface GitFileStatus {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked';
  staged: boolean;
}

interface GitStatus {
  files: GitFileStatus[];
  branch: string;
  ahead: number;
  behind: number;
  isClean: boolean;
}

interface GitBranchInfo {
  current: string;
  remote?: string;
  ahead: number;
  behind: number;
}

// Styled components
const SourceContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '13px',
  fontFamily: '"Segoe UI", "Monaco", "Cascadia Code", monospace',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
  cursor: 'pointer',
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const FileListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  marginBottom: theme.spacing(1),
}));

const FileItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.spacing(0.5),
  cursor: 'pointer',
  fontSize: '12px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const FileName = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontSize: '10px',
  height: 18,
  '& .MuiChip-label': {
    padding: theme.spacing(0, 0.5),
  },
}));

const CommitSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const CommitInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiInputBase-root': {
    fontSize: '12px',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
  },
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const BranchInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.spacing(0.5),
  fontSize: '12px',
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60%',
  gap: theme.spacing(2),
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

const NoFolderMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50%',
  gap: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

// Status color mapping
const getStatusColor = (status: string, staged: boolean) => {
  if (staged) return 'success';

  switch (status) {
    case 'modified':
      return 'warning';
    case 'added':
      return 'success';
    case 'deleted':
      return 'error';
    case 'untracked':
      return 'info';
    case 'renamed':
      return 'secondary';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'modified':
      return 'M';
    case 'added':
      return 'A';
    case 'deleted':
      return 'D';
    case 'untracked':
      return 'U';
    case 'renamed':
      return 'R';
    default:
      return '?';
  }
};

export const SourceSection = memo(() => {
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [branchInfo, setBranchInfo] = useState<GitBranchInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    changes: true,
    staged: true,
  });
  const [restoreDialog, setRestoreDialog] = useState<{
    open: boolean;
    filePath: string;
  }>({
    open: false,
    filePath: '',
  });
  const [pullDialog, setPullDialog] = useState<{
    open: boolean;
    errorInfo: any;
  }>({
    open: false,
    errorInfo: null,
  });

  // Get folder info from Redux
  const folderStructure = useAppSelector(state => state.main.folderStructure);
  const hasFolder = folderStructure && Object.keys(folderStructure).length > 0;
  const folderPath = folderStructure?.root;

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
        // Show divergent branches dialog
        setPullDialog({
          open: true,
          errorInfo: result.error,
        });
      } else {
        // Handle other errors
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
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              // TODO: Initialize Git repository
              console.log('Initialize Git repository');
            }}>
            Initialize Repository
          </Button>
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
        <BranchInfo>
          <CommitIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" fontWeight="medium">
            {branchInfo.current}
          </Typography>
          {branchInfo.ahead > 0 && (
            <Chip
              label={`↑${branchInfo.ahead}`}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
          {branchInfo.behind > 0 && (
            <Chip
              label={`↓${branchInfo.behind}`}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={loadGitStatus}>
              <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </BranchInfo>
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

      <FileListContainer>
        {/* Changes Section */}
        {unstagedFiles.length > 0 && (
          <>
            <SectionHeader onClick={() => toggleSection('changes')}>
              <SectionTitle>
                {expandedSections.changes ? (
                  <ExpandLessIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16 }} />
                )}
                Changes ({unstagedFiles.length})
              </SectionTitle>
              <Tooltip title="Stage all changes">
                <IconButton size="small" onClick={handleStageAll}>
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </SectionHeader>
            <Collapse in={expandedSections.changes}>
              <Box>
                {unstagedFiles.map(file => (
                  <FileItem key={file.path}>
                    <Tooltip title={`Stage "${file.path}"`}>
                      <IconButton
                        size="small"
                        onClick={() => handleStageFile(file.path, false)}
                        sx={theme => ({
                          padding: 0.25,
                          color: theme.palette.text.secondary,
                          '&:hover': {
                            color: theme.palette.success.main,
                            backgroundColor: alpha(
                              theme.palette.success.main,
                              0.1,
                            ),
                          },
                        })}>
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    <StatusChip
                      label={getStatusIcon(file.status)}
                      size="small"
                      color={getStatusColor(file.status, false)}
                      variant="outlined"
                    />
                    <FileName>{file.path}</FileName>
                    {/* Only show restore for modified files (not new/untracked files) */}
                    {file.status !== 'untracked' && file.status !== 'added' && (
                      <Tooltip title={`Discard changes to "${file.path}"`}>
                        <IconButton
                          size="small"
                          onClick={() => handleRestoreFileClick(file.path)}
                          sx={theme => ({
                            padding: 0.25,
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              color: theme.palette.warning.main,
                              backgroundColor: alpha(
                                theme.palette.warning.main,
                                0.1,
                              ),
                            },
                          })}>
                          <UndoIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </FileItem>
                ))}
              </Box>
            </Collapse>
          </>
        )}

        {/* Staged Changes Section */}
        {stagedFiles.length > 0 && (
          <>
            <SectionHeader onClick={() => toggleSection('staged')}>
              <SectionTitle>
                {expandedSections.staged ? (
                  <ExpandLessIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16 }} />
                )}
                Staged Changes ({stagedFiles.length})
              </SectionTitle>
              <Tooltip title="Unstage all changes">
                <IconButton size="small" onClick={handleUnstageAll}>
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </SectionHeader>
            <Collapse in={expandedSections.staged}>
              <Box>
                {stagedFiles.map(file => (
                  <FileItem key={file.path}>
                    <Tooltip title={`Unstage "${file.path}"`}>
                      <IconButton
                        size="small"
                        onClick={() => handleStageFile(file.path, true)}
                        sx={theme => ({
                          padding: 0.25,
                          color: theme.palette.success.main,
                          '&:hover': {
                            color: theme.palette.text.secondary,
                            backgroundColor: alpha(
                              theme.palette.action.hover,
                              0.5,
                            ),
                          },
                        })}>
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    <StatusChip
                      label={getStatusIcon(file.status)}
                      size="small"
                      color={getStatusColor(file.status, true)}
                    />
                    <FileName>{file.path}</FileName>
                  </FileItem>
                ))}
              </Box>
            </Collapse>
          </>
        )}

        {/* Clean repository message */}
        {gitStatus.isClean && (
          <EmptyState>
            <CheckCircleIcon sx={{ fontSize: 32, opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              No changes detected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Your working tree is clean
            </Typography>
          </EmptyState>
        )}
      </FileListContainer>

      {/* Commit Section */}
      {stagedFiles.length > 0 && (
        <CommitSection>
          <CommitInput
            fullWidth
            placeholder="Commit message"
            value={commitMessage}
            onChange={e => setCommitMessage(e.target.value)}
            size="small"
            multiline
            rows={2}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<CommitIcon />}
            onClick={handleCommit}
            disabled={!commitMessage.trim()}
            fullWidth>
            Commit
          </Button>
        </CommitSection>
      )}

      {/* Restore Confirmation Dialog */}
      <Dialog
        open={restoreDialog.open}
        onClose={handleRestoreDialogClose}
        aria-labelledby="restore-dialog-title"
        aria-describedby="restore-dialog-description">
        <DialogTitle id="restore-dialog-title">Discard Changes?</DialogTitle>
        <DialogContent>
          <DialogContentText id="restore-dialog-description">
            Are you sure you want to discard all changes to{' '}
            <strong>{restoreDialog.filePath}</strong>?
            <br />
            <br />
            This will permanently delete your changes and restore the file to
            its last committed state. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestoreDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleRestoreFileConfirm}
            color="warning"
            variant="contained"
            startIcon={<UndoIcon />}>
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pull Strategy Dialog */}
      <Dialog
        open={pullDialog.open}
        onClose={handlePullDialogClose}
        aria-labelledby="pull-dialog-title"
        maxWidth="md"
        fullWidth>
        <DialogTitle id="pull-dialog-title">
          Resolve Divergent Branches
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{pullDialog.errorInfo?.message}</DialogContentText>
          <DialogContentText sx={{ mt: 1, mb: 2 }}>
            {pullDialog.errorInfo?.details}
          </DialogContentText>

          {pullDialog.errorInfo?.options?.map((option: any) => (
            <Box
              key={option.id}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={() => handlePullStrategy(option.id)}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                {option.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {option.description}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontFamily="monospace">
                {option.command}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePullDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </SourceContainer>
  );
});

export default SourceSection;
