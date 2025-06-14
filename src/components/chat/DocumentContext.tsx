import { Box, Typography, Chip } from '@mui/material';
import { DocumentContextProps } from './types';

export const DocumentContext = ({
  documents,
  onRemoveContext,
}: DocumentContextProps) => {
  if (documents.length === 0) return null;

  return (
    <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 0.5, display: 'block' }}>
        Document Context:
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
          marginBottom: 1,
        }}>
        {documents.map(doc => (
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
