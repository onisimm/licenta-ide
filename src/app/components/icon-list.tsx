import { Box, styled, Tooltip } from '@mui/material';
import { IconListName, IconType } from '../types/icon';

interface IconListProps {
  icons: IconType[];
  active?: IconListName;
  onIconClick?: (name: IconListName) => void;
}

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  alignItems: 'center',
}));

const IconWrapper = styled(Box)<{ active: boolean }>(({ theme, active }) => ({
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

function IconList({ icons, active, onIconClick }: IconListProps) {
  return (
    <IconContainer>
      {icons.map(({ name, icon, description }) => (
        <Tooltip
          key={name}
          title={description}
          placement="right"
          arrow
          enterDelay={0}
          leaveDelay={0}
          disableInteractive>
          <IconRow>
            <IconWrapper
              key={name}
              active={name === active}
              onClick={() => onIconClick && onIconClick(name)}>
              {icon}
            </IconWrapper>
            {name === active && <ActiveHighlight />}
          </IconRow>
        </Tooltip>
      ))}
    </IconContainer>
  );
}

export default IconList;
