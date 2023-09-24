import React, { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { useAuthDispatch } from '../../context/AuthProvider';

import Iconify from '../../components/iconify/Iconify';
import loginAxios from '../../api/loginAxios';

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(''); // 로그인 TEST용 email(나중에 삭제 해야함)
  const [password, setPassword] = useState(''); // 로그인 TEST용 password(나중에 삭제 해야함)
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState(false); // 이메일 유효성 검사
  const [emailHelperText, setEmailHelperText] = useState(''); // 이메일 유효성 검사 메시지
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 유효성 검사
  const [passwordHelperText, setPasswordHelperText] = useState(''); // 비밀번호 유효성 검사 메시지

  const [loginFail, setLoginFail] = useState(false); // 로그인 실패 유무

  // 로그인 상태 변경을 위한 AuthDispatch 가져오기
  const authDispatch = useAuthDispatch();

  // 폼 유효성 검증
  const validateForm = () => {
    let isValid = true;

    // const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const emailPattern = /^(?!.*(\.\.|\\\\|\s)).+@[\da-zA-Z.-]+\.[\da-zA-Z]+$/;

    // 이메일 검증
    if (!email) {
      setEmailError(true);
      setEmailHelperText('이메일은 공백일 수 없습니다.');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError(true);
      setEmailHelperText('유효한 이메일 형식이 아닙니다.');
      isValid = false;
    }

    // 비밀번호 검증
    if (!password) {
      setPasswordError(true);
      setPasswordHelperText('비밀번호는 공백일 수 없습니다.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setLoginFail(false);
      return; // 유효성 검사 실패
    }

    const data = {
      email,
      password,
    };

    try {
      const response = await loginAxios.post('/api/auth/login', data);
      if (response.status === 200) {
        // localStorage에 토큰 저장
        localStorage.setItem('accessToken', response.data.accessToken);

        // 사용자 정보 가져오기
        const userInfoResponse = await loginAxios.get('/api/users/me');
        const userInfo = userInfoResponse.data;

        // AuthContext의 상태 업데이트
        authDispatch({ type: 'LOGIN', payload: userInfo });

        // 메인화면으로 이동
        navigate('/');
        enqueueSnackbar(`${userInfo.name}님 환영합니다!`, { variant: 'info' });
      }
    } catch (error) {
      if (error.response) {
        // TODO: 유효성 검증, 서버 예외 메시지 출력
        setLoginFail(true);
      } else if (error.request) {
        // 네트워크 통신 실패
        navigate('/500');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        error={emailError}
        helperText={emailHelperText}
        margin="dense"
        size="small"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError(false);
          setEmailHelperText('');
        }}
        label="이메일"
        fullWidth
      />

      <TextField
        error={passwordError}
        helperText={passwordHelperText}
        margin="dense"
        size="small"
        name="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError(false);
          setPasswordHelperText('');
        }}
        type={showPassword ? 'text' : 'password'}
        label="비밀번호"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {loginFail && (
        <Box mt={1}>
          <Typography variant="subtitle2" color="error">
            이메일 또는 비밀번호가 일치하지 않습니다.
            <br />
            입력하신 내용을 다시 확인해주세요.
          </Typography>
        </Box>
      )}

      <Button type="submit" fullWidth variant="contained" color="info" sx={{ mt: 2 }}>
        로그인
      </Button>
    </Box>
  );
}
