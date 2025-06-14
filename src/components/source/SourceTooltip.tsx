import React from 'react';
import { Tooltip } from '@mui/material';

export const SourceTooltip: React.FC<
  React.ComponentProps<typeof Tooltip>
> = props => {
  return <Tooltip arrow disableInteractive {...props} />;
};
