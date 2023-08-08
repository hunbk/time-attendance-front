import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function SignHeader() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="common">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TIMEGO
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
