import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Popper,
  Grow,
  ClickAwayListener,
  InputAdornment,
  CircularProgress,
  Paper,
  styled,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { FileSelectionProps } from './types';
import { getFileIcon } from '../../icons/file-types';
import { Theme } from '@mui/material/styles';

const FileSearchContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  width: '100%',
}));

const FileSearchDropdown = styled(Paper)(({ theme }: { theme: Theme }) => ({
  position: 'absolute',
  bottom: '100%',
  left: 0,
  right: 0,
  marginBottom: theme.spacing(1),
  maxHeight: '250px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[4],
  width: '300px',
}));

const FileSearchResults = styled(Box)(({ theme }: { theme: Theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(0.5),
}));

const FileSearchItem = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  cursor: 'pointer',
  borderRadius: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const FileIcon = styled(Box)(({ theme }: { theme: Theme }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(0.5),
  flexShrink: 0,
  color: theme.palette.fileTree.fileIcon,
}));

const FileInfo = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  overflow: 'hidden',
}));

export const FileSelection = ({
  folderPath,
  documentContext,
  onRemoveContext,
  onFileSelect,
}: FileSelectionProps) => {
  const [showFileSearch, setShowFileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ name: string; path: string; relativePath: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchAnchorRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await window.electron.getAllFilesForQuickOpen();
      if (result.files) {
        const filtered = result.files
          .filter(
            (file: { name: string; path: string; relativePath: string }) =>
              file.name.toLowerCase().includes(query.toLowerCase()) ||
              file.relativePath.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 10);
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Error searching files:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileSelect = async (file: { path: string; name: string }) => {
    await onFileSelect(file);
    setShowFileSearch(false);
    setSearchQuery('');
  };

  const handleClickAway = () => {
    setShowFileSearch(false);
    setSearchQuery('');
  };

  return (
    <Box
      sx={{
        p: 1,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Selected Files:
        </Typography>
        {folderPath ? (
          <FileSearchContainer ref={searchAnchorRef}>
            <Button
              size="small"
              startIcon={<Add sx={{ fontSize: 16 }} />}
              onClick={() => setShowFileSearch(!showFileSearch)}
              variant="text"
              sx={{
                ml: 'auto',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  color: 'text.primary',
                },
                px: 1,
                py: 0.5,
                minWidth: 'auto',
                borderRadius: 1,
              }}>
              Add File
            </Button>
            <Popper
              open={showFileSearch}
              anchorEl={searchAnchorRef.current}
              placement="top"
              transition
              style={{ width: searchAnchorRef.current?.offsetWidth }}>
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <FileSearchDropdown>
                    <ClickAwayListener onClickAway={handleClickAway}>
                      <Box sx={{ p: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Search files..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          autoFocus
                        />
                        <FileSearchResults>
                          {isSearching ? (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                p: 1,
                              }}>
                              <CircularProgress size={16} />
                            </Box>
                          ) : searchResults.length > 0 ? (
                            searchResults.map(file => (
                              <FileSearchItem
                                key={file.path}
                                onClick={() => handleFileSelect(file)}>
                                <FileIcon>
                                  {getFileIcon(file.name, false)}
                                </FileIcon>
                                <FileInfo>
                                  <Typography variant="body2" noWrap>
                                    {file.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    noWrap>
                                    {file.relativePath}
                                  </Typography>
                                </FileInfo>
                              </FileSearchItem>
                            ))
                          ) : searchQuery ? (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ p: 1, textAlign: 'center' }}>
                              No files found
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ p: 1, textAlign: 'center' }}>
                              Start typing to search files...
                            </Typography>
                          )}
                        </FileSearchResults>
                      </Box>
                    </ClickAwayListener>
                  </FileSearchDropdown>
                </Grow>
              )}
            </Popper>
          </FileSearchContainer>
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ ml: 'auto' }}>
            Open a project in order to add files as context
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {documentContext.map(doc => (
          <Chip
            key={doc.path}
            label={doc.name}
            size="small"
            onDelete={() => onRemoveContext(doc.path)}
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};
