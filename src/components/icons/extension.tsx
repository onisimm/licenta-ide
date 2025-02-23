import { styled } from '@mui/material';
import { IconProps } from '../types/icon';

const StyledSVG = styled('svg')(({ theme }) => ({
  fill: theme.palette.sidebar.icon,
}));

export function ExtensionIcon({ size = 24, color, ...props }: IconProps) {
  return (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ fill: color }}
      {...props}>
      <path d="M13.5 1.5L15 0h7.5L24 1.5V9l-1.5 1.5H15L13.5 9zm1.5 0V9h7.5V1.5zM0 15V6l1.5-1.5H9L10.5 6v7.5H18l1.5 1.5v7.5L18 24H1.5L0 22.5zm9-1.5V6H1.5v7.5zM9 15H1.5v7.5H9zm1.5 7.5H18V15h-7.5z"></path>
    </StyledSVG>
  );
}
