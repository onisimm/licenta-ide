import React, { SVGProps } from 'react';
import { getFileExtension, hasFileIcon } from '../constants/languages';
import { IconProps } from '../types/icon';
import { useTheme } from '@mui/material';

const iconSize = 16;

// Folder icons
export const FolderIcon = ({ color }: { color?: string }) => {
  const theme = useTheme();
  const folderColor = color || theme.palette.fileTypes.folder;

  return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
      <path
        d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"
        fill={folderColor}
      />
    </svg>
  );
};

export const FolderOpenIcon = ({ color }: { color?: string }) => {
  const theme = useTheme();
  const folderColor = color || theme.palette.fileTypes.folderOpen;

  return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM4 6h5.17l2 2H20v10H4V6z"
        fill={folderColor}
      />
    </svg>
  );
};

// File icons by extension
export function TypeScriptIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}>
      <path
        fill="#007acc"
        d="M23.827 8.243a4.4 4.4 0 0 1 2.223 1.281a6 6 0 0 1 .852 1.143c.011.045-1.534 1.083-2.471 1.662c-.034.023-.169-.124-.322-.35a2.01 2.01 0 0 0-1.67-1c-1.077-.074-1.771.49-1.766 1.433a1.3 1.3 0 0 0 .153.666c.237.49.677.784 2.059 1.383c2.544 1.095 3.636 1.817 4.31 2.843a5.16 5.16 0 0 1 .416 4.333a4.76 4.76 0 0 1-3.932 2.815a11 11 0 0 1-2.708-.028a6.53 6.53 0 0 1-3.616-1.884a6.3 6.3 0 0 1-.926-1.371a3 3 0 0 1 .327-.208c.158-.09.756-.434 1.32-.761l1.024-.6l.214.312a4.8 4.8 0 0 0 1.35 1.292a3.3 3.3 0 0 0 3.458-.175a1.545 1.545 0 0 0 .2-1.974c-.276-.395-.84-.727-2.443-1.422a8.8 8.8 0 0 1-3.349-2.055a4.7 4.7 0 0 1-.976-1.777a7.1 7.1 0 0 1-.062-2.268a4.33 4.33 0 0 1 3.644-3.374a9 9 0 0 1 2.691.084m-8.343 1.483l.011 1.454h-4.63v13.148H7.6V11.183H2.97V9.755a14 14 0 0 1 .04-1.466c.017-.023 2.832-.034 6.245-.028l6.211.017Z"></path>
    </svg>
  );
}

export function ReactIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      {...props}>
      <g
        fill="none"
        stroke="#8aadf4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}>
        <path d="M8 11.3c4.14 0 7.5-1.28 7.5-2.86S12.14 5.58 8 5.58S.5 6.86.5 8.44s3.36 2.87 7.5 2.87Z"></path>
        <path d="M5.52 9.87c2.07 3.6 4.86 5.86 6.23 5.07c1.37-.8.8-4.34-1.27-7.93S5.62 1.16 4.25 1.95s-.8 4.34 1.27 7.92"></path>
        <path d="M5.52 7.01c-2.07 3.59-2.64 7.14-1.27 7.93s4.16-1.48 6.23-5.07c2.07-3.58 2.64-7.13 1.27-7.92c-1.37-.8-4.16 1.47-6.23 5.06"></path>
        <path d="M8.5 8.44a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5a.5.5 0 0 1 .5.5"></path>
      </g>
    </svg>
  );
}

export function JavaScriptIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}>
      <g fill="none">
        <g clipPath="url(#akarIconsJavascriptFill0)">
          <path
            fill="#fbe700"
            fillRule="evenodd"
            d="M0 0h24v24H0zm18.347 20.12c-1.113 0-1.742-.58-2.225-1.37l-1.833 1.065c.662 1.308 2.015 2.306 4.11 2.306c2.142 0 3.737-1.112 3.737-3.143c0-1.883-1.082-2.72-2.998-3.543l-.564-.241c-.968-.42-1.387-.693-1.387-1.37c0-.547.42-.966 1.08-.966c.647 0 1.064.273 1.451.966l1.756-1.127c-.743-1.307-1.773-1.806-3.207-1.806c-2.014 0-3.303 1.288-3.303 2.98c0 1.835 1.08 2.704 2.708 3.397l.564.242c1.029.45 1.642.724 1.642 1.497c0 .646-.597 1.113-1.531 1.113m-8.74-.015c-.775 0-1.098-.53-1.452-1.16l-1.836 1.112c.532 1.126 1.578 2.06 3.383 2.06c1.999 0 3.368-1.063 3.368-3.398v-7.7h-2.255v7.67c0 1.127-.468 1.416-1.209 1.416"
            clipRule="evenodd"></path>
        </g>
        <defs>
          <clipPath id="akarIconsJavascriptFill0">
            <path fill="#fff" d="M0 0h24v24H0z"></path>
          </clipPath>
        </defs>
      </g>
    </svg>
  );
}

export function JSONIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      {...props}>
      <path
        fill="none"
        stroke="#eed49f"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 2.5H4c-.75 0-1.5.75-1.5 1.5v2c0 1.1-1 2-1.83 2c.83 0 1.83.9 1.83 2v2c0 .75.75 1.5 1.5 1.5h.5m7-11h.5c.75 0 1.5.75 1.5 1.5v2c0 1.1 1 2 1.83 2c-.83 0-1.83.9-1.83 2v2c0 .74-.75 1.5-1.5 1.5h-.5m-6.5-3a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m3 0a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m3 0a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1"
        strokeWidth={1}></path>
    </svg>
  );
}

