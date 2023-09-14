import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <>
      <Helmet>
        <title> 404 Not Found </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Box component="img" src="/assets/illustrations/500.png" sx={{ height: 200, mx: 'auto', my: 5 }} />

          <Typography variant="h3">죄송합니다.</Typography>
          <Typography variant="subtitle1">현재 서비스 접속이 원활하지 않습니다.</Typography>
          <Typography variant="subtitle1" paragraph>
            페이지를 새로고침 하거나, 잠시 후 다시 시도해주세요.
          </Typography>
          {/* TODO: 다른 페이지 추천 링크 */}

          <Button to="/" size="medium" variant="contained" color="info" component={RouterLink}>
            홈으로
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
