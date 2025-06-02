import React, { useState, useCallback } from 'react';
import { Box, styled, Typography } from '@mui/material';
import { TFolderTree } from '../shared/types';
import { getFileIcon } from '../icons/file-types';

interface FileTreeProps {
  items: TFolderTree[];
  level?: number;
}

interface FileItemProps {
  item: TFolderTree;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  onFileClick: (item: TFolderTree) => void;
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

const ExpandIcon = styled(Box)<{ isExpanded: boolean; isDirectory: boolean }>(
  ({ isExpanded, isDirectory }) => ({
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
  }),
);

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

const FileItem: React.FC<FileItemProps> = ({
  item,
  level,
  isExpanded,
  onToggle,
  onFileClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (item.isDirectory) {
        onToggle();
      } else {
        onFileClick(item);
      }
    },
    [item, onToggle, onFileClick],
  );

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
          isDirectory={item.isDirectory}
          onClick={e => {
            e.stopPropagation();
            if (item.isDirectory) {
              onToggle();
            }
          }}
        />
        <FileIcon>
          {getFileIcon(item.name, item.isDirectory, isExpanded)}
        </FileIcon>
        <FileName>{item.name}</FileName>
      </FileItemContainer>

      {item.isDirectory && isExpanded && item.children && (
        <FileTree items={item.children} level={level + 1} />
      )}
    </>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({ items, level = 0 }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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

  const handleFileClick = useCallback((item: TFolderTree) => {
    console.log('File clicked:', item.path);
    // TODO: Open file in editor
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <TreeContainer>
      {items.map(item => (
        <FileItem
          key={item.path}
          item={item}
          level={level}
          isExpanded={expandedItems.has(item.path)}
          onToggle={() => toggleExpanded(item.path)}
          onFileClick={handleFileClick}
        />
      ))}
    </TreeContainer>
  );
};
