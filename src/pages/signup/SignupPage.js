import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, Box, Grid, Link } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import SignupForm from './SignupForm';

export default function SignupPage() {
  return (
    <>
      <Helmet>
        <title> 회원가입 </title>
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
                회원가입
              </Typography>
              <SignupForm />
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    로그인으로 이동
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* 스낵바 UI */}
      <SnackbarProvider
        maxSnack={1}
        autoHideDuration={3000}
        // 생성위치를 하단, 오른쪽으로 설정
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
}
