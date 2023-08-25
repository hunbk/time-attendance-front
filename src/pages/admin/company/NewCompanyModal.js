import React, { useState, useCallback } from 'react';
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
  border: '2px dashed #888888',
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

  const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop });

  const handleClose = () => {
    setName(''); // 회사명 상태 초기화
    setImage(null); // 이미지 상태 초기화
    setPreview(null); // 미리보기 상태 초기화
    onClose();
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', image); // 이미지 파일 추가
    formData.append('companyCreateRequest', new Blob([JSON.stringify({ name })], { type: 'application/json' })); // 회사 정보 JSON 객체로 추가

    await loginAxios
      .post('/api/companies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 201) {
          enqueueSnackbar('등록되었습니다!', { variant: 'success' });
          getCompanyList(); // 회사 목록 업데이트
          handleClose(); // 성공시 모달 창 닫기
        }
      })
      .catch((error) => {
        if (error.response) {
          setNameError(true);
          setNameHelperText('이미 존재하는 회사 이름입니다.');
        }
      });
    setName(''); // 이름 필드 초기화
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>새 회사 등록</DialogTitle>
        <DialogContent>
          <InputLabel htmlFor="company-logo" style={{ color: '#161C24' }}>
            회사로고
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
            // label="회사명"
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