export const CSSIcon = ({ color = '#1572B6' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <rect width="24" height="24" rx="3" fill={color} />
    <path
      d="M6 8l1.5 8L12 17.5 16.5 16L18 8H6zm8.5 3H10l.1 1h4.3l-.3 2.5L12 15l-2.1-.5L9.8 13H11l.1.8.9.2.9-.2.1-1.8H9.5l-.3-3h5.6l-.3 1z"
      fill="white"
    />
  </svg>
);

export function HTMLIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={256}
      height={256}
      viewBox="0 0 256 256"
      {...props}>
      <g fill="none">
        <rect width={256} height={256} fill="#e14e1d" rx={60}></rect>
        <path
          fill="#fff"
          d="m48 38l8.61 96.593h110.71l-3.715 41.43l-35.646 9.638l-35.579-9.624l-2.379-26.602H57.94l4.585 51.281l65.427 18.172l65.51-18.172l8.783-98.061H85.824l-2.923-32.71h122.238L208 38z"></path>
        <path
          fill="#ebebeb"
          d="M128 38H48l8.61 96.593H128v-31.938H85.824l-2.923-32.71H128zm0 147.647l-.041.014l-35.579-9.624l-2.379-26.602H57.94l4.585 51.281l65.427 18.172l.049-.014z"></path>
      </g>
    </svg>
  );
}

export function MarkdownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}>
      <path
        fill="#42a5f5"
        d="m14 10l-4 3.5L6 10H4v12h4v-6l2 2l2-2v6h4V10zm12 6v-6h-4v6h-4l6 8l6-8z"></path>
    </svg>
  );
}

export function LessIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={256}
      height={110}
      viewBox="0 0 256 110"
      {...props}>
      <defs>
        <path
          id="logosLess0"
          d="M224.236 88.738c0 11.564-9.688 21.025-21.529 21.025H21.75c-11.841 0-21.529-9.461-21.529-21.025V21.781C.221 10.218 9.909.756 21.75.756h180.957c11.841 0 21.529 9.462 21.529 21.025z"></path>
        <path id="logosLess1" d="M-15.94.496H240V110H-15.94"></path>
        <linearGradient id="logosLess2" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#2e4f82"></stop>
          <stop offset="100%" stopColor="#182e4d"></stop>
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd" transform="translate(16)">
        <use fill="url(#logosLess2)" href="#logosLess0"></use>
        <mask id="logosLess3" fill="#fff">
          <use href="#logosLess1"></use>
        </mask>
        <use href="#logosLess1"></use>
        <path
          fill="#faf9f8"
          d="M229.071 40.43c0-8.197 1.261-13.031 1.261-21.858c0-13.662-5.045-18.076-16.184-18.076h-8.197v9.668h2.522c5.675 0 6.936 1.892 6.936 8.828c0 6.515-.631 13.031-.631 20.598c0 9.668 3.153 13.451 9.458 14.922v.631c-6.305 1.471-9.458 5.255-9.458 14.923c0 7.566.631 13.662.631 20.598c0 7.146-1.471 9.037-6.936 9.037v.21h-2.522V110h8.197c11.139 0 16.184-4.414 16.184-18.075c0-9.038-1.261-13.662-1.261-21.859c0-4.414 2.732-9.038 10.929-9.458v-10.93c-8.197-.21-10.929-4.834-10.929-9.248m-93.11 12.821c-6.516-2.522-12.401-3.993-12.401-8.197c0-3.152 2.522-5.044 7.146-5.044s8.828 1.892 13.452 5.255l8.407-11.14c-5.255-3.993-12.401-8.197-22.069-8.197c-14.292 0-23.961 8.197-23.961 19.757c0 10.299 9.038 15.553 16.605 18.496c6.515 2.522 12.821 4.624 12.821 8.827c0 3.153-2.523 5.255-8.197 5.255c-5.255 0-10.509-2.102-16.184-6.516l-8.197 12.191c6.305 5.254 15.973 8.827 23.96 8.827c16.815 0 25.852-8.827 25.852-20.387s-9.037-16.394-17.234-19.127m50.863 0c-6.305-2.522-12.19-3.993-12.19-8.197c0-3.152 2.522-5.044 7.146-5.044s8.828 1.892 13.452 5.255l8.407-11.14c-5.255-3.993-12.401-8.197-22.069-8.197c-14.293 0-23.961 8.197-23.961 19.757c0 10.299 9.038 15.553 16.604 18.496c6.516 2.522 12.821 4.624 12.821 8.827c0 3.153-2.522 5.255-8.197 5.255c-5.254 0-10.509-2.102-16.183-6.516l-8.408 12.191c6.306 5.254 15.974 8.827 23.961 8.827c16.814 0 25.852-8.827 25.852-20.387s-9.038-16.394-17.235-19.127M61.977 52.2c1.261-8.407 6.305-12.4 12.19-12.4c7.567 0 10.51 5.254 10.51 12.4zm38.673 3.784c.21-17.025-9.038-30.266-26.693-30.266c-15.343 0-30.055 12.821-29.635 32.998c0 20.808 13.662 32.998 31.737 32.998c7.567 0 15.974-2.732 22.489-7.146l-6.305-11.139c-4.624 2.732-9.038 3.993-13.662 3.993c-8.407 0-14.923-3.993-16.604-13.662h38.043c.21-1.471.63-4.413.63-7.776"
          mask="url(#logosLess3)"></path>
        <path
          fill="#faf9f8"
          d="M43.271 77.002c-1.471 0-3.363-1.261-3.363-5.255V.496H10.062C-1.287.496-6.332 4.91-6.332 18.572c0 9.037 1.261 14.082 1.261 21.858c0 4.414-2.732 9.038-10.929 9.458v10.93c8.197.21 10.929 4.834 10.929 9.248c0 7.777-1.261 12.4-1.261 21.438c0 13.662 5.045 18.076 16.184 18.076h8.197v-9.669h-2.522c-5.254 0-6.936-2.101-6.936-9.037s.631-12.821.631-20.598c0-9.668-3.153-13.452-9.459-14.923v-.63c6.306-1.472 9.459-5.255 9.459-14.923c0-7.567-.631-13.662-.631-20.598s1.471-8.827 6.936-8.827h5.675v60.321c0 12.821 4.414 21.229 17.235 21.229c3.993 0 7.146-.631 9.458-1.472l-2.102-13.661c-1.261.21-1.891.21-2.522.21"
          mask="url(#logosLess3)"></path>
      </g>
    </svg>
  );
}

