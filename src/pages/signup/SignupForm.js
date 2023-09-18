import React, { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import dayjs from 'dayjs';

import Iconify from '../../components/iconify/Iconify';
import loginAxios from '../../api/loginAxios';

export default function SignupForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState(null);
  const [companyCode, setCompanyCode] = useState('');

  const [emailError, setEmailError] = useState(false); // 이메일 유효성 검사
  const [emailHelperText, setEmailHelperText] = useState(''); // 이메일 유효성 검사 메시지
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 유효성 검사
  const [passwordHelperText, setPasswordHelperText] = useState(''); // 비밀번호 유효성 검사 메시지
  const [passwordCheckError, setPasswordCheckError] = useState(false); // 비밀번호 확인 유효성 검사
  const [passwordCheckHelperText, setPasswordCheckHelperText] = useState(''); // 비밀번호 확인 유효성 검사 메시지
  const [nameError, setNameError] = useState(false); // 이름 유효성 검사
  const [nameHelperText, setNameHelperText] = useState(''); // 이름 유효성 검사 메시지
  const [phoneError, setPhoneError] = useState(false); // 휴대전화번호 유효성 검사
  const [phoneHelperText, setPhoneHelperText] = useState(''); // 휴대전화번호 유효성 검사 메시지
  const [birthdayError, setBirthdayError] = useState(false); // 생일 유효성 검사
  const [birthdayHelperText, setBirthdayHelperText] = useState(''); // 생일 유효성 검사 메시지
  const [companyCodeError, setCompanyCodeError] = useState(false); // 회사 인증코드 유효성 검사
  const [companyCodeHelperText, setCompanyCodeHelperText] = useState(''); // 회사 인증코드 유효성 검사 메시지

  // 비밀번호 검증 함수
  const handlePasswordUpdate = (inputPassword) => {
    setPassword(inputPassword);

    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
    if (inputPassword === '') {
      setPasswordError(true);
      setPasswordHelperText('비밀번호는 공백일 수 없습니다.');
    } else if (!passwordPattern.test(inputPassword)) {
      setPasswordError(true);
      setPasswordHelperText('비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.');
    } else {
      setPasswordError(false);
      setPasswordHelperText('');
    }
  };

  // 비밀번호 확인 검증 함수
  const handlePasswordCheckUpdate = (input) => {
    setPasswordCheck(input);

    if (input === '') {
      setPasswordCheckError(true);
      setPasswordCheckHelperText('비밀번호 확인은 공백일 수 없습니다.');
    } else if (input !== password) {
      setPasswordCheckError(true);
      setPasswordCheckHelperText('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordCheckError(false);
      setPasswordCheckHelperText('');
    }
  };

  // 폼 유효성 검증
  const validateForm = () => {
    let isValid = true;

    // 이메일 검증
    const emailPattern = /^(?!.*(\.\.|\\\\|\s)).+@[\da-zA-Z.-]+\.[\da-zA-Z]+$/;
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
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
    if (!password) {
      setPasswordError(true);
      setPasswordHelperText('비밀번호는 공백일 수 없습니다.');
      isValid = false;
    } else if (!passwordPattern.test(password)) {
      setPasswordError(true);
      setPasswordHelperText('비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.');
    }

    // 비밀번호 확인 검증
    if (!passwordCheck) {
      setPasswordCheckError(true);
      setPasswordCheckHelperText('비밀번호 확인은 공백일 수 없습니다.');
      isValid = false;
    } else if (passwordCheck !== password) {
      setPasswordCheckError(true);
      setPasswordCheckHelperText('비밀번호가 일치하지 않습니다.');
      isValid = false;
    }

    // 사용자 이름 검증
    if (!name) {
      setNameError(true);
      setNameHelperText('이름은 공백일 수 없습니다.');
      isValid = false;
    }

    // 휴대전화번호 검증
    const phonePattern = /^[0-9]{10,11}$/;
    if (!phone) {
      setPhoneError(true);
      setPhoneHelperText('휴대전화번호는 공백일 수 없습니다.');
      isValid = false;
    } else if (!phonePattern.test(phone)) {
      setPhoneError(true);
      setPhoneHelperText('유효한 휴대전화번호 형식이 아닙니다.');
      isValid = false;
    }

    // 생일 검증
    if (!birthday) {
      setBirthdayError(true);
      setBirthdayHelperText('생일은 공백일 수 없습니다.');
      isValid = false;
    }

    // 회사 인증코드 검증
    if (!companyCode) {
      setCompanyCodeError(true);
      setCompanyCodeHelperText('회사 인증코드는 공백일 수 없습니다.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return; // 유효성 검사 실패
    }

    const data = {
      email,
      password,
      name,
      phone,
      birthday,
      companyCode,
    };

    try {
      const response = await loginAxios.post('/api/users/signup', data);
      if (response.status === 201) {
        enqueueSnackbar('회원가입이 완료되었습니다.', { variant: 'success' });
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.errors) {
          Object.entries(data.errors).forEach(([key, value]) => {
            switch (key) {
              case 'email':
                setEmailError(true);
                setEmailHelperText(value);
                break;
              case 'password':
                setPasswordError(true);
                setPasswordHelperText(value);
                break;
              case 'name':
                setNameError(true);
                setNameHelperText(value);
                break;
              case 'phone':
                setPhoneError(true);
                setPhoneHelperText(value);
                break;
              case 'birthday':
                setBirthdayError(true);
                setBirthdayHelperText(value);
                break;
              case 'companyCode':
                setCompanyCodeError(true);
                setCompanyCodeHelperText(value);
                break;
              default:
                break;
            }
          });
        } else if (data.message) {
          enqueueSnackbar(data.message, { variant: 'error' });
        }
      } else if (error.request) {
        // 네트워크 통신 실패
        navigate('/500');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
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
          handlePasswordUpdate(e.target.value); // 여기에서 검증 함수를 호출
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

      <TextField
        error={passwordCheckError}
        helperText={passwordCheckHelperText}
        margin="dense"
        size="small"
        name="passwordCheck"
        value={passwordCheck}
        onChange={(e) => {
          handlePasswordCheckUpdate(e.target.value);
        }}
        type={showPasswordCheck ? 'text' : 'password'}
        label="비밀번호 확인"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPasswordCheck(!showPasswordCheck)} edge="end">
                <Iconify icon={showPasswordCheck ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        error={nameError}
        helperText={nameHelperText}
        margin="dense"
        size="small"
        name="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setNameError(false);
          setNameHelperText('');
        }}
        label="이름"
        fullWidth
      />

      <TextField
        error={phoneError}
        helperText={phoneHelperText}
        margin="dense"
        size="small"
        name="phone"
        value={phone}
        type="tel"
        onChange={(e) => {
          setPhone(e.target.value);
          setPhoneError(false);
          setPhoneHelperText(false);
        }}
        label="휴대전화번호"
        fullWidth
      />

      <DatePicker
        label="생일"
        value={birthday}
        onChange={(date) => {
          setBirthday(dayjs(date).format('YYYY-MM-DD'));
          setBirthdayError(false);
          setBirthdayHelperText('');
        }}
        openTo="year"
        views={['year', 'month', 'day']}
        format="YYYY.MM.DD"
        slotProps={{
          textField: {
            error: birthdayError,
            helperText: birthdayHelperText,
            margin: 'dense',
            size: 'small',
            fullWidth: true,
          },
        }}
      />

      <TextField
        error={companyCodeError}
        helperText={companyCodeHelperText}
        margin="dense"
        size="small"
        name="companyCode"
        value={companyCode}
        onChange={(e) => {
          setCompanyCode(e.target.value);
          setCompanyCodeError(false);
          setCompanyCodeHelperText('');
        }}
        label="회사 인증 코드"
        fullWidth
      />

      <Button type="submit" fullWidth variant="contained" color="info" sx={{ mt: 2 }}>
        가입하기
      </Button>
    </Box>
  );
}
