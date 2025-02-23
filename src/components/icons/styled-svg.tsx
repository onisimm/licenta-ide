import { styled } from '@mui/material';

export const StyledSVG = styled('svg')(({ theme, color }) => ({
  fill: color || theme.palette.sidebar.icon,
  transition: 'all 0.05s ease-in-out',

  '&:hover': {
    fill: theme.palette.sidebar.iconActive, // Change color on hover
  },
}));
