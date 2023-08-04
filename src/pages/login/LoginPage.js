import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, Box } from '@mui/material';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> 로그인 </title>
      </Helmet>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh" // 화면 정가운데 배치
      >
        <Container maxWidth="xs">
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography component="h1" variant="h3  " align="center">
                로그인
              </Typography>
              <LoginForm />
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
}
