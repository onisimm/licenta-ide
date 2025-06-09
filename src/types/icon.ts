import { SVGProps } from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  props?: SVGProps<SVGSVGElement>;
}

export enum IconListName {
  files = 'files',
  search = 'search',
  source = 'source',
  aichat = 'aichat',
  profile = 'profile',
  settings = 'settings',
}

export interface IconType {
  name: IconListName;
  icon: JSX.Element;
  description?: string;
}
