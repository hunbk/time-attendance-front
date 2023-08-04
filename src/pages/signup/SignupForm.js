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

    console.log(newUser);

    // ====== 회원가입 요청 ======
    // const response = await axios
    //   .post('http://localhost:8080/api/users/signup', newUser)
    //   .then((response) => {
    //     if (response.status === 201) {
    //       enqueueSnackbar('회원가입 완료!', { variant: 'success' });
    //       setTimeout(() => {
    //         navigate('/login');
    //       }, 100); // 잠시 대기한 후 페이지 이동
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       // TODO: 유효성 검증, 서버 예외 메시지 출력
    //       console.log(error.response.data);
    //       enqueueSnackbar('회원가입 실패!', { variant: 'error' });
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
