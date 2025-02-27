import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './shared/store';
import App from './app';
import { CssBaseline, ThemeProvider } from '@mui/material/';
import { CustomThemeProvider } from './theme/themeProvider';

// Create a root instance
const root = createRoot(document.getElementById('root'));

root.render(
  <CustomThemeProvider>
    <CssBaseline /> {/* apply CSS override from theme.ts */}
    <Provider store={store}>
      <App />
    </Provider>
  </CustomThemeProvider>,
);
