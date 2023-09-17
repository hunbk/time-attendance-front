import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useAuthState } from '../../context/AuthProvider';
import loginAxios from '../../api/loginAxios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { enqueueSnackbar } from 'notistack';

const dropzoneStyle = {
  border: '1px dashed rgba(145, 158, 171, 0.5)',
  borderRadius: '5px',
  padding: '20px',
  textAlign: 'center',
  marginBottom: '20px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100px',
  overflow: 'hidden',
};

const previewStyle = {
  width: '100%',
  objectFit: 'cover',
};

export default function CompanySettingPage() {
  const [file, setFile] = useState(null); // 회사 로고 파일
  const [preview, setPreview] = useState(null); // 업로드 미리보기
  const [imageAction, setImageAction] = useState('KEEP'); // 회사 로고의 수정 상태 ['DELETE', 'KEEP', 'UPDATE']
  const [authCode, setAuthCode] = useState(''); // 회사 인증코드를 위한 상태 변수
  const [name, setName] = useState(''); // 회사명
  const [nameError, setNameError] = useState(false); // 회사명 유효성 검사
  const [nameHelperText, setNameHelperText] = useState(''); // 회사명 유효성 검사 메시지

  const { user } = useAuthState();

  // 회사 데이터 요청 API
  const fetchCompanyData = useCallback(async () => {
    try {
      const response = await loginAxios.get(`/api/companies/${user.companyId}`);
      if (response.status === 200) {
        setName(response.data.name);
        setAuthCode(response.data.code);
        if (response.data.logoUrl !== null) {
          setPreview(`http://localhost:8080/images/${response.data.logoUrl}`);
        }
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  }, [user.companyId]);

  // 회사 인증코드 재발급 API
  const handleReissueAuthCode = async () => {
    try {
      const response = await loginAxios.patch(`/api/companies/${user.companyId}/code`);
      if (response.status === 200) {
        setAuthCode(response.data.code);
        enqueueSnackbar('코드가 재발급 되었습니다.', { variant: 'success' });
      }
    } catch (error) {
      console.error('Failed to reissue auth code:', error);
    }
  };

  // 폼 유효성 검증
  const validateForm = () => {
    let isValid = true;

    // 회사명 검증
    if (!name) {
      setNameError(true);
      setNameHelperText('회사명은 공백일 수 없습니다.');
      isValid = false;
    }
    if (name.length > 31) {
      setNameError(true);
      setNameHelperText('회사명은 30자를 초과할 수 없습니다.');
      isValid = false;
    }

    // 이미지 검증
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      const validImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];

      if (!validImageTypes.includes(file.type)) {
        enqueueSnackbar('이미지 형식이 잘못되었습니다. (jpg, png, svg 만 가능)', { variant: 'error' });
        isValid = false;
      }

      if (fileSizeInMB > 10) {
        enqueueSnackbar('파일 크기가 너무 큽니다. (10MB 이하만 가능)', { variant: 'error' });
        isValid = false;
      }
    }

    return isValid;
  };

  // 회사 정보 수정 요청 API
  const handleSave = async () => {
    if (!validateForm()) {
      return; // 유효성 검사 실패
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'companyUpdateRequest',
        new Blob([JSON.stringify({ name, imageAction })], { type: 'application/json' })
      ); // 회사 정보 JSON 객체로 추가

      const response = await loginAxios.patch(`/api/companies/${user.companyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        fetchCompanyData();

        enqueueSnackbar('저장되었습니다.', { variant: 'success' });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.errors) {
          Object.entries(data.errors).forEach(([key, value]) => {
            if (key === 'name') {
              setNameError(true);
              setNameHelperText(value);
            }
          });
        } else if (data.message) {
          setNameError(true);
          enqueueSnackbar(data.message, { variant: 'error' });
        }
      }
    }
  };

  // 회사 로고 이미지 삭제 함수
  const handleImageDelete = () => {
    setFile(null);
    setPreview(null);
    setImageAction('DELETE'); // 이미지가 삭제되면 'DELETE'
  };

  // 리액트 dropzone 라이브러리 이미지 업로드 함수
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setImageAction('UPDATE'); // 이미지가 드롭되면 'UPDATE'

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  // 리액트 dropzone 라이브러리
  // const { getRootProps, getInputProps, open } = useDropzone({ accept: 'image/*', onDrop });

  const maxSize = 10485760; // 10MB
  const { getRootProps, getInputProps, open, fileRejections } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png'] },
    maxSize,
    onDrop,
    multiple: false,
  });

  // 회사 데이터 로딩
  useEffect(() => {
    console.log('mount');
    fetchCompanyData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // 파일 검증 실패시 처리
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((error) => {
          switch (error.code) {
            case 'file-invalid-type':
              enqueueSnackbar('이미지 파일만 선택할 수 있습니다.', { variant: 'error' });
              break;
            case 'file-too-large':
              enqueueSnackbar('파일 크기가 너무 큽니다. (10MB 이하만 가능)', { variant: 'error' });
              break;
            default:
              enqueueSnackbar('파일 업로드 중 오류가 발생했습니다.', { variant: 'error' });
              break;
          }
        });
      });
    }
  }, [fileRejections]);

  return (
    <>
      <Helmet>
        <title>회사 설정</title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="left" mb={5}>
          <Typography variant="h4" gutterBottom>
            회사 설정
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardHeader title={'회사 로고'} />
              <Box sx={{ p: 3 }}>
                <div {...getRootProps()} style={dropzoneStyle}>
                  <input {...getInputProps()} />
                  {preview ? (
                    <img src={preview} alt="Preview" style={previewStyle} />
                  ) : (
                    <p>이미지를 드래그하거나 클릭하여 선택하세요.</p>
                  )}
                </div>
                <Button fullWidth variant="outlined" color="primary" sx={{ mb: 1 }} onClick={open}>
                  로고 업로드
                </Button>
                <Button fullWidth variant="outlined" color="inherit" onClick={handleImageDelete}>
                  로고 제거
                </Button>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Card sx={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
              <CardHeader title={'회사 정보'} />
              <Box sx={{ p: 3, flexGrow: 1 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <Tooltip title="인증코드는 재발급만 가능합니다." placement="top" arrow>
                      <TextField
                        label="인증코드"
                        margin="dense"
                        size="small"
                        value={authCode}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <IconButton
                              onClick={() => {
                                navigator.clipboard.writeText(authCode);
                                enqueueSnackbar('클립보드에 복사되었습니다!', { variant: 'success' });
                              }}
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          ),
                        }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4}>
                    <Button variant="outlined" color="primary" onClick={handleReissueAuthCode}>
                      재발급
                    </Button>
                  </Grid>
                </Grid>

                <TextField
                  error={nameError}
                  helperText={nameHelperText}
                  label="회사명"
                  margin="normal"
                  size="small"
                  name="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setNameError(false); // 입력값 변경시 에러 초기화
                    setNameHelperText(''); // 에러 메시지 초기화
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', p: 2 }}>
                <Button variant="contained" onClick={handleSave}>
                  저장
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
