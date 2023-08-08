import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import SignupForm from './SignupForm';
import SignHeader from '../../components/sign/SignHeader';

export default function SignupPage() {
  return (
    <>
      <Helmet>
        <title> 회원가입 </title>
      </Helmet>

      <SignHeader />

      <Box display="flex" justifyContent="center" alignItems="center" p={8}>
        <Container maxWidth="xs">
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h3" align="center">
                회원가입
              </Typography>
              <Typography variant="body1" align="center">
                효율적인 근무를 위한 첫 걸음,
              </Typography>
              <Typography variant="body1" align="center">
                이제 근무시간을 체계적으로 관리해보세요.
              </Typography>
              <SignupForm />
            </Box>
          </Card>
        </Container>
      </Box>

      {/* 스낵바 UI */}
      <SnackbarProvider
        maxSnack={1}
        autoHideDuration={2000}
        // 생성위치를 하단, 오른쪽으로 설정
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
