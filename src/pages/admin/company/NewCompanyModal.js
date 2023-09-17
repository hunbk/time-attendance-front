import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import loginAxios from '../../../api/loginAxios';
import { enqueueSnackbar } from 'notistack';

NewCompanyModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  getCompanyList: PropTypes.func,
};

// 이미지 업로드 영역 스타일
const dropzoneStyle = {
  border: '1px dashed rgba(145, 158, 171, 0.5)',
  borderRadius: '5px',
  padding: '20px',
  textAlign: 'center',
  marginBottom: '20px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center', // 내용 중앙 정렬
  justifyContent: 'center', // 내용 중앙 정렬
  width: '330px', // 고정 가로 크기
  height: '100px', // 고정 세로 크기
  overflow: 'hidden', // 크기를 벗어나는 부분은 숨김
};

const previewStyle = {
  width: '100%', // 영역의 전체 너비에 맞게 조정
  // height: '100%', // 영역의 전체 높이에 맞게 조정
  objectFit: 'cover', // 이미지 비율을 유지하면서 영역에 꽉 차게 표시
};

export default function NewCompanyModal({ open, onClose, getCompanyList }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // 이미지 미리보기

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false); // 회사명 유효성 검사
  const [nameHelperText, setNameHelperText] = useState(''); // 회사명 유효성 검사 메시지

  // 이미지 드롭 핸들러
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);

    // 미리보기 설정
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const maxSize = 10485760; // 10MB
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png'] },
    maxSize,
    onDrop,
    multiple: false,
  });

  const handleClose = () => {
    setImage(null); // 이미지 상태 초기화
    setPreview(null); // 미리보기 상태 초기화
    setName(''); // 회사명 상태 초기화
    setNameError(false);
    setNameHelperText('');
    onClose();
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
    if (image) {
      const fileSizeInMB = image.size / (1024 * 1024);
      const validImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];

      if (!validImageTypes.includes(image.type)) {
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // 유효성 검사 실패
    }

    try {
      const formData = new FormData();
      formData.append('file', image); // 이미지 파일 추가
      formData.append('companyCreateRequest', new Blob([JSON.stringify({ name })], { type: 'application/json' })); // 회사 정보 JSON 객체로 추가

      const response = await loginAxios.post('/api/companies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        enqueueSnackbar('등록되었습니다!', { variant: 'success' });
        getCompanyList();
        handleClose();
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>새 회사 등록</DialogTitle>
        <DialogContent>
          <InputLabel htmlFor="company-logo" style={{ color: '#161C24' }}>
            회사 로고
          </InputLabel>
          <div {...getRootProps()} style={dropzoneStyle} id="company-logo">
            <input {...getInputProps()} />
            {preview ? (
              <img src={preview} alt="미리보기" style={previewStyle} /> // 미리보기 이미지
            ) : (
              <p>이미지를 드래그하거나 클릭하여 선택하세요.</p> // 메시지
            )}
          </div>
          <InputLabel htmlFor="company-name" style={{ color: '#161C24' }}>
            회사명
          </InputLabel>
          <TextField
            error={nameError}
            helperText={nameHelperText}
            margin="none"
            size="small"
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError(false); // 입력값 변경시 에러 초기화
              setNameHelperText(''); // 에러 메시지 초기화
            }}
            fullWidth
            id="company-name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit}>등록</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
