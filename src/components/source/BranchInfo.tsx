import React from 'react';
import { Typography, Chip, Box } from '@mui/material';
import {
  Commit as CommitIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { GitBranchInfo } from './types';
import { BranchInfo as StyledBranchInfo, SuccessIconButton } from './styles';
import { SourceTooltip } from './SourceTooltip';

interface BranchInfoProps {
  branchInfo: GitBranchInfo;
  onRefresh: () => void;
}

export const BranchInfo: React.FC<BranchInfoProps> = ({
  branchInfo,
  onRefresh,
}) => {
  return (
    <StyledBranchInfo>
      <CommitIcon sx={{ fontSize: 16 }} />
      <Typography variant="body2" fontWeight="medium">
        {branchInfo.current}
      </Typography>
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
