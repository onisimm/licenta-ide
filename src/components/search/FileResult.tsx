import React from 'react';
import { Box } from '@mui/material';
import { getFileIcon } from '../../icons/file-types';
import {
  FileItemContainer,
  ExpandIcon,
  FileIcon,
  FileName,
  MatchCount,
} from './styles';
import { FileResultProps } from './types';
import { LineResult } from './LineResult';

export const FileResult: React.FC<FileResultProps> = ({
  fileResult,
  isExpanded,
  onToggleExpansion,
  onLineClick,
  searchQuery,
}) => {
  return (
    <Box>
      <FileItemContainer onClick={onToggleExpansion}>
        <ExpandIcon isExpanded={isExpanded} />
        <FileIcon>{getFileIcon(fileResult.fileName, false, false)}</FileIcon>
        <FileName>{fileResult.fileName}</FileName>
        <MatchCount>
          {fileResult.totalMatches} match
          {fileResult.totalMatches !== 1 ? 'es' : ''}
        </MatchCount>
      </FileItemContainer>

      {isExpanded &&
        fileResult.matches.map((match, index) => (
          <LineResult
            key={`${fileResult.filePath}-${match.lineNumber}-${index}`}
            match={match}
            searchQuery={searchQuery}
            onClick={() => onLineClick(match.lineNumber)}
          />
        ))}
    </Box>
  );
};
