import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Box, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import IconList from '../components/icon-list';
import { IconListName } from '../types/icon';
import { topIcons, bottomIcons } from '../config/icons';

interface SidebarSectionProps {
  width: number;
  onResize: (newWidth: number) => void;
}

const SidebarContainer = styled(Box)(({ theme }) => ({
  gridArea: 'sidebar',
  overflow: 'hidden',
  display: 'flex',
  flexWrap: 'nowrap',
  position: 'relative',
}));

const ResizeHandle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 4,
  cursor: 'col-resize',
  backgroundColor: 'transparent',
  zIndex: 1000,

  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },

  '&.dragging': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const ExplorerContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  flex: 1,
  minWidth: 0,
  color: theme.palette.text.primary,
  padding: theme.spacing(2),
  borderLeft: `1px solid ${theme.palette.border.main}`,
  overflow: 'hidden',
}));

const IconListContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(0.25),
  paddingBottom: theme.spacing(0.25),
  width: theme.size(6),
  minWidth: theme.size(6),
  height: '100%',
  backgroundColor: theme.palette.primary.light,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const SidebarSection = memo(({ width, onResize }: SidebarSectionProps) => {
  const [activeIcon, setActiveIcon] = useState(IconListName.files);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const onIconClick = (name: IconListName) => {
    setActiveIcon(name);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !sidebarRef.current) return;

      const rect = sidebarRef.current.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      onResize(newWidth);
    },
    [isDragging, onResize],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <SidebarContainer ref={sidebarRef}>
      <ResizeHandle
        className={isDragging ? 'dragging' : ''}
        onMouseDown={handleMouseDown}
      />
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
