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
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: active ? 1 : 0.4,
  width: '100%',
  padding: theme.spacing(1),
  boxSizing: 'border-box',
  borderRight: active
    ? `3px solid ${theme.palette.sidebar.iconActive}`
    : 'none',

  '&:hover': {
    opacity: 1,
  },
}));

const StyledLink = styled(Link)(() => ({
  width: '100%',
  display: 'block',
  textDecoration: 'none',
}));

const IconRow = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
}));

export default function Icon({
  name,
  icon,
  description,
  onClick,
  active = false,
}: IconProps) {
  let linkHref = '/main_window/' + name;

  return (
    <Tooltip
      key={name}
      title={description}
      placement="left"
      arrow
      enterDelay={0}
      leaveDelay={0}
      disableInteractive>
      <IconRow>
        <StyledLink to={linkHref}>
          <IconWrapper
            key={name}
            active={active}
            onClick={() => onClick && onClick(name)}>
            {icon}
          </IconWrapper>
        </StyledLink>
        {/* {active && <ActiveHighlight />} */}
      </IconRow>
    </Tooltip>
  );
}
