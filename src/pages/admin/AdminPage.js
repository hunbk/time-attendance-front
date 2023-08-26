import { Container, Grid, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import PageWidget from './PageWidget';

export default function AdminPage() {
  return (
    <>
      <Helmet>
        <title> 서비스 관리자 설정 </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="left" mb={5}>
          <Typography variant="h4" gutterBottom>
            서비스 관리자 설정
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <PageWidget title="회사 관리" color="info" icon={'clarity:building-solid'} to="/admin/company" />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3}>
            <PageWidget title="New Users" color="info" icon={'ant-design:apple-filled'} />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
