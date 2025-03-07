import { memo, useState } from 'react';
import { Box, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import IconList from '../components/icon-list';
import { IconListName } from '../types/icon';
import { topIcons, bottomIcons } from '../config/icons';

const ExplorerContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  flex: 1,
  color: theme.palette.text.primary,
  padding: theme.spacing(2),
  borderLeft: `1px solid ${theme.palette.border.main}`,
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  gridArea: 'sidebar',
  overflow: 'hidden',
  display: 'flex',
  flexWrap: 'nowrap',
}));

const IconListContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(0.25),
  paddingBottom: theme.spacing(0.25),
  width: theme.size(6),
  height: '100%',
  backgroundColor: theme.palette.primary.light,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const SidebarSection = memo(() => {
  const [activeIcon, setActiveIcon] = useState(IconListName.files);

  const onIconClick = (name: IconListName) => {
    console.log('Icon clicked:', name);
    setActiveIcon(name);
  };

  return (
    <SidebarContainer>
      <ExplorerContainer>
        <Outlet />
      </ExplorerContainer>

      <IconListContainer>
        <IconList
          icons={topIcons}
          active={activeIcon}
          onIconClick={onIconClick}
        />
        <IconList
          icons={bottomIcons}
          active={activeIcon}
          onIconClick={onIconClick}
        />
      </IconListContainer>
    </SidebarContainer>
  );
});

export default SidebarSection;
