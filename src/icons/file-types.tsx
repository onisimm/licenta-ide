import React from 'react';
import { IconProps } from '../types/icon';

const iconSize = 16;

// Folder icons
export const FolderIcon = ({ color = '#4169E1' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
  </svg>
);

export const FolderOpenIcon = ({ color = '#4169E1' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <path d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l1.14-4h17.07l-1.21 4.86z" />
  </svg>
);

// File icons by extension
export const TypeScriptIcon = ({ color = '#3178C6' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <rect width="24" height="24" rx="3" fill={color} />
    <path d="M18.5 7.5v1.5h-2.25v6h-1.5v-6H12.5V7.5h6z" fill="white" />
    <path
      d="M9 12.75c0-.69-.56-1.25-1.25-1.25S6.5 12.06 6.5 12.75v.5c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25v-.5z"
      fill="white"
    />
  </svg>
);

export const JavaScriptIcon = ({ color = '#F7DF1E' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <rect width="24" height="24" rx="3" fill={color} />
    <path
      d="M18.5 16.5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5v-9h1.5v9c0 .55.45 1 1 1s1-.45 1-1v-9h1.5v9z"
      fill="black"
    />
    <path
      d="M12 12.75c0-.69-.56-1.25-1.25-1.25S9.5 12.06 9.5 12.75v.5c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25v-.5z"
      fill="black"
    />
  </svg>
);

export const JSONIcon = ({ color = '#FFD700' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <rect width="24" height="24" rx="3" fill={color} />
    <path
      d="M7 8v2h2v4H7v2h3v-2h2v-4H10V8H7zm7 0v8h3v-2h-1v-4h1V8h-3z"
      fill="black"
    />
  </svg>
);

export const CSSIcon = ({ color = '#1572B6' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <rect width="24" height="24" rx="3" fill={color} />
    <path
      d="M6 8l1.5 8L12 17.5 16.5 16L18 8H6zm8.5 3H10l.1 1h4.3l-.3 2.5L12 15l-2.1-.5L9.8 13H11l.1.8.9.2.9-.2.1-1.8H9.5l-.3-3h5.6l-.3 1z"
      fill="white"
    />
  </svg>
);

export const HTMLIcon = ({ color = '#E34F26' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <rect width="24" height="24" rx="3" fill={color} />
    <path
      d="M6 8l1.5 8L12 17.5 16.5 16L18 8H6zm2.5 3h3v1h-2v1h2v1h-3v-3zm4.5 0h2.5v1H13v1h2v1h-2.5v-3z"
      fill="white"
    />
  </svg>
);

export const MarkdownIcon = ({ color = '#083FA1' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <rect width="24" height="24" rx="3" fill={color} />
    <path
      d="M7 9v6h1.5v-3L10 14l1.5-2v3H13V9h-1.5L10 11L8.5 9H7zm5.5 0v6H14v-2.5l2 2V9h-1.5v2.5L13 9h-0.5z"
      fill="white"
    />
  </svg>
);

export const DefaultFileIcon = ({ color = '#6E6E6E' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
  </svg>
);

// File icon resolver
export const getFileIcon = (
  fileName: string,
  isDirectory: boolean,
  isOpen = false,
) => {
  if (isDirectory) {
    return isOpen ? <FolderOpenIcon /> : <FolderIcon />;
  }

  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'ts':
    case 'tsx':
      return <TypeScriptIcon />;
    case 'js':
    case 'jsx':
      return <JavaScriptIcon />;
    case 'json':
      return <JSONIcon />;
    case 'css':
    case 'scss':
    case 'sass':
      return <CSSIcon />;
    case 'html':
    case 'htm':
      return <HTMLIcon />;
    case 'md':
    case 'markdown':
      return <MarkdownIcon />;
    default:
      return <DefaultFileIcon />;
  }
};
