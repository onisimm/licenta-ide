import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Typography,
  Chip,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';

export const SourceContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '13px',
  fontFamily: '"Segoe UI", "Monaco", "Cascadia Code", monospace',
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
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

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const FileListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  marginBottom: theme.spacing(1),
}));

export const FileItem = styled(Box)(({ theme }) => ({
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

export const FileName = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const StatusChip = styled(Chip)(({ theme }) => ({
  fontSize: '10px',
  height: 18,
  '& .MuiChip-label': {
    padding: theme.spacing(0, 0.5),
  },
}));

export const CommitSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const CommitInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiInputBase-root': {
    fontSize: '12px',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
  },
}));

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const BranchInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.spacing(0.5),
  fontSize: '12px',
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60%',
  gap: theme.spacing(2),
  color: theme.palette.text.secondary,
  textAlign: 'center',
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

export const SuccessIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, 0.1),
  },
}));

export const WarningIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.warning.main,
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
  },
}));
