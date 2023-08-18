import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import SignHeader from '../../components/sign/SignHeader';
import SignFooter from '../../components/sign/SignFooter';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> 로그인 </title>
      </Helmet>

      <Box minHeight="100vh" display="flex" flexDirection="column">
        <SignHeader />

        <Box
          component="main"
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent="center" // 중앙 정렬을 위한 속성
          p={8}
        >
          <Container maxWidth="xs">
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography component="h1" variant="h3" align="center">
                  로그인
                </Typography>
                <LoginForm />
              </Box>
            </Card>
          </Container>
        </Box>
        <SignFooter />
      </Box>

      {/* 스낵바 UI */}
      <SnackbarProvider
        maxSnack={1}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
