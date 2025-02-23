import { memo } from 'react';
import { Box, styled } from '@mui/material';
import ContentSection from './sections/content';
import SidebarSection from './sections/sidebar';

const MainContainer = styled(Box)({
  display: 'grid',
  gridTemplateRows: '35px 1fr 20px',
  height: '100vh',
});

const HeaderContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitAppRegion: 'drag',
}));

const BodyContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateAreas: '"main sidebar"',
  gridTemplateColumns: '1fr 260px',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}));

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const MainComponent = memo(() => {
  return (
    <MainContainer>
      <HeaderContainer />
      <BodyContainer>
        <ContentSection />
        <SidebarSection />
      </BodyContainer>
      <FooterContainer />
    </MainContainer>
  );
});

export default MainComponent;
