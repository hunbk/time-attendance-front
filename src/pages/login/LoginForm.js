import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(email);
    console.log(password);

    // ====== 로그인 요청 ======
    // const response = await axios
    //   .post('http://localhost:8080/api/users/login')
    //   .then((response) => {
    //     if (response.status === 200) {
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       // TODO: 유효성 검증, 서버 예외 메시지 출력
    //       console.log(error.response.data);
    //     }
    //   });
    // console.log(response.data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="dense"
        size="small"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="이메일"
        fullWidth
      />
      <TextField
        margin="dense"
        size="small"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        label="비밀번호"
        fullWidth
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
        로그인
      </Button>
      <Button type="button" fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => navigate('/signup')}>
        회원가입
      </Button>
    </Box>
  );
}
