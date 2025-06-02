import { ERenderer } from './preload';

declare global {
  interface Window {
    electron: ERenderer;
  }

  declare module '*.svg' {
    import React from 'react';
    import { SVGProps } from 'react';
    export const ReactComponent: React.FunctionComponent<
      SVGProps<SVGSVGElement>
    >;
  }
}
