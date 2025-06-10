import React, { memo, useCallback } from 'react';
import {
  Box,
  styled,
  IconButton,
  Typography,
  Tooltip,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '../shared/hooks';
import { switchToTab, closeTab } from '../shared/rdx-slice';
import { getFileIcon } from '../icons/file-types';

const TabBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: 35,
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

const TabsScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  overflowX: 'auto',
  backgroundColor: theme.palette.background.default,
  '&::-webkit-scrollbar': {
    height: 3,
    backgroundColor: theme.palette.action.disabled,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: 2,
  },
}));

const Tab = styled(Box, {
  shouldForwardProp: prop => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  minWidth: 120,
  maxWidth: 200,
  height: '100%',
  cursor: 'pointer',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: isActive
    ? theme.palette.background.paper
    : theme.palette.background.default,
  position: 'relative',
  transition: 'background-color 0.2s',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

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

const UnsavedIndicator = styled(Box)(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: theme.palette.warning.main,
  marginLeft: theme.spacing(0.5),
  flexShrink: 0,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  padding: 2,
  marginLeft: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const TabBar = memo(() => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
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
      <TabsScrollContainer>
        {openFiles.map((file, index) => (
          <Tab
            key={file.path}
            isActive={index === activeFileIndex}
            onClick={() => handleTabClick(index)}>
            <TabIcon>{getFileIcon(file.name, false, false)}</TabIcon>

            <Tooltip title={file.path} placement="bottom">
              <TabTitle>{file.name}</TabTitle>
            </Tooltip>

            {/* Show unsaved indicator */}
            {file.hasUnsavedChanges && <UnsavedIndicator />}

            <CloseButton
              size="small"
              onClick={e => handleCloseTab(e, index)}
              title="Close tab">
              <CloseIcon
                sx={{ color: theme.palette.text.primary, fontSize: 14 }}
              />
            </CloseButton>
          </Tab>
        ))}
      </TabsScrollContainer>
    </TabBarContainer>
  );
});

TabBar.displayName = 'TabBar';