export function XMLIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}>
      <path
        fill="#fbe700"
        d="m12.89 3l1.96.4L11.11 21l-1.96-.4zm6.7 9L16 8.41V5.58L22.42 12L16 18.41v-2.83zM1.58 12L8 5.58v2.83L4.41 12L8 15.58v2.83z"></path>
    </svg>
  );
}

export function YMLIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      {...props}>
      <path
        fill="#fbe700"
        d="M4 4a2 2 0 0 1 2-2h4.586a1.5 1.5 0 0 1 1.06.44l3.915 3.914A1.5 1.5 0 0 1 16 7.414v5.073a1.5 1.5 0 0 0-1-1.402V8h-3.5A1.5 1.5 0 0 1 10 6.5V3H6a1 1 0 0 0-1 1v7.085a1.5 1.5 0 0 0-.748.582L4 12.045zm7.5 3h3.293L11 3.207V6.5a.5.5 0 0 0 .5.5m-8 11a.5.5 0 0 0 .5-.5v-1.85l1.916-2.874a.5.5 0 0 0-.832-.555L3.5 14.6l-1.584-2.377a.5.5 0 0 0-.832.555L3 15.65v1.85a.5.5 0 0 0 .5.5m4.447-5.724A.5.5 0 0 0 7 12.5v5a.5.5 0 1 0 1 0v-2.882l1.553 3.105a.5.5 0 0 0 .894 0L12 14.618V17.5a.5.5 0 1 0 1 0v-5a.5.5 0 0 0-.947-.224L10 16.382zM15 12.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 .5.5h3a.5.5 0 1 0 0-1H15z"></path>
    </svg>
  );
}

export function PythonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={21}
      height={21}
      viewBox="0 0 256 255"
      {...props}>
      <defs>
        <linearGradient
          id="logosPython0"
          x1="12.959%"
          x2="79.639%"
          y1="12.039%"
          y2="78.201%">
          <stop offset="0%" stopColor="#387eb8"></stop>
          <stop offset="100%" stopColor="#366994"></stop>
        </linearGradient>
        <linearGradient
          id="logosPython1"
          x1="19.128%"
          x2="90.742%"
          y1="20.579%"
          y2="88.429%">
          <stop offset="0%" stopColor="#ffe052"></stop>
          <stop offset="100%" stopColor="#ffc331"></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#logosPython0)"
        d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072M92.802 19.66a11.12 11.12 0 0 1 11.13 11.13a11.12 11.12 0 0 1-11.13 11.13a11.12 11.12 0 0 1-11.13-11.13a11.12 11.12 0 0 1 11.13-11.13"></path>
      <path
        fill="url(#logosPython1)"
        d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897m34.114-19.586a11.12 11.12 0 0 1-11.13-11.13a11.12 11.12 0 0 1 11.13-11.131a11.12 11.12 0 0 1 11.13 11.13a11.12 11.12 0 0 1-11.13 11.13"></path>
    </svg>
  );
}

export function JavaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={256}
      height={346}
      viewBox="0 0 256 346"
      {...props}>
      <path
        fill="#5382a1"
        d="M82.554 267.473s-13.198 7.675 9.393 10.272c27.369 3.122 41.356 2.675 71.517-3.034c0 0 7.93 4.972 19.003 9.279c-67.611 28.977-153.019-1.679-99.913-16.517m-8.262-37.814s-14.803 10.958 7.805 13.296c29.236 3.016 52.324 3.263 92.276-4.43c0 0 5.526 5.602 14.215 8.666c-81.747 23.904-172.798 1.885-114.296-17.532"></path>
      <path
        fill="#e76f00"
        d="M143.942 165.515c16.66 19.18-4.377 36.44-4.377 36.44s42.301-21.837 22.874-49.183c-18.144-25.5-32.059-38.172 43.268-81.858c0 0-118.238 29.53-61.765 94.6"></path>
      <path
        fill="#5382a1"
        d="M233.364 295.442s9.767 8.047-10.757 14.273c-39.026 11.823-162.432 15.393-196.714.471c-12.323-5.36 10.787-12.8 18.056-14.362c7.581-1.644 11.914-1.337 11.914-1.337c-13.705-9.655-88.583 18.957-38.034 27.15c137.853 22.356 251.292-10.066 215.535-26.195M88.9 190.48s-62.771 14.91-22.228 20.323c17.118 2.292 51.243 1.774 83.03-.89c25.978-2.19 52.063-6.85 52.063-6.85s-9.16 3.923-15.787 8.448c-63.744 16.765-186.886 8.966-151.435-8.183c29.981-14.492 54.358-12.848 54.358-12.848m112.605 62.942c64.8-33.672 34.839-66.03 13.927-61.67c-5.126 1.066-7.411 1.99-7.411 1.99s1.903-2.98 5.537-4.27c41.37-14.545 73.187 42.897-13.355 65.647c0 .001 1.003-.895 1.302-1.697"></path>
      <path
        fill="#e76f00"
        d="M162.439.371s35.887 35.9-34.037 91.101c-56.071 44.282-12.786 69.53-.023 98.377c-32.73-29.53-56.75-55.526-40.635-79.72C111.395 74.612 176.918 57.393 162.439.37"></path>
      <path
        fill="#5382a1"
        d="M95.268 344.665c62.199 3.982 157.712-2.209 159.974-31.64c0 0-4.348 11.158-51.404 20.018c-53.088 9.99-118.564 8.824-157.399 2.421c.001 0 7.95 6.58 48.83 9.201"></path>
    </svg>
  );
}

export function CsharpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={128}
      height={128}
      viewBox="0 0 128 128"
      {...props}>
      <path
        fill="#9b4f96"
        d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7s-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7"></path>
      <path
        fill="#68217a"
        d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7s2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8z"></path>
      <path
        fill="#fff"
        d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20c-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8z"></path>
    </svg>
  );
}

