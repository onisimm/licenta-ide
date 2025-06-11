import {
  Box,
  styled,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { memo, useEffect, useCallback, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../shared/hooks';
import {
  setFolderStructure,
  updateTreeItem,
  setExplorerExpanded,
  addTreeItem,
  collapseAllFolders,
} from '../shared/rdx-slice';
import { FileTree } from '../components/file-tree';
import { IFolderStructure, TFolderTree } from '../shared/types';
import { getFileIcon } from '../icons/file-types';
import {
  initializeGitIgnore,
  getGitIgnoreChecker,
} from '../shared/gitignore-utils';
import { DefaultButton } from '../components/buttons';

const ExplorerContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  overflow: 'hidden',
}));

const OpenFolderButton = styled('button')(({ theme }) => ({
  outline: 'none',
  backgroundColor: 'transparent',
  color: theme.palette.text.secondary,
  fontSize: '12px',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

const RootFolderContainer = styled(Box)<{ isHovered?: boolean }>(
  ({ theme, isHovered }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    cursor: 'pointer',
    backgroundColor: isHovered ? theme.palette.action.hover : 'transparent',
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'relative',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
);

const RootExpandIcon = styled(Box)<{ isExpanded: boolean }>(
  ({ isExpanded }) => ({
    width: 16,
    height: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    cursor: 'pointer',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.15s ease-in-out',

    '&::before': {
      content: '"▶"',
      fontSize: '10px',
      color: '#8e8e8e',
    },
  }),
);

const RootFolderIcon = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(0.75),
  flexShrink: 0,
}));

const RootFolderName = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  opacity: 0,
  transition: 'opacity 0.2s ease',

  '.root-folder-container:hover &': {
    opacity: 1,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  width: 20,
  height: 20,
  padding: 2,
  color: theme.palette.text.secondary,

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },

  '& svg': {
    width: 14,
    height: 14,
  },
}));

const ExplorerContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(0.5, 0),
}));

const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '13px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

// Action button icons (simple SVG icons for now)
const NewFileIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M14,2H7L5,0H1A1,1,0,0,0,0,1V15a1,1,0,0,0,1,1H14a1,1,0,0,0,1-1V3A1,1,0,0,0,14,2ZM8,12H7V9H4V8H7V5H8V8h3V9H8Z" />
  </svg>
);

const NewFolderIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M14,2H7L5,0H1A1,1,0,0,0,0,1V15a1,1,0,0,0,1,1H14a1,1,0,0,0,1-1V3A1,1,0,0,0,14,2ZM8,10H7V7H5V6H7V4H8V6h2V7H8Z" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.65,2.35A8,8,0,0,0,2.35,13.65,8,8,0,0,0,13.65,2.35ZM12.24,3.76a6.5,6.5,0,1,1-8.48,8.48A6.5,6.5,0,0,1,12.24,3.76Z" />
    <path d="M8,4.5V8L10.25,6Z" />
  </svg>
);

const CollapseIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M9,9H7V7H9Zm4,0H11V7h2ZM5,9H3V7H5Zm4,4H7V11H9Zm4,0H11V11h2ZM5,13H3V11H5ZM9,5H7V3H9Zm4,0H11V3h2ZM5,5H3V3H5Z" />
  </svg>
);

// Helper function to mark files as git ignored
const markGitIgnoredFiles = (
  items: TFolderTree[],
  checker: any,
): TFolderTree[] => {
  return items.map(item => {
    const isGitIgnored = checker ? checker.isIgnored(item.path) : false;

    if (isGitIgnored) {
      console.log(`Git ignored: ${item.name} (${item.path})`);
    }

    return {
      ...item,
      isGitIgnored,
      children: item.children
        ? markGitIgnoredFiles(item.children, checker)
        : undefined,
    };
  });
};

