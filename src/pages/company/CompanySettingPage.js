import { Container, Grid, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export default function CompanySettingPage() {
  return (
    <>
      <Helmet>
        <title> 회사 설정 </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="left" mb={5}>
          <Typography variant="h4" gutterBottom>
            회사 설정
          </Typography>
        </Stack>
      </Container>
    </>
  );
}
