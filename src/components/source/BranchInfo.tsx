import React, { useState } from 'react';
import {
  Typography,
  Chip,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ButtonBase,
} from '@mui/material';
import {
  Commit as CommitIcon,
  Refresh as RefreshIcon,
  KeyboardArrowDown as ArrowDownIcon,
  SwapHoriz as SwitchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GitBranchInfo } from './types';
import { BranchInfo as StyledBranchInfo, SuccessIconButton } from './styles';
import { SourceTooltip } from './SourceTooltip';

interface BranchInfoProps {
  branchInfo: GitBranchInfo;
  onRefresh: () => void;
  onSwitchBranch: () => void;
  onCreateBranch: () => void;
  onDeleteBranch: () => void;
}

export const BranchInfo: React.FC<BranchInfoProps> = ({
  branchInfo,
  onRefresh,
  onSwitchBranch,
  onCreateBranch,
  onDeleteBranch,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchBranch = () => {
    handleMenuClose();
    onSwitchBranch();
  };

  const handleCreateBranch = () => {
    handleMenuClose();
    onCreateBranch();
  };

  const handleDeleteBranch = () => {
    handleMenuClose();
    onDeleteBranch();
  };

  return (
    <StyledBranchInfo>
      <CommitIcon sx={{ fontSize: 16 }} />
      <SourceTooltip title="Branch operations">
        <ButtonBase
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '2px 4px',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
          onClick={handleMenuClick}>
          <Typography variant="body2" fontWeight="medium">
            {branchInfo.current}
          </Typography>
          <ArrowDownIcon sx={{ fontSize: 14, ml: 0.5 }} />
        </ButtonBase>
      </SourceTooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
        <MenuItem onClick={handleSwitchBranch}>
          <ListItemIcon>
            <SwitchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Switch Branch</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCreateBranch}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Branch</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteBranch}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Branch</ListItemText>
        </MenuItem>
      </Menu>

      {branchInfo.ahead > 0 && (
        <Chip
          label={`↑${branchInfo.ahead}`}
          size="small"
          color="success"
          variant="outlined"
        />
      )}
      {branchInfo.behind > 0 && (
        <Chip
          label={`↓${branchInfo.behind}`}
          size="small"
          color="warning"
          variant="outlined"
        />
      )}
      <Box sx={{ flex: 1 }} />
      <SourceTooltip title="Refresh">
        <SuccessIconButton size="small" onClick={onRefresh}>
          <RefreshIcon sx={{ fontSize: 16 }} />
        </SuccessIconButton>
      </SourceTooltip>
    </StyledBranchInfo>
  );
};
