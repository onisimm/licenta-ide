import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Modal,
  Box,
  styled,
  Typography,
  TextField,
  List,
  ListItem,
  Paper,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getFileIcon } from '../icons/file-types';
import { TFolderTree } from '../shared/types';
import { useProjectOperations } from '../shared/hooks';
import { useAppDispatch } from '../shared/hooks';
import { openFileInTab } from '../shared/rdx-slice';

interface QuickFileOpenerProps {
  open: boolean;
  onClose: () => void;
  onFileSelect?: (file: FileEntry) => void;
}

interface FileEntry {
  name: string;
  path: string;
  relativePath: string;
}

const ModalContainer = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '10vh',
}));

const ModalContent = styled(Paper)(({ theme }) => ({
  width: '600px',
  maxWidth: '90vw',
  maxHeight: '70vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  boxShadow: theme.shadows[10],
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const FileCountIndicator = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  textAlign: 'center',
}));

const ResultsContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  maxHeight: '400px',
}));

const FileItemContainer = styled(ListItem)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    backgroundColor: selected ? theme.palette.action.selected : 'transparent',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
);

const FileIcon = styled(Box)(({ theme }) => ({
  width: 18,
  height: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1),
  flexShrink: 0,
  color: theme.palette.fileTree.fileIcon,
}));

const FileInfo = styled(Box)({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const FileName = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const FilePath = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const QuickFileOpener: React.FC<QuickFileOpenerProps> = ({
  open,
  onClose,
  onFileSelect,
}) => {
  const dispatch = useAppDispatch();
  const { folderStructure, folderPath } = useProjectOperations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allFiles, setAllFiles] = useState<FileEntry[]>([]);
  const [isBackgroundComplete, setIsBackgroundComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load all files when modal opens or folder changes
  useEffect(() => {
    const loadAllFiles = async () => {
      if (!open || !folderPath) {
        return;
      }

      setIsLoading(true);
      try {
        // Get all files from complete tree structure (including background-loaded files)
        const result = await window.electron.getAllFilesForQuickOpen();

        if (result.files) {
          setAllFiles(result.files);
          setIsBackgroundComplete(result.isBackgroundComplete);

          console.log(`📁 Quick Open loaded ${result.files.length} files`);
          if (!result.isBackgroundComplete) {
            console.log(
              '🔄 Background loading still in progress - some files may be missing',
            );
          }
        }
      } catch (error) {
        console.error('Error loading files for quick open:', error);
        setAllFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllFiles();
  }, [open, folderPath]);

  // Listen for background loading completion to refresh file list
  useEffect(() => {
    if (!open) return;

    const handleTreeLoadingComplete = () => {
      console.log(
        '🎉 Background loading completed - refreshing quick open file list',
      );
      // Reload all files when background loading completes
      const loadAllFiles = async () => {
        try {
          const result = await window.electron.getAllFilesForQuickOpen();
          if (result.files) {
            setAllFiles(result.files);
            setIsBackgroundComplete(true);
            console.log(
              `📁 Quick Open refreshed with ${result.files.length} complete files`,
            );
          }
        } catch (error) {
          console.error(
            'Error refreshing files after background loading:',
            error,
          );
        }
      };
      loadAllFiles();
    };

    // Add listener for background loading completion
    const removeListener = window.electron.onTreeLoadingComplete(
      handleTreeLoadingComplete,
    );

    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }, [open]);

  // Filter files based on search query using regex
  const { matchingFilesCount, filteredFiles, totalMatchCount } = useMemo(() => {
    let matchingFiles: FileEntry[];

    if (!searchQuery.trim()) {
      // When no search query, show first files
      matchingFiles = allFiles;
    } else {
      try {
        // Create regex from search query (case-insensitive)
        const regex = new RegExp(searchQuery, 'i');

        matchingFiles = allFiles.filter(file => {
          // Search in both filename and relative path
          return regex.test(file.name) || regex.test(file.relativePath);
        });
      } catch (error) {
        // If regex is invalid, fall back to simple string matching
        const lowerQuery = searchQuery.toLowerCase();
        matchingFiles = allFiles.filter(file => {
          return (
            file.name.toLowerCase().includes(lowerQuery) ||
            file.relativePath.toLowerCase().includes(lowerQuery)
          );
        });
      }
    }

    return {
      matchingFilesCount: matchingFiles.length,
      filteredFiles: matchingFiles.slice(0, 10), // Always show max 10 items
      totalMatchCount: matchingFiles.length, // Real count for display
    };
  }, [allFiles, searchQuery]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file: FileEntry) => {
      try {
        if (onFileSelect) {
          onFileSelect(file);
        } else {
          // Default behavior: open file in tab
          const fileData = await window.electron.readFile(file.path);
          if (fileData) {
            dispatch(openFileInTab(fileData));
          }
        }
        onClose();
      } catch (error) {
        console.error('Error opening file:', error);
      }
    },
    [dispatch, onClose, onFileSelect],
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev =>
            prev < filteredFiles.length - 1 ? prev + 1 : prev,
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredFiles[selectedIndex]) {
            handleFileSelect(filteredFiles[selectedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    },
    [filteredFiles, selectedIndex, handleFileSelect, onClose],
  );

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        const searchInput = document.getElementById('file-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!folderStructure || !folderPath) {
    return null;
  }

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      disableAutoFocus
      disableEnforceFocus>
      <ModalContent>
        <SearchContainer>
          <TextField
            id="file-search-input"
            fullWidth
            placeholder="Type to search files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
          <FileCountIndicator>
            {matchingFilesCount} of {totalMatchCount} files
            {!isBackgroundComplete && (
              <span style={{ color: '#FFA726', marginLeft: '8px' }}>
                (background loading...)
              </span>
            )}
          </FileCountIndicator>
          <FileCountIndicator>
            (Always showing top 10 matches)
          </FileCountIndicator>
        </SearchContainer>

        <ResultsContainer>
          {filteredFiles.length === 0 ? (
            <EmptyState>
              <Typography>
                {searchQuery
                  ? 'No files match your search'
                  : totalMatchCount > 0
                  ? 'Start typing to search files...'
                  : 'No files found in project'}
              </Typography>
            </EmptyState>
          ) : (
            <List disablePadding>
              {filteredFiles.map((file, index) => (
                <FileItemContainer
                  key={file.path}
                  selected={index === selectedIndex}
                  onClick={() => handleFileSelect(file)}>
                  <FileIcon>{getFileIcon(file.name, false)}</FileIcon>
                  <FileInfo>
                    <FileName>{file.name}</FileName>
                    <FilePath>{file.relativePath}</FilePath>
                  </FileInfo>
                </FileItemContainer>
              ))}
            </List>
          )}
        </ResultsContainer>
      </ModalContent>
    </ModalContainer>
  );
};

export default QuickFileOpener;
