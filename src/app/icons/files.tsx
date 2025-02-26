import { IconProps } from '../types/icon';
import { StyledSVG } from './styled-svg';

export default function FilesIcon({ size = 24, color, props }: IconProps) {
  return (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      color={color}
      {...props}>
      <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5zm0 2.12l2.38 2.38H17.5zm-3 20.38h-12v-15H7v9.07L8.5 18h6zm6-6h-12v-15H16V6h4.5z"></path>
    </StyledSVG>
  );
}