export function CppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}>
      <path
        fill="#659ad2"
        d="M29 10.232a2.4 2.4 0 0 0-.318-1.244a2.45 2.45 0 0 0-.936-.879q-5.194-2.868-10.393-5.733a2.64 2.64 0 0 0-2.763.024c-1.378.779-8.275 4.565-10.331 5.706A2.29 2.29 0 0 0 3 10.231V21.77a2.4 2.4 0 0 0 .3 1.22a2.43 2.43 0 0 0 .954.9c2.056 1.141 8.954 4.927 10.332 5.706a2.64 2.64 0 0 0 2.763.026q5.19-2.871 10.386-5.733a2.44 2.44 0 0 0 .955-.9a2.4 2.4 0 0 0 .3-1.22V10.232"></path>
      <path
        fill="#00599c"
        d="M28.549 23.171a2 2 0 0 0 .147-.182a2.4 2.4 0 0 0 .3-1.22V10.232a2.4 2.4 0 0 0-.318-1.244c-.036-.059-.089-.105-.13-.16L16 16Z"></path>
      <path
        fill="#004482"
        d="M28.549 23.171L16 16L3.451 23.171a2.4 2.4 0 0 0 .809.72c2.056 1.141 8.954 4.927 10.332 5.706a2.64 2.64 0 0 0 2.763.026q5.19-2.871 10.386-5.733a2.4 2.4 0 0 0 .808-.719"></path>
      <path
        fill="#fff"
        d="M19.6 18.02a4.121 4.121 0 1 1-.027-4.087l3.615-2.073A8.309 8.309 0 0 0 7.7 16a8.2 8.2 0 0 0 1.1 4.117a8.319 8.319 0 0 0 14.411-.017z"></path>
      <path
        fill="#fff"
        d="M24.076 15.538h-.926v-.921h-.925v.921h-.926v.923h.926v.92h.925v-.92h.926zm3.473 0h-.926v-.921h-.926v.921h-.926v.923h.926v.92h.926v-.92h.926z"></path>
    </svg>
  );
}

export function CIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="168"
      height="168"
      viewBox="0 0 32 32">
      <path
        fill="#659ad2"
        d="M29 10.232a2.4 2.4 0 0 0-.318-1.244a2.45 2.45 0 0 0-.936-.879q-5.194-2.868-10.393-5.733a2.64 2.64 0 0 0-2.763.024c-1.378.779-8.275 4.565-10.331 5.706A2.29 2.29 0 0 0 3 10.231V21.77a2.4 2.4 0 0 0 .3 1.22a2.43 2.43 0 0 0 .954.9c2.056 1.141 8.954 4.927 10.332 5.706a2.64 2.64 0 0 0 2.763.026q5.19-2.871 10.386-5.733a2.44 2.44 0 0 0 .955-.9a2.4 2.4 0 0 0 .3-1.22V10.232"
      />
      <path
        fill="#00599c"
        d="M28.549 23.171a2 2 0 0 0 .147-.182a2.4 2.4 0 0 0 .3-1.22V10.232a2.4 2.4 0 0 0-.318-1.244c-.036-.059-.089-.105-.13-.16L16 16Z"
      />
      <path
        fill="#004482"
        d="M28.549 23.171L16 16L3.451 23.171a2.4 2.4 0 0 0 .809.72c2.056 1.141 8.954 4.927 10.332 5.706a2.64 2.64 0 0 0 2.763.026q5.19-2.871 10.386-5.733a2.4 2.4 0 0 0 .808-.719"
      />
      <path
        fill="#fff"
        d="M19.6 18.02a4.121 4.121 0 1 1-.027-4.087l3.615-2.073A8.309 8.309 0 0 0 7.7 16a8.2 8.2 0 0 0 1.1 4.117a8.319 8.319 0 0 0 14.411-.017z"
      />
    </svg>
  );
}

export function RubyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={1024}
      height={1024}
      viewBox="0 0 1024 1024"
      {...props}>
      <path
        fill="#0098fb"
        fillRule="evenodd"
        d="M509.815 112.02q-1.103.074-2.2.213h-4.328l-3.406 1.703a36.3 36.3 0 0 0-8.87 4.4l-145.96 73.013l-153.695 153.692l-72.66 145.247a36.3 36.3 0 0 0-4.897 9.863l-1.561 3.122v3.974a36.3 36.3 0 0 0 0 8.302v298.229l6.883 9.508c5.975 8.28 12.713 16.544 20.578 24.41c37.856 37.854 87.664 57.169 142.625 62.015a36.3 36.3 0 0 0 11.566 1.774h575.753c3.14.534 6.337.654 9.508.355a36 36 0 0 0 2.554-.355h29.803V881.54a36.3 36.3 0 0 0 0-11.92V293.88a36.3 36.3 0 0 0-1.774-11.566c-4.848-54.956-24.165-104.757-62.017-142.622h-.071v-.07c-7.85-7.807-16.071-14.49-24.268-20.436l-9.58-6.954h-298.66a36 36 0 0 0-5.322-.213m133.188 72.872h145.96c2.467 2.081 5.248 4.054 7.451 6.245c26.585 26.63 40.964 64.743 42.291 111.188zm-132.691 5.11l65.707 39.38l-25.474 156.104l-64.359 64.357l-100.69 100.687l-156.107 25.473l-39.381-65.705l61.095-122.258L388.05 251.095zm132.762 79.612l123.183 73.937l-138.084 17.242zm178.814 140.21c-21.21 68.248-62.66 142.573-122.402 211.875l-65.85-188.389zm-252.54 59.603l53.645 153.55l-153.553-53.643l68.12-68.119zm269.499 81.032v236.994L738.44 687.05c40.102-43.738 73.727-89.827 100.406-136.59m-478.044 77.697L343.56 766.238l-73.938-123.18zm72.52 5.464l188.322 65.847c-69.283 59.712-143.574 101.195-211.81 122.4zm-248.424 9.366l117.435 195.698c-46.5-1.327-84.636-15.736-111.262-42.361c-2.161-2.162-4.113-4.939-6.173-7.38zm502.169 95.436l100.405 100.404h-237c46.768-26.68 92.86-60.308 136.595-100.404"></path>
    </svg>
  );
}

