import { memo, useState, useCallback, useEffect } from 'react';
import { Box, styled, Typography } from '@mui/material';
import ContentSection from '../sections/content';
import SidebarSection from '../sections/sidebar';
import { useProjectOperations } from '../shared/hooks';
import QuickFileOpener from '../components/quick-file-opener';
import { useAppSelector } from '../shared/hooks';

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
  const { hasFolder, folderName, openFileOrFolder } = useProjectOperations();
  const [isQuickFileOpenerOpen, setIsQuickFileOpenerOpen] = useState(false);
  const title = useAppSelector(state => state.main.appState.title);

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return savedWidth ? parseInt(savedWidth, 10) : DEFAULT_SIDEBAR_WIDTH;
  });

  // Handle sidebar resize
  const handleSidebarResize = useCallback((newWidth: number) => {
    setSidebarWidth(newWidth);
    localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth.toString());
  }, []);

  // Handle open file or folder
  const handleOpenFileOrFolder = useCallback(async () => {
    try {
      await openFileOrFolder();
    } catch (error) {
      console.error('Error opening file or folder:', error);
    }
  }, [openFileOrFolder]);

  // Handle keyboard shortcuts for quick file opener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+P (Mac) or Ctrl+P (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
        // Only open if we have a folder and the modal isn't already open
        if (hasFolder && !isQuickFileOpenerOpen) {
          event.preventDefault();
          setIsQuickFileOpenerOpen(true);
        }
      }

      // Check for Cmd+O (Mac) or Ctrl+O (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'o') {
        event.preventDefault();
        handleOpenFileOrFolder();
      }

      // Check for Cmd+J (Mac) or Ctrl+J (Windows/Linux) for terminal
      if ((event.metaKey || event.ctrlKey) && event.key === 'j') {
        event.preventDefault();
        handleOpenTerminal();
      }
    };

    // Handle menu events from application menu
    const handleMenuQuickOpen = () => {
      if (hasFolder && !isQuickFileOpenerOpen) {
        setIsQuickFileOpenerOpen(true);
      }
    };

    // Handle terminal opening from menu
    const handleMenuTerminal = () => {
      handleOpenTerminal();
    };

    // Terminal opening function
    const handleOpenTerminal = async () => {
      try {
        await window.electron.openTerminal();
        console.log('Terminal opened successfully');
      } catch (error) {
        console.error('Failed to open terminal:', error);
      }
    };

    // Add global keyboard event listener
    document.addEventListener('keydown', handleKeyDown);

    // Add menu event listeners if electron is available
    let menuQuickOpenCleanup: (() => void) | undefined;
    let menuTerminalCleanup: (() => void) | undefined;

    if (window.electron && window.electron.onMenuQuickOpenFile) {
      menuQuickOpenCleanup =
        window.electron.onMenuQuickOpenFile(handleMenuQuickOpen);
    }

    if (window.electron && window.electron.onMenuOpenTerminal) {
      menuTerminalCleanup =
        window.electron.onMenuOpenTerminal(handleMenuTerminal);
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (menuQuickOpenCleanup) {
        menuQuickOpenCleanup();
      }
      if (menuTerminalCleanup) {
        menuTerminalCleanup();
      }
    };
  }, [hasFolder, isQuickFileOpenerOpen, handleOpenFileOrFolder]);

  const handleCloseQuickFileOpener = useCallback(() => {
    setIsQuickFileOpenerOpen(false);
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

      {/* Quick File Opener Modal */}
      <QuickFileOpener
        open={isQuickFileOpenerOpen}
        onClose={handleCloseQuickFileOpener}
      />
    </MainContainer>
  );
});

export default MainComponent;
