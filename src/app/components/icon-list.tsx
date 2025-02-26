import { Box, styled, Tooltip } from '@mui/material';
import { IconListName, IconType } from '../types/icon';

interface IconListProps {
  icons: IconType[];
  active?: IconListName;
}

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  alignItems: 'center',
}));

const IconWrapper = styled(Box)<{ active: boolean }>(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.25),
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  borderRight: active
    ? `${theme.size(0.25)} solid ${theme.palette.sidebar.iconActive}`
    : 'none',
  cursor: 'pointer',
  opacity: 0.6,

  '&:hover': {
    opacity: 1,
  },
}));

function IconList({ icons, active }: IconListProps) {
  return (
    <IconContainer>
      {icons.map(({ name, icon, description }) => (
        <Tooltip key={name} title={description} placement="right" arrow>
          <IconWrapper key={name} active={name === active}>
            {icon}
          </IconWrapper>
        </Tooltip>
      ))}
    </IconContainer>
  );
}

export default IconList;
