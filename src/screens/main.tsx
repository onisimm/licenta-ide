import { memo, useState, useCallback, useEffect } from 'react';
import { Box, styled, Typography } from '@mui/material';
import ContentSection from '../sections/content';
import SidebarSection from '../sections/sidebar';
import { useAppTitle } from '../shared/hooks';

const SIDEBAR_WIDTH_KEY = 'sidebar-width';
const DEFAULT_SIDEBAR_WIDTH = 260;

const MainContainer = styled(Box)({
  display: 'grid',
  gridTemplateRows: '35px 1fr 20px',
  height: '100vh',
});

const HeaderContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  WebkitAppRegion: 'drag',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.5),
}));

const BodyContainer = styled(Box)<{ sidebarWidth: number }>(
  ({ theme, sidebarWidth }) => ({
    display: 'grid',
    gridTemplateAreas: '"main sidebar"',
    gridTemplateColumns: `1fr ${sidebarWidth}px`,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
  }),
);

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const MainComponent = memo(() => {
  const { title } = useAppTitle();

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_SIDEBAR_WIDTH;
  });

  const handleSidebarResize = useCallback((newWidth: number) => {
    // Constrain width between 260px and 75% of screen width
    const maxWidth = Math.floor(window.innerWidth * 0.75);
    const constrainedWidth = Math.max(260, Math.min(maxWidth, newWidth));
    setSidebarWidth(constrainedWidth);
    localStorage.setItem(SIDEBAR_WIDTH_KEY, constrainedWidth.toString());
  }, []);

  return (
    <MainContainer>
      <HeaderContainer>
        <Typography variant="body1">{title}</Typography>
      </HeaderContainer>
      <BodyContainer sidebarWidth={sidebarWidth}>
        <ContentSection />
        <SidebarSection width={sidebarWidth} onResize={handleSidebarResize} />
      </BodyContainer>
      <FooterContainer />
    </MainContainer>
  );
});

export default MainComponent;
