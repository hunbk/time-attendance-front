import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';

export default function SignupForm() {
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    passwordCheck: '',
    name: '',
    phone: '',
    birthday: null,
    companyCode: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setNewUser({ ...newUser, [event.target.name]: event.target.value });
  };

  const handleDateChange = (date) => {
    setNewUser({ ...newUser, birthday: dayjs(date).format('YYYY-MM-DD') });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // TODO: 입력값 유효성 검증
    // TODO: 비밀번호 확인 검증

    // ====== 회원가입 요청 ======
    const response = await axios
      .post('http://localhost:8080/api/users/signup', newUser)
      .then((response) => {
        if (response.status === 201) {
          enqueueSnackbar('회원가입 완료!', { variant: 'success', autoHideDuration: 1000 });
          // 회원가입 성공 시, 잠시 대기한 후 페이지 이동.
          // 스낵바를 외부로 빼서 로그인 창에서 호출한다면 대기할 필요 없음.
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        }
      })
      .catch((error) => {
        if (error.response) {
          // TODO: 예외 처리 방법이 이상함. 개선할 것.
          if (Object.keys(error.response.data.errors).length !== 0) {
            enqueueSnackbar(error.response.data.errors[Object.keys(error.response.data.errors)[0]], {
              variant: 'error',
            });
          } else if (error.response.data.message === '이미 가입된 이메일입니다.') {
            enqueueSnackbar(error.response.data.message, { variant: 'error' });
          } else if (error.response.data.message === '유효하지 않은 회사 인증 코드입니다.') {
            enqueueSnackbar(error.response.data.message, { variant: 'error' });
          }
          console.log(error.response.data);
        }
      });
    console.log(response.data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      <TextField
        margin="dense"
        size="small"
        name="email"
        value={newUser.email}
        onChange={handleInputChange}
        label="이메일"
        fullWidth
      />

      <TextField
        margin="dense"
        size="small"
        name="password"
        value={newUser.password}
        onChange={handleInputChange}
        type="password"
        label="비밀번호"
        fullWidth
      />

      <TextField
        margin="dense"
        size="small"
        name="passwordCheck"
        value={newUser.passwordCheck}
        onChange={handleInputChange}
        type="password"
        label="비밀번호 확인"
        fullWidth
      />

      <TextField
        margin="dense"
        size="small"
        name="name"
        value={newUser.name}
        onChange={handleInputChange}
        label="사용자 이름"
        fullWidth
      />

      <TextField
        margin="dense"
        size="small"
        name="phone"
        value={newUser.phone}
        onChange={handleInputChange}
        label="휴대전화번호"
        fullWidth
      />

      <DatePicker
        label="생일"
        value={newUser.birthday}
        onChange={handleDateChange}
        openTo="year"
        views={['year', 'month', 'day']}
        format="YYYY.MM.DD"
        slotProps={{
          textField: {
            margin: 'dense',
            size: 'small',
            fullWidth: true,
          },
        }}
      />

      <TextField
        margin="dense"
        size="small"
        name="companyCode"
        value={newUser.companyCode}
        onChange={handleInputChange}
        label="회사 인증 코드"
        fullWidth
      />

      <Button type="submit" fullWidth variant="outlined" sx={{ mt: 3, mb: 2 }}>
        가입하기
      </Button>
    </Box>
  );
}
