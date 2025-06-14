import React from 'react';
import { Commit as CommitIcon } from '@mui/icons-material';
import { DefaultButton } from '../../components/buttons';
import { CommitSection as StyledCommitSection, CommitInput } from './styles';

interface CommitSectionProps {
  commitMessage: string;
  onCommitMessageChange: (message: string) => void;
  onCommit: () => void;
}

export const CommitSection: React.FC<CommitSectionProps> = ({
  commitMessage,
  onCommitMessageChange,
  onCommit,
}) => {
  return (
    <StyledCommitSection>
      <CommitInput
        fullWidth
        placeholder="Commit message"
        value={commitMessage}
        onChange={e => onCommitMessageChange(e.target.value)}
        size="small"
        multiline
        rows={2}
      />
      <DefaultButton
        onClick={onCommit}
        disabled={!commitMessage.trim()}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          padding: 0.5,
        }}>
        <CommitIcon />
        Commit
      </DefaultButton>
    </StyledCommitSection>
  );
};
