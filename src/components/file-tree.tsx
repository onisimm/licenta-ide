import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, styled, Typography, CircularProgress } from '@mui/material';
import { TFolderTree } from '../shared/types';
import { getFileIcon } from '../icons/file-types';
import { useAppDispatch } from '../shared/hooks';
import { setLoadingFile, setSelectedFile } from '../shared/rdx-slice';
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

const FileItemContainer = styled(Box)<{ level: number; isHovered?: boolean }>(
  ({ theme, level, isHovered }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(level * 1.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    cursor: 'pointer',
    backgroundColor: isHovered ? theme.palette.action.hover : 'transparent',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
);

const ExpandIcon = styled(Box)<{
  isExpanded: boolean;
  isDirectory: boolean;
  hasPreloadedChildren?: boolean;
}>(({ isExpanded, isDirectory, hasPreloadedChildren }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 4,
  opacity: isDirectory ? 1 : 0,
  cursor: isDirectory ? 'pointer' : 'default',
  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
  transition: 'transform 0.15s ease-in-out',

  '&::before': {
    content: isDirectory ? '"▶"' : '""',
    fontSize: '10px',
    color: '#8e8e8e',
  },
}));

const FileIcon = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(0.75),
  flexShrink: 0,
}));

const FileName = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 400,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  color: theme.palette.text.secondary,
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
      if (item.isDirectory) {
        handleToggle();
      } else {
        onFileClick(item);
      }
    },
    [item, handleToggle, onFileClick],
  );

  // Determine if this directory has children or could have children
  const hasChildren = item.children && item.children.length > 0;
  const couldHaveChildren =
    item.isDirectory && (!item.childrenLoaded || hasChildren);

  return (
    <>
      <FileItemContainer
        level={level}
        isHovered={isHovered}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <ExpandIcon
          isExpanded={isExpanded}
          isDirectory={couldHaveChildren}
          hasPreloadedChildren={item.childrenLoaded && hasChildren}
          onClick={e => {
            e.stopPropagation();
            if (item.isDirectory) {
              handleToggle();
            }
          }}
        />
        <FileIcon>
          {getFileIcon(item.name, item.isDirectory, isExpanded)}
        </FileIcon>
        <FileName>{item.name}</FileName>
        {item.isLoading && <LoadingSpinner size={12} thickness={4} />}
      </FileItemContainer>

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

          // Update selected file in Redux
          dispatch(setSelectedFile(fileData));
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

  if (!treeItems || treeItems.length === 0) {
    return null;
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
    </TreeContainer>
  );
};
