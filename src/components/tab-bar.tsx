import React, { memo, useCallback } from 'react';
import { Box, styled, IconButton, Typography, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '../shared/hooks';
import { switchToTab, closeTab } from '../shared/rdx-slice';
import { getFileIcon } from '../icons/file-types';

const TabBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: 35,
  overflowX: 'auto',
  overflowY: 'hidden',
  // Custom scrollbar for tab bar
  '&::-webkit-scrollbar': {
    height: 6,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.action.disabled,
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Tab = styled(Box, {
  shouldForwardProp: prop =>
    prop !== 'isActive' && prop !== 'hasUnsavedChanges',
})<{ isActive: boolean; hasUnsavedChanges: boolean }>(
  ({ theme, isActive, hasUnsavedChanges }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 1),
    minHeight: 35,
    minWidth: 120,
    maxWidth: 200,
    cursor: 'pointer',
    backgroundColor: isActive
      ? theme.palette.background.default
      : 'transparent',
    borderRight: `1px solid ${theme.palette.divider}`,
    borderTop: isActive
      ? `2px solid ${theme.palette.primary.main}`
      : '2px solid transparent',
    transition: 'all 0.2s ease',
    position: 'relative',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },

    // Unsaved changes indicator
    ...(hasUnsavedChanges && {
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 6,
        right: 6,
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: theme.palette.warning.main,
      },
    }),
  }),
);

const TabIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '16px',
  flexShrink: 0,
}));

const TabTitle = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 400,
  color: theme.palette.text.primary,
  fontFamily: 'monospace',
  flexGrow: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  padding: 2,
  width: 20,
  height: 20,
  borderRadius: 2,
  flexShrink: 0,
  opacity: 0.7,
  transition: 'opacity 0.2s ease',

  '&:hover': {
    opacity: 1,
    backgroundColor: theme.palette.action.hover,
  },

  '& .MuiSvgIcon-root': {
    fontSize: '14px',
  },
}));

export const TabBar: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const { openFiles, activeFileIndex } = useAppSelector(state => ({
    openFiles: state.main.openFiles,
    activeFileIndex: state.main.activeFileIndex,
  }));

  const handleTabClick = useCallback(
    (index: number) => {
      if (index !== activeFileIndex) {
        dispatch(switchToTab(index));
      }
    },
    [dispatch, activeFileIndex],
  );

  const handleCloseTab = useCallback(
    (event: React.MouseEvent, index: number) => {
      event.stopPropagation(); // Prevent tab switch when clicking close button
      dispatch(closeTab(index));
    },
    [dispatch],
  );

  // Don't render if no files are open
  if (openFiles.length === 0) {
    return null;
  }

  return (
    <TabBarContainer>
      {openFiles.map((file, index) => (
        <Tab
          key={file.path}
          isActive={index === activeFileIndex}
          hasUnsavedChanges={file.hasUnsavedChanges || false}
          onClick={() => handleTabClick(index)}>
          <TabIcon>{getFileIcon(file.name, false, false)}</TabIcon>

          <Tooltip title={file.path} placement="bottom">
            <TabTitle>{file.name}</TabTitle>
          </Tooltip>

          <CloseButton onClick={e => handleCloseTab(e, index)} size="small">
            <CloseIcon sx={{ color: '#fafafa' }} />
          </CloseButton>
        </Tab>
      ))}
    </TabBarContainer>
  );
});

TabBar.displayName = 'TabBar';
