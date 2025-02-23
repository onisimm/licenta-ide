import { IconProps } from '../types/icon';
import { StyledSVG } from './styled-svg';

export default function SearchIcon({ size = 26, color, ...props }: IconProps) {
  return (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ fill: color }}
      {...props}>
      <path d="M9.309 10.016a4.5 4.5 0 1 1 .707-.707l3.838 3.837a.5.5 0 0 1-.708.708zM10 6.5a3.5 3.5 0 1 0-7 0a3.5 3.5 0 0 0 7 0"></path>
    </StyledSVG>
  );
}
