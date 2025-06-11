import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  styled,
  Typography,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { TFolderTree } from '../shared/types';
import { getFileIcon } from '../icons/file-types';
import { useAppDispatch, useAppSelector } from '../shared/hooks';
import {
  setLoadingFile,
  openFileInTab,
  setLastClickedItem,
  removeTreeItem,
  renameTreeItem,
} from '../shared/rdx-slice';
import { getErrorMessage, logError, normalizeError } from '../shared/utils';

interface FileTreeProps {
  items: TFolderTree[];
  level?: number;
  onUpdateItem?: (path: string, updatedItem: Partial<TFolderTree>) => void;
}

interface FileItemProps {
  item: TFolderTree;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  onFileClick: (item: TFolderTree) => void;
  onUpdateItem?: (path: string, updatedItem: Partial<TFolderTree>) => void;
}

const TreeContainer = styled(Box)(({ theme }) => ({
  fontSize: '13px',
  fontFamily: '"Segoe UI", "Monaco", "Cascadia Code", monospace',
  color: theme.palette.text.primary,
  userSelect: 'none',
}));

const TreeItem = styled(Box, {
  shouldForwardProp: prop =>
    prop !== 'level' && prop !== 'isHovered' && prop !== 'isSelected',
})<{ level: number; isHovered: boolean; isSelected: boolean }>(
  ({ theme, level, isHovered, isSelected }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(level + 1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    cursor: 'pointer',
    fontSize: '13px',
    color: theme.palette.text.primary,
    userSelect: 'none',
    minHeight: 22,
    position: 'relative',
    backgroundColor: isSelected ? theme.palette.action.hover : 'transparent',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:active': {
      backgroundColor: theme.palette.action.hover,
    },

    // Custom hover effect for better UX
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      pointerEvents: 'none',
    },
  }),
);

const ExpandIcon = styled(Box)<{
  isExpanded: boolean;
  isDirectory: boolean;
  hasPreloadedChildren?: boolean;
  isGitIgnored?: boolean;
}>(({ isExpanded, isDirectory, hasPreloadedChildren, isGitIgnored }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 4,
  opacity: isDirectory ? (isGitIgnored ? 0.4 : 1) : 0,
  cursor: isDirectory ? 'pointer' : 'default',
  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
  transition: 'transform 0.15s ease-in-out',

  '&::before': {
    content: isDirectory ? '"▶"' : '""',
    fontSize: '10px',
    color: isGitIgnored ? '#6e6e6e' : '#8e8e8e',
  },
}));

const FileIcon = styled(Box, {
  shouldForwardProp: prop => prop !== 'isGitIgnored',
})<{ isGitIgnored: boolean }>(({ theme, isGitIgnored }) => ({
  width: 16,
  height: 16,
  marginRight: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: isGitIgnored
    ? theme.palette.fileTree.gitIgnored
    : theme.palette.fileTree.fileIcon,
}));

const FileName = styled('span', {
  shouldForwardProp: prop => prop !== 'isDirectory',
})<{ isDirectory: boolean; isGitIgnored: boolean }>(
  ({ theme, isDirectory, isGitIgnored }) => ({
    fontSize: '13px',
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    fontWeight: isDirectory ? 500 : 400,
    color: isGitIgnored
      ? theme.palette.fileTree.gitIgnored
      : theme.palette.fileTree.fileIcon,
  }),
);

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '14px',
}));

