import { styled } from '@mui/material';

export const DefaultButton = styled('button')(({ theme }) => ({
  outline: 'none',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  fontSize: '100%',
  padding: theme.spacing(0.75, 1.5),
  borderRadius: theme.shape.borderRadius,
  border: `.3px solid ${theme.palette.primary.main}`,
  
  cursor: 'pointer',
  boxShadow: theme.shadows[1],

  transition: 'background-color .2s',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));
