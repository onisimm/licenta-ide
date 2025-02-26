import { memo, useState } from 'react';
import { Box, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IconList from '../components/icon-list';
import { IconListName } from '../types/icon';
import { topIcons, bottomIcons } from '../config/icons';
import { ExplorerSection } from './explorer';

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
  const navigate = useNavigate();

  const onIconClick = (name: IconListName) => {
    setActiveIcon(name);

    switch (name) {
      case IconListName.files:
        navigate('/main_window/explorer');
        break;
      default:
        break;
    }
  };

  return (
    <SidebarContainer>
      <ExplorerSection />

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