const FileItem: React.FC<FileItemProps> = ({
  item,
  level,
  isExpanded,
  onToggle,
  onFileClick,
  onUpdateItem,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const lastClickedItem = useAppSelector(
    state => state.main.sidebarState.lastClickedItem,
  );

  // Check if this item is the currently selected one
  const isSelected = lastClickedItem?.path === item.path;

  const handleToggle = useCallback(async () => {
    if (!item.isDirectory) return;

    // If expanding and children haven't been loaded yet, load them
    if (!isExpanded && !item.childrenLoaded && !item.isLoading) {
      // Set loading state
      onUpdateItem?.(item.path, { isLoading: true });

      try {
        // Load 2 levels deep for better UX
        const children = await window.electron.loadDirectoryChildren(item.path);

        // Update the item with loaded children
        onUpdateItem?.(item.path, {
          children: children,
          childrenLoaded: true,
          isLoading: false,
        });
      } catch (error) {
        logError('Directory loading', error);

        onUpdateItem?.(item.path, {
          children: [],
          childrenLoaded: true,
          isLoading: false,
        });
      }
    }

    onToggle();
  }, [item, isExpanded, onToggle, onUpdateItem]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // Always track the last clicked item (for both files and folders)
      dispatch(setLastClickedItem(item));

      if (item.isDirectory) {
        handleToggle();
      } else {
        onFileClick(item);
      }
    },
    [item, handleToggle, onFileClick, dispatch],
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Dispatch custom event to parent component
      const contextMenuEvent = new CustomEvent('fileItemContextMenu', {
        detail: { event: e, item },
      });
      document.dispatchEvent(contextMenuEvent);
    },
    [item],
  );

  // Determine if this directory has children or could have children
  const hasChildren = item.children && item.children.length > 0;
  const couldHaveChildren =
    item.isDirectory && (!item.childrenLoaded || hasChildren);

  return (
    <>
      <Tooltip
        title={item.isGitIgnored ? 'This file is ignored by git' : ''}
        placement="top"
        disableHoverListener={!item.isGitIgnored}
        disableInteractive>
        <TreeItem
          level={level}
          isHovered={isHovered}
          isSelected={isSelected}
          onClick={handleClick}
          onContextMenu={handleRightClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          <ExpandIcon
            isExpanded={isExpanded}
            isDirectory={couldHaveChildren}
            hasPreloadedChildren={item.childrenLoaded && hasChildren}
            isGitIgnored={item.isGitIgnored}
            onClick={e => {
              e.stopPropagation();
              if (item.isDirectory) {
                handleToggle();
              }
            }}
          />
          <FileIcon isGitIgnored={item.isGitIgnored}>
            {getFileIcon(item.name, item.isDirectory, isExpanded)}
          </FileIcon>
          <FileName
            isDirectory={item.isDirectory}
            isGitIgnored={item.isGitIgnored}>
            {item.name}
          </FileName>
          {item.isLoading && <LoadingSpinner size={12} thickness={4} />}
        </TreeItem>
      </Tooltip>

      {item.isDirectory && isExpanded && hasChildren && (
        <FileTree
          items={item.children}
          level={level + 1}
          onUpdateItem={onUpdateItem}
        />
      )}
    </>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({
  items,
  level = 0,
  onUpdateItem,
}) => {
  const dispatch = useAppDispatch();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const collapseTimestamp = useAppSelector(
    state => state.main.sidebarState.collapseTimestamp,
  );

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    item: TFolderTree | null;
  } | null>(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    item: TFolderTree | null;
    type: 'delete' | null;
  }>({
    isOpen: false,
    item: null,
    type: null,
  });

  // Rename dialog state
  const [renameDialog, setRenameDialog] = useState<{
    isOpen: boolean;
    item: TFolderTree | null;
    newName: string;
  }>({
    isOpen: false,
    item: null,
    newName: '',
  });

  // Add error handling for this component
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection in FileTree:', event.reason);
      logError('FileTree Promise Rejection', event.reason);
      event.preventDefault();
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Error in FileTree:', event.error);
      logError('FileTree Error', event.error || event.message);
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection,
      );
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Listen for collapse all action and clear expanded items
  useEffect(() => {
    if (collapseTimestamp > 0) {
      setExpandedItems(new Set());
    }
  }, [collapseTimestamp]);

  // Use useMemo to prevent unnecessary re-creation of tree items
  const treeItems = useMemo(() => items, [items]);

  const toggleExpanded = useCallback((path: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  const handleUpdateItem = useCallback(
    (path: string, updatedItem: Partial<TFolderTree>) => {
      // Propagate to parent immediately without local state management
      if (onUpdateItem) {
        onUpdateItem(path, updatedItem);
      }
    },
    [onUpdateItem],
  );

  const handleFileClick = useCallback(
    async (item: TFolderTree) => {
      // Wrap the entire function in a try-catch to prevent any errors from escaping
      try {
        if (item.isDirectory) return;

        console.log('File clicked:', item.path);

        // Set loading state
        dispatch(setLoadingFile(true));

        // Add a small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 10));

        try {
          // Read file content with error handling
          const fileData = await Promise.resolve(
            window.electron.readFile(item.path),
          ).catch(error => {
            // Catch any IPC or file reading errors
            logError('IPC file reading', error);
            throw normalizeError(error);
          });

          console.log('File data:', fileData);

          // Validate file data
          if (!fileData || typeof fileData.content !== 'string') {
            throw new Error('Invalid file data received');
          }

          // Open file in tab system instead of just setting selected file
          dispatch(openFileInTab(fileData));
        } catch (fileError) {
          // Handle file reading errors
          logError('File loading', fileError);
          dispatch(setLoadingFile(false));

          // Show error notification to user
          const errorMessage = getErrorMessage(fileError);
          alert(`Error loading file: ${errorMessage}`);
        }
      } catch (globalError) {
        // Catch any other errors that might escape
        logError('File click handler', globalError);
        dispatch(setLoadingFile(false));

        // Show error notification
        const errorMessage = getErrorMessage(globalError);
        console.error('Global file click error:', errorMessage);
        alert(`Unexpected error: ${errorMessage}`);
      }
    },
    [dispatch],
  );

  // Context menu handlers
  const handleContextMenu = useCallback(
    (event: React.MouseEvent, item: TFolderTree) => {
      event.preventDefault();
      setContextMenu({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        item,
      });
    },
    [],
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleOpenFile = useCallback(() => {
    if (contextMenu?.item && !contextMenu.item.isDirectory) {
      handleFileClick(contextMenu.item);
    }
    setContextMenu(null);
  }, [contextMenu, handleFileClick]);

  const handleDeleteItem = useCallback(
    async (item: TFolderTree) => {
      try {
        if (item.isDirectory) {
          await window.electron.deleteFolder(item.path);
          console.log('Folder deleted successfully:', item.path);
        } else {
          await window.electron.deleteFile(item.path);
          console.log('File deleted successfully:', item.path);
        }

        // Remove from Redux state
        dispatch(removeTreeItem(item.path));
      } catch (error) {
        console.error('Error deleting item:', error);
        const errorMessage = getErrorMessage(error);
        alert(
          `Error deleting ${
            item.isDirectory ? 'folder' : 'file'
          }: ${errorMessage}`,
        );
      }
    },
    [dispatch],
  );

  const handleDeleteClick = useCallback(() => {
    if (contextMenu?.item) {
      if (contextMenu.item.isDirectory) {
        // Show confirmation dialog for folders
        setConfirmDialog({
          isOpen: true,
          item: contextMenu.item,
          type: 'delete',
        });
      } else {
        // Delete file directly
        handleDeleteItem(contextMenu.item);
      }
    }
    setContextMenu(null);
  }, [contextMenu, handleDeleteItem]);

  const handleDeleteConfirm = useCallback(() => {
    if (confirmDialog.item) {
      handleDeleteItem(confirmDialog.item);
    }
    setConfirmDialog({ isOpen: false, item: null, type: null });
  }, [confirmDialog, handleDeleteItem]);

  const handleDeleteCancel = useCallback(() => {
    setConfirmDialog({ isOpen: false, item: null, type: null });
  }, []);

  const handleRenameClick = useCallback(() => {
    if (contextMenu?.item) {
      setRenameDialog({
        isOpen: true,
        item: contextMenu.item,
        newName: contextMenu.item.name,
      });
    }
    setContextMenu(null);
  }, [contextMenu]);

  const handleRenameConfirm = useCallback(async () => {
    if (renameDialog.item && renameDialog.newName.trim()) {
      const item = renameDialog.item;
      const newName = renameDialog.newName.trim();

      // Don't rename if name hasn't changed
      if (newName === item.name) {
        setRenameDialog({ isOpen: false, item: null, newName: '' });
        return;
      }

      try {
        // Construct new path
        const parentPath = item.parentPath;
        const newPath =
          parentPath.endsWith('/') || parentPath.endsWith('\\')
            ? parentPath + newName
            : parentPath + '/' + newName;

        // Call appropriate rename function
        if (item.isDirectory) {
          await window.electron.renameFolder(item.path, newPath);
        } else {
          await window.electron.renameFile(item.path, newPath);
        }

        // Update Redux state
        dispatch(
          renameTreeItem({
            oldPath: item.path,
            newPath: newPath,
            newName: newName,
          }),
        );

        console.log(
          `${item.isDirectory ? 'Folder' : 'File'} renamed successfully:`,
          item.path,
          '->',
          newPath,
        );
      } catch (error) {
        console.error('Error renaming item:', error);
        const errorMessage = getErrorMessage(error);
        alert(
          `Error renaming ${
            item.isDirectory ? 'folder' : 'file'
          }: ${errorMessage}`,
        );
      }
    }

    setRenameDialog({ isOpen: false, item: null, newName: '' });
  }, [renameDialog, dispatch]);

  const handleRenameCancel = useCallback(() => {
    setRenameDialog({ isOpen: false, item: null, newName: '' });
  }, []);

  // Close context menu on click elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Listen for file item context menu events
  useEffect(() => {
    const handleFileItemContextMenu = (event: CustomEvent) => {
      const { event: mouseEvent, item } = event.detail;
      handleContextMenu(mouseEvent, item);
    };

    document.addEventListener(
      'fileItemContextMenu',
      handleFileItemContextMenu as EventListener,
    );
    return () =>
      document.removeEventListener(
        'fileItemContextMenu',
        handleFileItemContextMenu as EventListener,
      );
  }, [handleContextMenu]);

  if (!treeItems || treeItems.length === 0) {
    return <EmptyState>No files found in the selected directory.</EmptyState>;
  }

  return (
    <TreeContainer>
      {treeItems.map(item => (
        <FileItem
          key={item.path}
          item={item}
          level={level}
          isExpanded={expandedItems.has(item.path)}
          onToggle={() => toggleExpanded(item.path)}
          onFileClick={handleFileClick}
          onUpdateItem={handleUpdateItem}
        />
      ))}

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }>
        {contextMenu?.item && !contextMenu.item.isDirectory && (
          <MenuItem onClick={handleOpenFile}>Open File</MenuItem>
        )}
        <MenuItem onClick={handleRenameClick}>Rename</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogContent>
          <Typography>
            This is a folder and may contain files / subdirectories. This action
            will delete the folder and all its content. Are you sure you want to
            continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>No</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={renameDialog.isOpen}
        onClose={handleRenameCancel}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>
          Rename {renameDialog.item?.isDirectory ? 'Folder' : 'File'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New name"
            fullWidth
            variant="outlined"
            value={renameDialog.newName}
            onChange={e =>
              setRenameDialog(prev => ({ ...prev, newName: e.target.value }))
            }
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleRenameConfirm();
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                handleRenameCancel();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameCancel}>Cancel</Button>
          <Button
            onClick={handleRenameConfirm}
            variant="contained"
            disabled={!renameDialog.newName.trim()}>
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </TreeContainer>
  );
};
