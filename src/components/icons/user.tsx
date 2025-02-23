import { styled } from '@mui/material';
import { IconProps } from '../types/icon';

const StyledSVG = styled('svg')(({ theme }) => ({
  fill: theme.palette.sidebar.icon,
}));

export function UserIcon({ size = 26, color, ...props }: IconProps) {
  return (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ fill: color }}
      {...props}>
      <path
        fill={color}
        d="M16 10c0 2.21-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4"></path>
      <path
        fill={color}
        fillRule="evenodd"
        d="M12 24c6.63 0 12-5.37 12-12S18.63 0 12 0S0 5.37 0 12s5.37 12 12 12m6.27-2.96C21.13 19.05 23 15.75 23 12c0-6.08-4.92-11-11-11S1 5.92 1 12c0 3.75 1.87 7.05 4.73 9.04C6.435 19.72 8.71 16 12 16s5.56 3.72 6.27 5.04"
        clipRule="evenodd"></path>
    </StyledSVG>
  );
}
