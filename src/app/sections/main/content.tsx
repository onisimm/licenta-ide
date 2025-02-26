import { memo } from 'react';
import { Box, Typography, styled } from '@mui/material';

const ContentContainer = styled(Box)(({ theme }) => ({
  gridArea: 'main',
  backgroundColor: theme.palette.background.main,
  padding: theme.spacing(2),
  overflow: 'hidden',
}));

const ContentText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const ContentSection = memo(() => {
  return (
    <ContentContainer>
      <ContentText variant="h4">Body</ContentText>
    </ContentContainer>
  );
});

export default ContentSection;
