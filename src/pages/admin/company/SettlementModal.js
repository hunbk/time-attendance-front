import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import PropTypes from 'prop-types';
import loginAxios from '../../../api/loginAxios';
import { enqueueSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';

SettlementModal.propTypes = {
  companyId: PropTypes.number,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function SettlementModal({ companyId, open, onClose }) {
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

  const handleClose = () => {
    onClose();
    setDate(dayjs(new Date()).format('YYYY-MM-DD'));
  };

  const handleSubmit = async () => {
    try {
      const response = await loginAxios.post('/api/settlements', { date, companyId });
      if (response.status === 200) {
        enqueueSnackbar('정산을 요청하였습니다.', { variant: 'success' });
        handleClose();
      }
    } catch (error) {
      enqueueSnackbar('정산요청에 실패하였습니다.', { variant: 'error' });
    }
    handleClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { minWidth: '200px', minHeight: '150px' } }}
      >
        <DialogTitle>정산 요청</DialogTitle>
        <DialogContent>
          <DatePicker
            label="정산 날짜"
            value={dayjs(date)}
            maxDate={dayjs(new Date())}
            onChange={(date) => setDate(dayjs(date).format('YYYY-MM-DD'))}
            format="YYYY.MM.DD"
            slotProps={{
              textField: {
                margin: 'dense',
                size: 'small',
                fullWidth: true,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button variant="contained" onClick={handleSubmit}>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
