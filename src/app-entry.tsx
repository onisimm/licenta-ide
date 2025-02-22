import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './shared/store';
import App from './app';

// Create a root instance
const root = createRoot(document.getElementById('root'));

console.log('inside app entry');

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
