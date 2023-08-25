import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Logo from '../logo/Logo';

const url = `${process.env.PUBLIC_URL}/assets/logo2.svg`;

export default function SignHeader() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="common">
      <Toolbar>
        <Logo imageUrl={url} sx={{ width: 130, height: 40 }} />

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {' '}
        </Typography>
        <Button variant="outlined" color="inherit" sx={{ mr: 1 }} onClick={() => navigate('/login')}>
          로그인
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/signup')}>
          회원가입
        </Button>
      </Toolbar>
    </AppBar>
  );
}