export const ExplorerSection = memo(() => {
  const dispatch = useAppDispatch();
  const folderStructure = useAppSelector(state => state.main.folderStructure);
  const isRootExpanded = useAppSelector(
    state => state.main.sidebarState.explorerExpanded,
  );
  const lastClickedItem = useAppSelector(
    state => state.main.sidebarState.lastClickedItem,
  );
  const [isRootHovered, setIsRootHovered] = useState(false);

  // Modal state for input dialogs
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'file' | 'folder' | null;
    value: string;
  }>({
    isOpen: false,
    type: null,
    value: '',
  });

  const openFolder = useCallback(async () => {
    try {
      const folder: IFolderStructure = await window.electron.openFolder();
      if (folder && Object.keys(folder).length > 0) {
        // Initialize gitignore checker
        try {
          const gitIgnoreChecker = await initializeGitIgnore(folder.root);
          console.log(
            'GitIgnore patterns loaded:',
            gitIgnoreChecker.getPatterns(),
          );

          // Mark files as git ignored
          const updatedTree = markGitIgnoredFiles(
            folder.tree,
            gitIgnoreChecker,
          );

          dispatch(
            setFolderStructure({
              ...folder,
              tree: updatedTree,
            }),
          );
        } catch (error) {
          console.warn('Failed to initialize gitignore:', error);
          // Still set the folder structure without gitignore info
          dispatch(setFolderStructure(folder));
        }

        dispatch(setExplorerExpanded(true)); // Auto-expand when new folder is selected
      }
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    const unsubscribeOpen = window.electron?.onMenuOpenFile?.(openFolder);

    return () => {
      unsubscribeOpen?.();
    };
  }, [openFolder]);

  const handleUpdateTreeItem = useCallback(
    (path: string, updates: Partial<TFolderTree>) => {
      // If we're updating children, mark them as git ignored too
      if (updates.children) {
        const checker = getGitIgnoreChecker();
        if (checker) {
          updates.children = markGitIgnoredFiles(updates.children, checker);
        }
      }

      dispatch(updateTreeItem({ path, updates }));
    },
    [dispatch],
  );

  const handleNewFile = useCallback(() => {
    console.log('New file clicked');

    setModalState({
      isOpen: true,
      type: 'file',
      value: '',
    });
  }, []);

  const handleNewFolder = useCallback(() => {
    console.log('New folder clicked');

    setModalState({
      isOpen: true,
      type: 'folder',
      value: '',
    });
  }, []);

  const handleModalConfirm = useCallback(() => {
    const name = modalState.value.trim();
    if (!name) {
      return; // Empty name
    }

    let targetDirectory: string;

    if (!lastClickedItem) {
      // No item clicked - create in root
      targetDirectory = folderStructure.root;
    } else if (lastClickedItem.isDirectory) {
      // Folder was clicked - create inside it
      targetDirectory = lastClickedItem.path;
    } else {
      // File was clicked - create next to it (in same directory)
      targetDirectory = lastClickedItem.parentPath;
    }

    const itemPath =
      targetDirectory.endsWith('/') || targetDirectory.endsWith('\\')
        ? targetDirectory + name
        : targetDirectory + '/' + name;

    if (modalState.type === 'file') {
      // Create file
      window.electron
        ?.createFile?.(itemPath, '')
        .then(() => {
          console.log('File created successfully:', itemPath);

          const newItem: TFolderTree = {
            name,
            parentPath: targetDirectory,
            path: itemPath,
            isDirectory: false,
            children: undefined,
            childrenLoaded: undefined,
            isGitIgnored: false,
          };

          dispatch(addTreeItem({ parentPath: targetDirectory, newItem }));
        })
        .catch(error => {
          console.error('Error creating file:', error);
          alert(`Error creating file: ${error.message || error}`);
        });
    } else if (modalState.type === 'folder') {
      // Create folder
      window.electron
        ?.createFolder?.(itemPath)
        .then(() => {
          console.log('Folder created successfully:', itemPath);

          const newItem: TFolderTree = {
            name,
            parentPath: targetDirectory,
            path: itemPath,
            isDirectory: true,
            children: [],
            childrenLoaded: true,
            isGitIgnored: false,
          };

          dispatch(addTreeItem({ parentPath: targetDirectory, newItem }));
        })
        .catch(error => {
          console.error('Error creating folder:', error);
          alert(`Error creating folder: ${error.message || error}`);
        });
    }

    // Close modal
    setModalState({ isOpen: false, type: null, value: '' });
  }, [modalState, lastClickedItem, folderStructure.root, dispatch]);

  const handleModalCancel = useCallback(() => {
    setModalState({ isOpen: false, type: null, value: '' });
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('Refresh clicked');

    if (!folderStructure.root) {
      console.warn('No folder structure to refresh');
      return;
    }

    // Re-open the current folder to refresh the structure
    window.electron
      ?.openFolder?.()
      .then(async (folder: IFolderStructure) => {
        if (folder && Object.keys(folder).length > 0) {
          // Initialize gitignore checker
          try {
            const gitIgnoreChecker = await initializeGitIgnore(folder.root);
            console.log(
              'GitIgnore patterns loaded:',
              gitIgnoreChecker.getPatterns(),
            );

            // Mark files as git ignored
            const updatedTree = markGitIgnoredFiles(
              folder.tree,
              gitIgnoreChecker,
            );

            dispatch(
              setFolderStructure({
                ...folder,
                tree: updatedTree,
              }),
            );
          } catch (error) {
            console.warn('Failed to initialize gitignore:', error);
            // Still set the folder structure without gitignore info
            dispatch(setFolderStructure(folder));
          }
        }
      })
      .catch(error => {
        console.error('Error refreshing folder:', error);
        alert(`Error refreshing folder: ${error.message || error}`);
      });
  }, [folderStructure.root, dispatch]);

  const handleCollapseAll = useCallback(() => {
    console.log('Collapse all clicked');
    dispatch(collapseAllFolders());
  }, [dispatch]);

  const hasFolder = folderStructure && Object.keys(folderStructure).length > 0;

  return (
    <ExplorerContainer>
      {hasFolder && (
        <OpenFolderButton onClick={openFolder}>Change Folder</OpenFolderButton>
      )}

      {hasFolder ? (
        <>
          <RootFolderContainer
            className="root-folder-container"
            isHovered={isRootHovered}
            onMouseEnter={() => setIsRootHovered(true)}
            onMouseLeave={() => setIsRootHovered(false)}>
            <RootExpandIcon
              isExpanded={isRootExpanded}
              onClick={e => {
                e.stopPropagation();
                dispatch(setExplorerExpanded(!isRootExpanded));
              }}
            />
            <RootFolderIcon>
              {getFileIcon(folderStructure.name, true, isRootExpanded)}
            </RootFolderIcon>
            <RootFolderName
              title={folderStructure.name}
              onClick={() => dispatch(setExplorerExpanded(!isRootExpanded))}>
              {folderStructure.name}
            </RootFolderName>
            <ActionButtonsContainer>
              <Tooltip title="New File" placement="top">
                <ActionButton onClick={handleNewFile}>
                  <NewFileIcon />
                </ActionButton>
              </Tooltip>
              <Tooltip title="New Folder" placement="top">
                <ActionButton onClick={handleNewFolder}>
                  <NewFolderIcon />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Refresh" placement="top">
                <ActionButton onClick={handleRefresh}>
                  <RefreshIcon />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Collapse All" placement="top">
                <ActionButton onClick={handleCollapseAll}>
                  <CollapseIcon />
                </ActionButton>
              </Tooltip>
            </ActionButtonsContainer>
          </RootFolderContainer>

          {isRootExpanded && (
            <ExplorerContent>
              <FileTree
                items={folderStructure.tree}
                onUpdateItem={handleUpdateTreeItem}
              />
            </ExplorerContent>
          )}
        </>
      ) : (
        <EmptyState>
          No folder selected.
          <br />
          <DefaultButton onClick={openFolder}>Open Folder</DefaultButton>
        </EmptyState>
      )}

      {/* Input Modal */}
      <Dialog
        open={modalState.isOpen}
        onClose={handleModalCancel}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>
          {modalState.type === 'file' ? 'Create New File' : 'Create New Folder'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={modalState.type === 'file' ? 'File name' : 'Folder name'}
            fullWidth
            variant="outlined"
            value={modalState.value}
            onChange={e =>
              setModalState(prev => ({ ...prev, value: e.target.value }))
            }
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleModalConfirm();
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                handleModalCancel();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalCancel}>Cancel</Button>
          <Button
            onClick={handleModalConfirm}
            variant="contained"
            disabled={!modalState.value.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </ExplorerContainer>
  );
});

export const EmptySection = memo(() => {
  return (
    <ExplorerContainer>
      <EmptyState>Nothing here yet</EmptyState>
    </ExplorerContainer>
  );
});