export function PHPIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={128}
      height={128}
      viewBox="0 0 128 128"
      {...props}>
      <path
        fill="url(#deviconPhp0)"
        d="M0 64c0 18.593 28.654 33.667 64 33.667S128 82.593 128 64S99.345 30.333 64 30.333S0 45.407 0 64"></path>
      <path
        fill="#777bb3"
        d="M64 95.167c33.965 0 61.5-13.955 61.5-31.167c0-17.214-27.535-31.167-61.5-31.167S2.5 46.786 2.5 64c0 17.212 27.535 31.167 61.5 31.167"></path>
      <path d="M34.772 67.864c2.793 0 4.877-.515 6.196-1.53c1.306-1.006 2.207-2.747 2.68-5.175c.44-2.27.272-3.854-.5-4.71c-.788-.874-2.493-1.317-5.067-1.317h-4.464l-2.473 12.732zM20.173 83.547a.694.694 0 0 1-.68-.828l6.557-33.738a.695.695 0 0 1 .68-.561h14.134c4.442 0 7.748 1.206 9.827 3.585c2.088 2.39 2.734 5.734 1.917 9.935c-.333 1.711-.905 3.3-1.7 4.724a15.8 15.8 0 0 1-3.128 3.92c-1.531 1.432-3.264 2.472-5.147 3.083c-1.852.604-4.232.91-7.07.91h-5.724l-1.634 8.408a.695.695 0 0 1-.682.562z"></path>
      <path
        fill="#fff"
        d="M34.19 55.826h3.891c3.107 0 4.186.682 4.553 1.089c.607.674.723 2.097.331 4.112c-.439 2.257-1.253 3.858-2.42 4.756c-1.194.92-3.138 1.386-5.773 1.386h-2.786zm6.674-8.1H26.731a1.39 1.39 0 0 0-1.364 1.123L18.81 82.588a1.39 1.39 0 0 0 1.363 1.653h7.35a1.39 1.39 0 0 0 1.363-1.124l1.525-7.846h5.151c2.912 0 5.364-.318 7.287-.944c1.977-.642 3.796-1.731 5.406-3.237a16.5 16.5 0 0 0 3.259-4.087c.831-1.487 1.429-3.147 1.775-4.931c.86-4.423.161-7.964-2.076-10.524c-2.216-2.537-5.698-3.823-10.349-3.823zM30.301 68.557h4.471q4.445.001 6.62-1.675q2.175-1.674 2.938-5.591q.728-3.762-.665-5.308q-1.395-1.546-5.584-1.546h-5.036l-2.743 14.12m10.563-19.445q6.378 0 9.303 3.348t1.76 9.346q-.482 2.472-1.625 4.518q-1.145 2.048-2.991 3.747q-2.2 2.06-4.892 2.935q-2.691.876-6.857.875h-6.296l-1.743 8.97h-7.35l6.558-33.739z"></path>
      <path d="M69.459 74.577a.694.694 0 0 1-.682-.827l2.9-14.928c.277-1.42.209-2.438-.19-2.87c-.245-.263-.979-.704-3.15-.704h-5.256l-3.646 18.768a.695.695 0 0 1-.683.56h-7.29a.695.695 0 0 1-.683-.826l6.558-33.739a.695.695 0 0 1 .682-.561h7.29a.695.695 0 0 1 .683.826L64.41 48.42h5.653c4.307 0 7.227.758 8.928 2.321c1.733 1.593 2.275 4.14 1.608 7.573l-3.051 15.702a.695.695 0 0 1-.682.56z"></path>
      <path
        fill="#fff"
        d="M65.31 38.755h-7.291a1.39 1.39 0 0 0-1.364 1.124l-6.557 33.738a1.39 1.39 0 0 0 1.363 1.654h7.291a1.39 1.39 0 0 0 1.364-1.124l3.537-18.205h4.682c2.168 0 2.624.463 2.641.484c.132.14.305.795.019 2.264l-2.9 14.927a1.39 1.39 0 0 0 1.364 1.654h7.408a1.39 1.39 0 0 0 1.363-1.124l3.051-15.7c.715-3.686.103-6.45-1.82-8.217c-1.836-1.686-4.91-2.505-9.398-2.505h-4.81l1.421-7.315a1.39 1.39 0 0 0-1.364-1.655m0 1.39l-1.743 8.968h6.496q6.131 0 8.457 2.14q2.328 2.138 1.398 6.93l-3.052 15.699h-7.407l2.901-14.928q.495-2.547-.365-3.474q-.86-.926-3.658-.926h-5.829l-3.756 19.327H51.46l6.558-33.739h7.292z"></path>
      <path d="M92.136 67.864c2.793 0 4.878-.515 6.198-1.53c1.304-1.006 2.206-2.747 2.679-5.175c.44-2.27.273-3.854-.5-4.71c-.788-.874-2.493-1.317-5.067-1.317h-4.463l-2.475 12.732zM77.54 83.547a.694.694 0 0 1-.682-.828l6.557-33.738a.695.695 0 0 1 .682-.561H98.23c4.442 0 7.748 1.206 9.826 3.585c2.089 2.39 2.734 5.734 1.917 9.935a15.9 15.9 0 0 1-1.699 4.724a15.8 15.8 0 0 1-3.128 3.92c-1.53 1.432-3.265 2.472-5.147 3.083c-1.852.604-4.232.91-7.071.91h-5.723l-1.633 8.408a.695.695 0 0 1-.683.562z"></path>
      <path
        fill="#fff"
        d="M91.555 55.826h3.891c3.107 0 4.186.682 4.552 1.089c.61.674.724 2.097.333 4.112c-.44 2.257-1.254 3.858-2.421 4.756c-1.195.92-3.139 1.386-5.773 1.386h-2.786zm6.674-8.1H84.096a1.39 1.39 0 0 0-1.363 1.123l-6.558 33.739a1.39 1.39 0 0 0 1.364 1.653h7.35a1.39 1.39 0 0 0 1.363-1.124l1.525-7.846h5.15c2.911 0 5.364-.318 7.286-.944c1.978-.642 3.797-1.731 5.408-3.238a16.5 16.5 0 0 0 3.258-4.086c.832-1.487 1.428-3.147 1.775-4.931c.86-4.423.162-7.964-2.076-10.524c-2.216-2.537-5.697-3.823-10.35-3.823zM87.666 68.557h4.47q4.445.001 6.622-1.675q2.175-1.674 2.936-5.591q.731-3.762-.665-5.308t-5.583-1.546h-5.035Zm10.563-19.445q6.378 0 9.303 3.348t1.759 9.346q-.48 2.472-1.624 4.518q-1.144 2.048-2.992 3.747q-2.2 2.06-4.892 2.935q-2.69.876-6.856.875h-6.295l-1.745 8.97h-7.35l6.558-33.739h14.133"></path>
      <defs>
        <radialGradient
          id="deviconPhp0"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="translate(38.426 42.169)scale(84.04136)"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#aeb2d5"></stop>
          <stop offset={0.3} stopColor="#aeb2d5"></stop>
          <stop offset={0.75} stopColor="#484c89"></stop>
          <stop offset={1} stopColor="#484c89"></stop>
        </radialGradient>
      </defs>
    </svg>
  );
}

