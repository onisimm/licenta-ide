import palette from '../../theme/palette';
import { IconProps } from '../types/icon';

export default function SourceIcon({
  size = 26,
  color = palette.grey[100],
  props,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}>
      <path
        fill={color}
        d="M21.007 8.222A3.738 3.738 0 0 0 15.045 5.2a3.737 3.737 0 0 0 1.156 6.583a2.99 2.99 0 0 1-2.668 1.67h-2.99a4.46 4.46 0 0 0-2.989 1.165V7.4a3.737 3.737 0 1 0-1.494 0v9.117a3.776 3.776 0 1 0 1.816.099a2.99 2.99 0 0 1 2.668-1.667h2.99a4.48 4.48 0 0 0 4.223-3.039a3.736 3.736 0 0 0 3.25-3.687zM4.565 3.738a2.242 2.242 0 1 1 4.484 0a2.242 2.242 0 0 1-4.484 0m4.484 16.441a2.242 2.242 0 1 1-4.484 0a2.242 2.242 0 0 1 4.484 0m8.221-9.715a2.242 2.242 0 1 1 0-4.485a2.242 2.242 0 0 1 0 4.485"></path>
    </svg>
  );
}
