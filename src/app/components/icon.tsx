import { Box, styled, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom/dist';

interface IconProps {
  name: string;
  icon: JSX.Element;
  description: string;
  onClick?: (name: string) => void;
  active: boolean;
}

const IconWrapper = styled(Box, {
  shouldForwardProp: prop => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1.25),
  cursor: 'pointer',
  opacity: 0.6,

  paddingRight: active ? theme.spacing(1) : theme.spacing(1.25),

  '&:hover': {
    opacity: 1,
  },
}));

const ActiveHighlight = styled(Box)(({ theme }) => ({
  width: theme.size(0.25),
  height: '100%',
  backgroundColor: theme.palette.sidebar.iconActive,
  zIndex: 1,
}));

const IconRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
}));

export default function Icon({
  name,
  icon,
  description,
  onClick,
  active = false,
}: IconProps) {
  let linkHref = '/main_window/' + name;

  console.log('Icon:', name, active);

  return (
    <Tooltip
      key={name}
      title={description}
      placement="right"
      arrow
      enterDelay={0}
      leaveDelay={0}
      disableInteractive>
      <IconRow>
        <Link to={linkHref}>
          <IconWrapper
            key={name}
            active={active}
            onClick={() => onClick && onClick(name)}>
            {icon}
          </IconWrapper>
        </Link>
        {active && <ActiveHighlight />}
      </IconRow>
    </Tooltip>
  );
}
