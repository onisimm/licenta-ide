import { Box, styled } from '@mui/material';
import { memo } from 'react';

const ExplorerContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  flex: 1,
  color: theme.palette.text.primary,
  padding: theme.spacing(2),
  borderLeft: `1px solid ${theme.palette.border.main}`,
}));

export const ExplorerSection = memo(() => {
  return <ExplorerContainer>Explorer Section</ExplorerContainer>;
});
