import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';

export const ExplorerContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  overflow: 'hidden',
}));

export const OpenFolderButton = styled('button')(({ theme }) => ({
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

export const RootFolderContainer = styled(Box)<{ isHovered?: boolean }>(
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

export const RootExpandIcon = styled(Box)<{ isExpanded: boolean }>(
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

export const RootFolderIcon = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(0.75),
  flexShrink: 0,
}));

export const RootFolderName = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
}));

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  opacity: 0,
  transition: 'opacity 0.2s ease',

  '.root-folder-container:hover &': {
    opacity: 1,
  },
}));

export const ActionButton = styled(IconButton)(({ theme }) => ({
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

export const ExplorerContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(0.5, 0),
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '13px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
