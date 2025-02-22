import { Components } from '@mui/material';

const components: Components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        padding: 0, // remove default padding
        margin: 0, // often browsers add margin too
      },
    },
  },
};

export default components;
