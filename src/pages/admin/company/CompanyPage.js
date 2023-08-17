import { useState } from 'react';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Iconify from '../../../components/iconify/Iconify';
import NewCompanyModal from './NewCompanyModal';
import CompanyList from './CompanyList';
import { SnackbarProvider } from 'notistack';

export default function CompanyPage() {
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);

  const handleShowNewCompanyModal = () => {
    setShowNewCompanyModal(true);
  };

  return (
    <>
      <Helmet>
        <title> 관리자 설정 - 회사 관리 </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            회사 관리
          </Typography>
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleShowNewCompanyModal}>
            회사 등록
          </Button>
        </Stack>

        <Card>
          {/* 회사 목록 컴포넌트 */}
          <CompanyList />
        </Card>
      </Container>

      <NewCompanyModal open={showNewCompanyModal} onClose={() => setShowNewCompanyModal(false)} />

      {/* 스낵바 UI */}
      <SnackbarProvider maxSnack={1} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} />
    </>
  );
}
