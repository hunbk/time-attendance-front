import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, Box } from '@mui/material';
import SignupForm from './SignupForm';
import SignHeader from '../../components/sign/SignHeader';
import SignFooter from '../../components/sign/SignFooter';

export default function SignupPage() {
  return (
    <>
      <Helmet>
        <title> 회원가입 </title>
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

        <SignFooter />
      </Box>
    </>
  );
}
