import { createTheme } from '@mui/material/styles';
import palette from './palette';
import components from './components';

const theme = createTheme({
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
  palette: palette,
  components: components,
});

export default theme;
