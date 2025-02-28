import { Box, styled, Tooltip } from '@mui/material';
import { IconListName, IconType } from '../types/icon';
import Icon from './icon';

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

function IconList({ icons, active, onIconClick }: IconListProps) {
  return (
    <IconContainer>
      {icons.map(({ name, icon, description }) => (
        <Icon
          key={name}
          name={name}
          icon={icon}
          description={description}
          onClick={() => onIconClick && onIconClick(name)}
          active={!!(active === name)}
        />
      ))}
    </IconContainer>
  );
}

export default IconList;