export function GoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}>
      <path
        fill="#0098fb"
        d="M3.51 10.503c-.04 0-.05-.02-.03-.05l.205-.266c.02-.03.068-.05.107-.05h3.476c.04 0 .049.03.03.06l-.166.257c-.02.03-.068.059-.097.059zm-1.471.91c-.039 0-.049-.02-.03-.05l.205-.267c.02-.03.068-.05.107-.05h4.44c.04 0 .06.03.05.06l-.078.237c-.01.04-.049.06-.088.06zm2.357.91c-.04 0-.049-.03-.03-.06l.137-.247c.02-.03.058-.06.097-.06h1.948c.039 0 .058.03.058.07l-.02.237c0 .04-.038.07-.067.07zm10.108-1.998c-.614.158-1.032.277-1.636.435c-.146.04-.156.05-.283-.099c-.146-.168-.253-.277-.457-.376c-.614-.306-1.208-.217-1.763.149c-.662.435-1.003 1.078-.993 1.879c.01.791.545 1.444 1.315 1.553c.662.089 1.217-.149 1.655-.653c.088-.109.165-.228.263-.366h-1.88c-.204 0-.253-.129-.184-.297c.126-.306.36-.82.496-1.078a.26.26 0 0 1 .243-.158h3.545c-.02.267-.02.534-.058.801a4.25 4.25 0 0 1-.799 1.939c-.7.94-1.616 1.523-2.775 1.68c-.954.13-1.84-.059-2.62-.652q-1.078-.831-1.236-2.196c-.127-1.077.185-2.047.827-2.897c.692-.92 1.607-1.504 2.727-1.711c.915-.168 1.792-.06 2.58.484c.517.346.887.821 1.13 1.395c.059.089.02.138-.097.168"></path>
      <path
        fill="#0098fb"
        d="M17.726 15.794c-.886-.02-1.694-.277-2.376-.87a3.12 3.12 0 0 1-1.052-1.91c-.175-1.117.127-2.106.79-2.986c.71-.95 1.567-1.444 2.726-1.652c.993-.178 1.928-.079 2.775.505c.77.534 1.247 1.256 1.373 2.205c.166 1.335-.214 2.423-1.12 3.353a4.44 4.44 0 0 1-2.337 1.266c-.263.05-.526.06-.779.09m2.318-3.996c-.01-.128-.01-.227-.03-.326c-.175-.98-1.06-1.533-1.986-1.315c-.905.207-1.49.79-1.704 1.72c-.175.772.195 1.553.896 1.87c.535.237 1.071.207 1.587-.06c.77-.405 1.188-1.038 1.237-1.889"></path>
    </svg>
  );
}

