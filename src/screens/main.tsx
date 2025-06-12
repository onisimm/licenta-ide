import { memo, useState, useCallback, useEffect } from 'react';
import { Box, styled, Typography } from '@mui/material';
import ContentSection from '../sections/content';
import SidebarSection from '../sections/sidebar';
import { useProjectOperations } from '../shared/hooks';
import QuickFileOpener from '../components/quick-file-opener';

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
  const { hasFolder, folderName } = useProjectOperations();
  const [isQuickFileOpenerOpen, setIsQuickFileOpenerOpen] = useState(false);

  // Generate title based on folder state
  const title = hasFolder && folderName ? `SEditor — ${folderName}` : 'SEditor';

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize sidebar width on mount
  useEffect(() => {
    const initializeSidebarWidth = async () => {
      try {
        if (window.electron?.getSidebarWidth) {
          const stored = await window.electron.getSidebarWidth();
          setSidebarWidth(stored);
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
          setSidebarWidth(saved ? parseInt(saved, 10) : DEFAULT_SIDEBAR_WIDTH);
        }
      } catch (error) {
        console.warn(
          'Failed to get sidebar width from electron store, using localStorage:',
          error,
        );
        try {
          const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
          setSidebarWidth(saved ? parseInt(saved, 10) : DEFAULT_SIDEBAR_WIDTH);
        } catch (localError) {
          console.warn(
            'Failed to get sidebar width from localStorage:',
            localError,
          );
          setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
        }
      }
      setIsInitialized(true);
    };

    initializeSidebarWidth();
  }, []);

  const handleSidebarResize = useCallback(async (newWidth: number) => {
    // Constrain width between 260px and 75% of screen width
    const maxWidth = Math.floor(window.innerWidth * 0.75);
    const constrainedWidth = Math.max(260, Math.min(maxWidth, newWidth));
    setSidebarWidth(constrainedWidth);

    try {
      if (window.electron?.setSidebarWidth) {
        await window.electron.setSidebarWidth(constrainedWidth);
      } else {
        // Fallback to localStorage
        localStorage.setItem(SIDEBAR_WIDTH_KEY, constrainedWidth.toString());
      }
    } catch (error) {
      console.warn(
        'Failed to save sidebar width to electron store, using localStorage:',
        error,
      );
      try {
        localStorage.setItem(SIDEBAR_WIDTH_KEY, constrainedWidth.toString());
      } catch (localError) {
        console.warn(
          'Failed to save sidebar width to localStorage:',
          localError,
        );
      }
    }
  }, []);

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
  }, [hasFolder, isQuickFileOpenerOpen]);

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
