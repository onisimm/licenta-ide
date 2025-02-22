import { createTheme } from '@mui/material/styles';
import palette from './palette';

const theme = createTheme({
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
  palette: palette,
});

export default theme;
