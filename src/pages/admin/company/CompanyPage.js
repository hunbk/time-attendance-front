import { useEffect, useState } from 'react';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Iconify from '../../../components/iconify/Iconify';
import NewCompanyModal from './NewCompanyModal';
import CompanyList from './CompanyList';
import { SnackbarProvider } from 'notistack';
import loginAxios from '../../../api/loginAxios';

export default function CompanyPage() {
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);

  // 회사 목록
  const [companies, setCompanies] = useState([]);

  // 회사 목록 조회 API
  const getCompanyList = async () => {
    const res = await loginAxios.get('/api/companies');
    setCompanies(res.data);
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  // 회사 등록 모달
  const handleShowNewCompanyModal = () => {
    setShowNewCompanyModal(true);
  };

  return (
    <>
      <Helmet>
        <title> 관리자 설정 - 회사 관리 </title>
      </Helmet>

      <Container maxWidth="xl">
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
          <CompanyList companies={companies} />
        </Card>
      </Container>

      <NewCompanyModal
        open={showNewCompanyModal}
        onClose={() => setShowNewCompanyModal(false)}
        getCompanyList={getCompanyList}
      />

      {/* 스낵바 UI */}
      <SnackbarProvider maxSnack={1} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} />
    </>
  );
}
