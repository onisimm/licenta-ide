import React from 'react';
import { Box, Collapse } from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Undo as UndoIcon,
} from '@mui/icons-material';
import { GitFileStatus } from './types';
import {
  SectionHeader,
  SectionTitle,
  FileItem,
  FileName,
  StatusChip,
  SuccessIconButton,
  WarningIconButton,
} from './styles';
import { SourceTooltip } from './SourceTooltip';
import { getStatusColor, getStatusIcon } from './utils';

interface FileListProps {
  title: string;
  files: GitFileStatus[];
  expanded: boolean;
  onToggle: () => void;
  onStageFile: (filePath: string, staged: boolean) => void;
  onDiscardFile: (file: GitFileStatus) => void;
  onStageAll?: () => void;
  onUnstageAll?: () => void;
}

export const FileList: React.FC<FileListProps> = ({
  title,
  files,
  expanded,
  onToggle,
  onStageFile,
  onDiscardFile,
  onStageAll,
  onUnstageAll,
}) => {
  return (
    <>
      <SectionHeader onClick={onToggle}>
        <SectionTitle>
          {expanded ? (
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
          ) : (
            <ExpandLessIcon sx={{ fontSize: 16 }} />
          )}
          {title} ({files.length})
        </SectionTitle>
        {onStageAll && (
          <SourceTooltip title="Stage all changes">
            <SuccessIconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                onStageAll();
              }}>
              <AddIcon sx={{ fontSize: 16 }} />
            </SuccessIconButton>
          </SourceTooltip>
        )}
        {onUnstageAll && (
          <SourceTooltip title="Unstage all changes">
            <WarningIconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                onUnstageAll();
              }}>
              <RemoveIcon sx={{ fontSize: 16 }} />
            </WarningIconButton>
          </SourceTooltip>
        )}
      </SectionHeader>
      <Collapse in={expanded}>
        <Box>
          {files.map(file => (
            <FileItem key={file.path}>
              <StatusChip
                label={getStatusIcon(file.status)}
                size="small"
                color={getStatusColor(file.status, file.staged)}
                variant={file.staged ? 'filled' : 'outlined'}
              />
              <FileName>{file.path}</FileName>
              <SourceTooltip
                title={`${file.staged ? 'Unstage' : 'Stage'} "${file.path}"`}>
                <SuccessIconButton
                  size="small"
                  onClick={() => onStageFile(file.path, file.staged)}>
                  {file.staged ? (
                    <RemoveIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <AddIcon sx={{ fontSize: 14 }} />
                  )}
                </SuccessIconButton>
              </SourceTooltip>
              {!file.staged && (
                <SourceTooltip
                  title={
                    file.status === 'untracked'
                      ? `Delete and discard changes to "${file.path}"`
                      : `Discard changes to "${file.path}"`
                  }>
                  <WarningIconButton
                    size="small"
                    onClick={() => onDiscardFile(file)}>
                    <UndoIcon sx={{ fontSize: 14 }} />
                  </WarningIconButton>
                </SourceTooltip>
              )}
            </FileItem>
          ))}
        </Box>
      </Collapse>
    </>
  );
};
