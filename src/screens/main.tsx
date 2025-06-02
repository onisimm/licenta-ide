import { memo, useState, useCallback, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import ContentSection from '../sections/content';
import SidebarSection from '../sections/sidebar';

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
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_SIDEBAR_WIDTH;
  });

  const handleSidebarResize = useCallback((newWidth: number) => {
    // Constrain width between 260px and 500px
    const constrainedWidth = Math.max(260, Math.min(500, newWidth));
    setSidebarWidth(constrainedWidth);
    localStorage.setItem(SIDEBAR_WIDTH_KEY, constrainedWidth.toString());
  }, []);

  return (
    <MainContainer>
      <HeaderContainer />
      <BodyContainer sidebarWidth={sidebarWidth}>
        <ContentSection />
        <SidebarSection width={sidebarWidth} onResize={handleSidebarResize} />
      </BodyContainer>
      <FooterContainer />
    </MainContainer>
  );
});

export default MainComponent;
