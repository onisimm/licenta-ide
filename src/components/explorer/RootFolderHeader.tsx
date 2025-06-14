import React from 'react';
import { Tooltip } from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as NewFileIcon,
  AddBoxOutlined as NewFolderIcon,
  ArrowUpwardRounded as CollapseIcon,
} from '@mui/icons-material';
import {
  RootFolderContainer,
  RootExpandIcon,
  RootFolderIcon,
  RootFolderName,
  ActionButtonsContainer,
  ActionButton,
} from './styles';
import { getFileIcon } from '../../icons/file-types';

interface RootFolderHeaderProps {
  folderName: string;
  isExpanded: boolean;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  onToggleExpand: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onRefresh: () => void;
  onCollapseAll: () => void;
}

export const RootFolderHeader: React.FC<RootFolderHeaderProps> = ({
  folderName,
  isExpanded,
  isHovered,
  setIsHovered,
  onToggleExpand,
  onNewFile,
  onNewFolder,
  onRefresh,
  onCollapseAll,
}) => (
  <RootFolderContainer
    className="root-folder-container"
    isHovered={isHovered}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>
    <RootExpandIcon
      isExpanded={isExpanded}
      onClick={e => {
        e.stopPropagation();
        onToggleExpand();
      }}
    />
    <RootFolderIcon>{getFileIcon(folderName, true, isExpanded)}</RootFolderIcon>
    <RootFolderName title={folderName} onClick={onToggleExpand}>
      {folderName}
    </RootFolderName>
    <ActionButtonsContainer>
      <Tooltip title="New File" placement="top">
        <ActionButton onClick={onNewFile}>
          <NewFileIcon />
        </ActionButton>
      </Tooltip>
      <Tooltip title="New Folder" placement="top">
        <ActionButton onClick={onNewFolder}>
          <NewFolderIcon />
        </ActionButton>
      </Tooltip>
      <Tooltip title="Refresh" placement="top">
        <ActionButton onClick={onRefresh}>
          <RefreshIcon />
        </ActionButton>
      </Tooltip>
      <Tooltip title="Collapse All" placement="top">
        <ActionButton onClick={onCollapseAll}>
          <CollapseIcon />
        </ActionButton>
      </Tooltip>
    </ActionButtonsContainer>
  </RootFolderContainer>
);
