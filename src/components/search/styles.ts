import { Box, Button, Typography, styled, alpha } from '@mui/material';

export const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

export const SearchHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const SearchInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const ResultsContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  fontSize: '13px',
  fontFamily: '"Segoe UI", "Monaco", "Cascadia Code", monospace',
  color: theme.palette.text.primary,
  userSelect: 'none',
}));

export const ResultsSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.shape.borderRadius,
}));

export const FileItemContainer = styled(Box)<{ isHovered?: boolean }>(
  ({ theme, isHovered }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(0),
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

export const ExpandIcon = styled(Box)<{ isExpanded?: boolean }>(
  ({ theme, isExpanded }) => ({
    width: 12,
    height: 12,
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
      color: theme.palette.text.secondary,
    },
  }),
);

export const LineItemContainer = styled(Box)<{ isHovered?: boolean }>(
  ({ theme, isHovered }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1.5),
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

export const FileIcon = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(0.75),
  flexShrink: 0,
}));

export const FileName = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 400,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  color: 'inherit',
}));

export const LineNumber = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  fontWeight: 500,
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  padding: theme.spacing(0.25, 0.5),
  borderRadius: 3,
  minWidth: '30px',
  textAlign: 'center',
  marginRight: theme.spacing(1),
  flexShrink: 0,
}));

export const LineContent = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  color: theme.palette.text.secondary,
  whiteSpace: 'pre',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 1,
}));

export const MatchCount = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(0.5),
  fontWeight: 400,
}));

export const NoFolderMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50%',
  gap: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

export const NoResultsText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '14px',
  fontStyle: 'italic',
}));

export const FileResultItem = styled(Box, {
  shouldForwardProp: prop => prop !== 'isHovered',
})<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  padding: theme.spacing(0.5, 1),
  cursor: 'pointer',
  borderRadius: theme.spacing(0.5),
  backgroundColor: isHovered ? theme.palette.action.hover : 'transparent',
  '&:active': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.15s ease',
}));

export const LineResultItem = styled(Box, {
  shouldForwardProp: prop => prop !== 'isHovered',
})<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  padding: theme.spacing(0.25, 1, 0.25, 2),
  cursor: 'pointer',
  fontSize: '12px',
  backgroundColor: isHovered ? theme.palette.action.hover : 'transparent',
  '&:active': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.15s ease',
}));

export const HighlightedText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.spacing(0.25),
  padding: '1px 2px',
  fontWeight: 500,
}));

export const PreviewText = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '12px',
}));

export const LoadMoreContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(1),
}));

export const LoadMoreButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '13px',
  fontWeight: 500,
  borderRadius: theme.spacing(0.75),
  padding: theme.spacing(1, 3),
  borderColor: theme.palette.text.secondary,
  color: theme.palette.text.secondary,

  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    color: theme.palette.primary.main,
  },

  '&:disabled': {
    borderColor: theme.palette.action.disabled,
    color: theme.palette.action.disabled,
  },
}));