export function RustIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}>
      <path
        fill="#ff7043"
        d="m23.835 11.703l-1.008-.623l-.028-.294l.866-.807a.348.348 0 0 0-.116-.578l-1.106-.414a9 9 0 0 0-.087-.285l.69-.96a.346.346 0 0 0-.226-.544l-1.166-.19a9 9 0 0 0-.14-.261l.49-1.076a.34.34 0 0 0-.028-.336a.35.35 0 0 0-.3-.154l-1.185.041a7 7 0 0 0-.188-.227l.273-1.153a.347.347 0 0 0-.417-.417l-1.153.273l-.228-.188l.041-1.184a.344.344 0 0 0-.49-.328l-1.076.49l-.262-.14l-.19-1.167a.348.348 0 0 0-.545-.226l-.96.69a9 9 0 0 0-.285-.086L14.597.453a.348.348 0 0 0-.578-.116l-.807.867a9 9 0 0 0-.294-.028L12.295.168a.346.346 0 0 0-.59 0l-.623 1.008l-.294.028L9.98.337a.346.346 0 0 0-.578.116l-.414 1.106l-.285.086l-.959-.69a.348.348 0 0 0-.545.226l-.19 1.167a9 9 0 0 0-.262.14l-1.076-.49a.346.346 0 0 0-.49.328l.041 1.184a8 8 0 0 0-.228.187l-1.153-.272a.347.347 0 0 0-.417.417l.271 1.153l-.186.227l-1.184-.042a.346.346 0 0 0-.328.49l.49 1.077a9 9 0 0 0-.14.262l-1.166.19a.348.348 0 0 0-.226.544l.69.958l-.087.286l-1.106.414a.348.348 0 0 0-.116.578l.866.807a9 9 0 0 0-.028.294l-1.008.623a.344.344 0 0 0 0 .59l1.008.623q.012.147.028.294l-.866.807a.346.346 0 0 0 .116.578l1.106.415q.042.144.087.285l-.69.959a.345.345 0 0 0 .227.544l1.166.19q.069.132.14.262l-.49 1.076a.346.346 0 0 0 .328.49l1.183-.041q.093.115.187.227l-.27 1.154a.346.346 0 0 0 .416.417l1.153-.272q.113.096.228.187l-.041 1.184a.344.344 0 0 0 .49.327l1.076-.49q.13.073.262.14l.19 1.167a.348.348 0 0 0 .545.227l.959-.69a9 9 0 0 0 .285.086l.414 1.107a.345.345 0 0 0 .578.115l.808-.865l.294.03l.623 1.006a.347.347 0 0 0 .59 0l.623-1.007q.148-.013.294-.03l.807.866a.348.348 0 0 0 .578-.115l.414-1.107a9 9 0 0 0 .285-.087l.959.69a.345.345 0 0 0 .545-.226l.19-1.166l.262-.14l1.076.49a.347.347 0 0 0 .49-.328l-.041-1.184a7 7 0 0 0 .227-.187l1.153.272a.347.347 0 0 0 .417-.416l-.272-1.155q.095-.112.187-.227l1.184.041a.344.344 0 0 0 .328-.49l-.49-1.076q.072-.13.141-.262l1.166-.19a.348.348 0 0 0 .226-.544l-.69-.959l.087-.285l1.106-.414a.346.346 0 0 0 .116-.579l-.866-.807q.016-.147.028-.294l1.008-.624a.344.344 0 0 0 0-.589zm-6.742 8.355a.714.714 0 0 1 .299-1.396a.714.714 0 1 1-.3 1.396zm-.342-2.314a.65.65 0 0 0-.771.5l-.358 1.669a8.7 8.7 0 0 1-3.619.78a8.7 8.7 0 0 1-3.695-.815L7.95 18.21a.65.65 0 0 0-.772-.5l-1.473.317a9 9 0 0 1-.761-.898h7.167c.081 0 .136-.014.136-.088v-2.536c0-.074-.054-.088-.136-.088h-2.096v-1.608h2.268c.206 0 1.106.059 1.393 1.209c.09.353.288 1.504.424 1.873c.134.413.683 1.238 1.268 1.238h3.572a1 1 0 0 0 .13-.013a9 9 0 0 1-.813.952zm-9.914 2.28a.714.714 0 1 1-.3-1.396a.714.714 0 0 1 .3 1.396M4.117 8.997a.714.714 0 1 1-1.303.58a.714.714 0 0 1 1.304-.58m-.834 1.981l1.534-.682a.65.65 0 0 0 .33-.858l-.316-.715h1.244v5.602H3.567a8.8 8.8 0 0 1-.284-3.348zm6.734-.543V8.784h2.96c.153 0 1.08.177 1.08.87c0 .574-.712.78-1.296.78zm10.757 1.486q0 .329-.024.651h-.9c-.09 0-.127.059-.127.148v.413c0 .973-.548 1.184-1.03 1.238c-.457.052-.964-.191-1.027-.472c-.27-1.518-.72-1.843-1.43-2.403c.882-.56 1.799-1.386 1.799-2.492c0-1.193-.82-1.945-1.377-2.315c-.783-.516-1.65-.62-1.883-.62H5.468a8.77 8.77 0 0 1 4.907-2.77l1.098 1.152a.65.65 0 0 0 .918.02l1.227-1.173a8.78 8.78 0 0 1 6.004 4.276l-.84 1.898a.65.65 0 0 0 .33.859l1.618.718q.042.43.042.872zm-9.3-9.6a.713.713 0 1 1 .984 1.032a.714.714 0 0 1-.984-1.031m8.339 6.71a.71.71 0 0 1 .939-.362a.714.714 0 1 1-.94.364z"></path>
    </svg>
  );
}

export function SwiftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={128}
      height={128}
      viewBox="0 0 128 128"
      {...props}>
      <path
        fill="#f05138"
        d="M126.33 34.06a39.3 39.3 0 0 0-.79-7.83a28.8 28.8 0 0 0-2.65-7.58a28.8 28.8 0 0 0-4.76-6.32a23.4 23.4 0 0 0-6.62-4.55a27.3 27.3 0 0 0-7.68-2.53c-2.65-.51-5.56-.51-8.21-.76H30.25a45.5 45.5 0 0 0-6.09.51a21.8 21.8 0 0 0-5.82 1.52c-.53.25-1.32.51-1.85.76a34 34 0 0 0-5 3.28c-.53.51-1.06.76-1.59 1.26a22.4 22.4 0 0 0-4.76 6.32a23.6 23.6 0 0 0-2.65 7.58a79 79 0 0 0-.79 7.83v60.39a39.3 39.3 0 0 0 .79 7.83a28.8 28.8 0 0 0 2.65 7.58a28.8 28.8 0 0 0 4.76 6.32a23.4 23.4 0 0 0 6.62 4.55a27.3 27.3 0 0 0 7.68 2.53c2.65.51 5.56.51 8.21.76h63.22a45 45 0 0 0 8.21-.76a27.3 27.3 0 0 0 7.68-2.53a30 30 0 0 0 6.62-4.55a22.4 22.4 0 0 0 4.76-6.32a23.6 23.6 0 0 0 2.65-7.58a79 79 0 0 0 .79-7.83V34.06z"></path>
      <path
        fill="#fefefe"
        d="M85 96.5c-11.11 6.13-26.38 6.76-41.75.47A64.53 64.53 0 0 1 13.84 73a50 50 0 0 0 10.85 6.32c15.87 7.1 31.73 6.61 42.9 0c-15.9-11.66-29.4-26.82-39.46-39.2a43.5 43.5 0 0 1-5.29-6.82c12.16 10.61 31.5 24 38.38 27.79a272 272 0 0 1-27-32.34a266.8 266.8 0 0 0 44.47 34.87c.71.38 1.26.7 1.7 1a33 33 0 0 0 1.21-3.51c3.71-12.89-.53-27.54-9.79-39.67C93.25 33.81 106 57.05 100.66 76.51c-.14.53-.29 1-.45 1.55l.19.22c10.59 12.63 7.68 26 6.35 23.5C101 91 90.37 94.33 85 96.5"></path>
    </svg>
  );
}

