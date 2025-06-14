import React from 'react';
import { Box } from '@mui/material';
import { LineItemContainer, LineNumber, LineContent } from './styles';
import { LineResultProps } from './types';

export const LineResult: React.FC<LineResultProps> = ({
  match,
  searchQuery,
  onClick,
}) => {
  const renderHighlightedContent = (lineContent: string, query: string) => {
    if (!query.trim()) return <span>{lineContent}</span>;

    try {
      const regex = new RegExp(
        query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'gi',
      );
      const parts = lineContent.split(regex);
      const matches = lineContent.match(regex) || [];

      return (
        <span>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < matches.length && (
                <Box
                  component="span"
                  sx={{
                    backgroundColor: 'warning.main',
                    color: 'warning.contrastText',
                    padding: '1px 2px',
                    borderRadius: '2px',
                    fontWeight: 'bold',
                  }}>
                  {matches[index]}
                </Box>
              )}
            </React.Fragment>
          ))}
        </span>
      );
    } catch {
      return <span>{lineContent}</span>;
    }
  };

  return (
    <LineItemContainer onClick={onClick}>
      <LineNumber>{match.lineNumber}</LineNumber>
      <LineContent>
        {renderHighlightedContent(match.lineContent.trim(), searchQuery)}
      </LineContent>
    </LineItemContainer>
  );
};
