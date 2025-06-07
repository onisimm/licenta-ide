import { Box, styled, Typography, IconButton, Tooltip } from '@mui/material';
import { memo, useEffect, useCallback, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../shared/hooks';
import { setFolderStructure, updateTreeItem } from '../shared/rdx-slice';
import { FileTree } from '../components/file-tree';
import { IFolderStructure, TFolderTree } from '../shared/types';
import { getFileIcon } from '../icons/file-types';
import {
  initializeGitIgnore,
  getGitIgnoreChecker,
} from '../shared/gitignore-utils';

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
}));

const CenterButton = styled('button')(({ theme }) => ({
  outline: 'none',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.text.primary,
  fontSize: '13px',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  border: `.3px solid ${theme.palette.primary.main}`,
  cursor: 'pointer',
  boxShadow: theme.shadows[1],
  marginTop: theme.spacing(1),

  transition: 'background-color .2s',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
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
  const [isRootExpanded, setIsRootExpanded] = useState(true);
  const [isRootHovered, setIsRootHovered] = useState(false);

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

        setIsRootExpanded(true); // Auto-expand when new folder is selected
      }
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  }, [dispatch]);

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
    // TODO: Implement new file functionality
  }, []);

  const handleNewFolder = useCallback(() => {
    console.log('New folder clicked');
    // TODO: Implement new folder functionality
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('Refresh clicked');
    // TODO: Implement refresh functionality
  }, []);

  const handleCollapseAll = useCallback(() => {
    console.log('Collapse all clicked');
    // TODO: Implement collapse all functionality
  }, []);

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
                setIsRootExpanded(!isRootExpanded);
              }}
            />
            <RootFolderIcon>
              {getFileIcon(folderStructure.name, true, isRootExpanded)}
            </RootFolderIcon>
            <RootFolderName
              title={folderStructure.name}
              onClick={() => setIsRootExpanded(!isRootExpanded)}>
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
          <CenterButton onClick={openFolder}>Open Folder</CenterButton>
        </EmptyState>
      )}
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