export function KotlinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}>
      <defs>
        <linearGradient
          id="materialIconThemeKotlin0"
          x1={1.725}
          x2={22.185}
          y1={22.67}
          y2={1.982}
          gradientTransform="translate(1.306 1.129)scale(.89324)"
          gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#7c4dff"></stop>
          <stop offset={0.5} stopColor="#d500f9"></stop>
          <stop offset={1} stopColor="#ef5350"></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#materialIconThemeKotlin0)"
        d="M2.975 2.976v18.048h18.05v-.03l-4.478-4.511l-4.48-4.515l4.48-4.515l4.443-4.477z"></path>
    </svg>
  );
}

export function ScalaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}>
      <path
        fill="#f44336"
        d="m6.457 9.894l12.523 5.163l-.456 1.211L6 11.105Zm7.02-3.091L26 11.966l-.457 1.21L13.02 8.015ZM6.465 18.885l12.524 5.163l-.457 1.21L6.01 20.097Zm7.007-3.086l12.524 5.163l-.456 1.21l-12.524-5.162Z"></path>
      <path
        fill="#f44336"
        d="M6 24.07V30l19.997-3.106V20.96zM6 5.11v5.99l20-3.11V2zm0 9.96v5.03l20-3.11v-5.03z"></path>
    </svg>
  );
}

export function PowershellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}>
      <path
        fill="#03a9f4"
        d="M29.07 6H7.677A1.535 1.535 0 0 0 6.24 7.113l-4.2 17.774A.852.852 0 0 0 2.93 26h21.393a1.535 1.535 0 0 0 1.436-1.113L29.96 7.112A.852.852 0 0 0 29.07 6M8.626 23.797a1.4 1.4 0 0 1-1.814-.31l-.007-.009a1.075 1.075 0 0 1 .315-1.599l9.6-6.061l-6.102-5.852l-.01-.01a1.068 1.068 0 0 1 .084-1.625l.037-.03a1.38 1.38 0 0 1 1.8.07l7.233 6.957a1.1 1.1 0 0 1 .236.739a1.08 1.08 0 0 1-.412.79c-.074.04-.146.119-10.951 6.935ZM24 22.94A1.135 1.135 0 0 1 22.803 24h-5.634a1.061 1.061 0 1 1 .001-2.112h5.633A1.134 1.134 0 0 1 24 22.938Z"></path>
    </svg>
  );
}

export function SQLIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}>
      <path
        fill="none"
        stroke="#ff7043"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8a2 2 0 0 1 2 2v4a2 2 0 1 1-4 0v-4a2 2 0 0 1 2-2m5 0v8h4m-8-1l1 1M3 15a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1"></path>
    </svg>
  );
}

export function DockerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}>
      <path
        fill="#2396ed"
        d="M12.988 11.321h-2.035V9.448h2.035zm0-6.363h-2.035v1.906h2.035zm2.455 4.554h-2.035v1.842h2.035zM10.566 7.22H8.53v1.873h2.034zm2.422 0h-2.035v1.873h2.035zm8.689 3.133c-.452-.323-1.486-.42-2.261-.258c-.097-.775-.55-1.421-1.26-2.003l-.452-.258l-.258.452c-.55.872-.743 2.326-.13 3.262a3.4 3.4 0 0 1-1.485.356H2.07c-.259 1.582.193 3.682 1.356 5.103c1.13 1.357 2.907 2.035 5.168 2.035c4.91 0 8.592-2.26 10.272-6.395c.646 0 2.132 0 2.875-1.422c.032-.032.226-.42.258-.549zm-15.989-.84H3.621v1.842h2.035V9.512zm2.423 0H6.076v1.842H8.11zm2.454 0H8.532v1.842h2.034zM8.111 7.22H6.076v1.873H8.11z"></path>
    </svg>
  );
}

export function TxtIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}>
      <path
        fill="none"
        stroke="#b7b7b7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8h4M5 8v8m12-8h4m-2 0v8m-9-8l4 8m-4 0l4-8"></path>
    </svg>
  );
}

export const DefaultFileIcon = ({ color = '#6E6E6E' }: { color?: string }) => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={color}>
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
  </svg>
);

// File icon resolver - updated to use centralized constants
export const getFileIcon = (
  fileName: string,
  isDirectory: boolean,
  isOpen = false,
) => {
  const theme = useTheme();

  if (isDirectory) {
    return isOpen ? <FolderOpenIcon /> : <FolderIcon />;
  }

  const extension = getFileExtension(fileName);

  // Use centralized check for whether file has an icon
  if (!hasFileIcon(fileName)) {
    return <DefaultFileIcon />;
  }

  // Icon mapping based on extension
  const iconMap: Record<string, React.ReactElement> = {
    js: <JavaScriptIcon />,
    ts: <TypeScriptIcon />,
    jsx: <ReactIcon />,
    tsx: <ReactIcon />,
    json: <JSONIcon />,
    css: <CSSIcon />,
    scss: <CSSIcon />,
    sass: <CSSIcon />,
    html: <HTMLIcon />,
    htm: <HTMLIcon />,
    md: <MarkdownIcon />,
    markdown: <MarkdownIcon />,
    less: <LessIcon />,
    xml: <XMLIcon />,
    yml: <YMLIcon />,
    yaml: <YMLIcon />,
    py: <PythonIcon />,
    java: <JavaIcon />,
    cs: <CsharpIcon />,
    cxx: <CppIcon />,
    cc: <CppIcon />,
    h: <CppIcon />,
    hpp: <CppIcon />,
    cpp: <CppIcon />,
    c: <CIcon />,
    rb: <RubyIcon />,
    php: <PHPIcon />,
    go: <GoIcon />,
    rs: <RustIcon />,
    swift: <SwiftIcon />,
    kt: <KotlinIcon />,
    scala: <ScalaIcon />,
    sh: <PowershellIcon />,
    ps1: <PowershellIcon />,
    sql: <SQLIcon />,
    dockerfile: <DockerIcon />,
    txt: <TxtIcon />,
  };

  return iconMap[extension] || <DefaultFileIcon />;
};
