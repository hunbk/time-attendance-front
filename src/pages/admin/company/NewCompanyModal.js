import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import loginAxios from '../../../api/loginAxios';

NewCompanyModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function NewCompanyModal({ open, onClose }) {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');

  const handleClose = () => {
    setName('');
    onClose();
  };

  const handleSubmit = () => {
    const data = {
      name,
    };

    loginAxios
      .post('/api/companies', data)
      .then((response) => {
        if (response.status === 201) {
          alert('생성 완료');
          onClose(); // 성공시 모달 창 닫기
        }
      })
      .catch((error) => {
        if (error.response) {
          setNameError(true);
          setNameHelperText('이미 존재하는 회사 이름입니다.');
        }
      });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>새 회사 추가</DialogTitle>
        <DialogContent>
          <TextField
            error={nameError}
            helperText={nameHelperText}
            margin="dense"
            size="small"
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError(false); // 입력값 변경시 에러 초기화
              setNameHelperText(''); // 에러 메시지 초기화
            }}
            label="회사명"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit}>추가</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
