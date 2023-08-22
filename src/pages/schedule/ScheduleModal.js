import { useState } from 'react';
// @mui
import { Table, Button, MenuItem, TableBody, Modal, TextField, Snackbar, Alert, TableContainer } from '@mui/material';
// components

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// mock
import USERLIST from '../../_mock/privilege';

const ScheduleModal = ({ open, onClose, editUserId }) => {
  const userData = USERLIST.find((user) => user.id === editUserId);

  const [editedUserData, setEditedUserData] = useState(userData);
  const [startTime, setStartTime] = useState(editedUserData.workStart);
  const [endTime, setEndTime] = useState(editedUserData.workEnd);
  const [workType, setWorkType] = useState(editedUserData.workType);
  const [workState, setWorkState] = useState(editedUserData.workState);

  const [confirmEditOpen, setConfirmEditOpen] = useState(false);

  const [editSnackbar, setEditSnackbar] = useState(false);

  // Snackbar 열기 함수
  const handleOpenSnackbar = () => {
    setEditSnackbar(true);
  };

  // Snackbar 닫기 함수
  const handleCloseSnackbar = () => {
    setEditSnackbar(false);
  };

  const handleConfirmEditOpen = () => {
    setConfirmEditOpen(true);
  };

  const handleConfirmEditClose = () => {
    setConfirmEditOpen(false);
  };

  const handleConfirmEdit = () => {
    handleOpenSnackbar();
    handleConfirmEditClose();
  };

  const handleStartTime = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTime = (event) => {
    setEndTime(event.target.value);
  };

  const handleWorkType = (event) => {
    setWorkType(event.target.value);
  };

  const handleWorkState = (event) => {
    setWorkState(event.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const modalStyle = {
    // 팝업창의 넓이를 원하는 값으로 지정합니다. 필요에 따라 변경할 수 있습니다.
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Modal open={open} onClose={handleClose} style={modalStyle}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        sx={{
          width: '100%', // 원하는 모달 너비 값으로 조절
          '& .MuiDialog-paper': {
            width: '25%', // 모달 내용이 모달 창 내에서 최대 너비를 가지도록 설정
          },
        }}
      >
        <DialogTitle>사용자 정보 수정</DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table
              sx={{minHeight: 400, display: 'block', alignItems: 'start', justifyContent: 'start' }}
            >
              <TableBody>
                <TextField
                  name="date"
                  label="근무일자"
                  fullWidth
                  value={editedUserData.date}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%' }} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="id"
                  label="사원번호"
                  fullWidth
                  value={editedUserData.id}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%' }} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="name"
                  label="이름"
                  fullWidth
                  value={editedUserData.name}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%' }} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="depart"
                  label="부서"
                  fullWidth
                  value={editedUserData.depart}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%' }} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="rank"
                  label="직급"
                  fullWidth
                  value={editedUserData.rank}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%' }} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="workType"
                  label="근로제 유형"
                  select
                  fullWidth
                  value={workType}
                  onChange={handleWorkType}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%' }} // 좌우 여백 설정
                >
                  <MenuItem value="일반근로제">일반근로제</MenuItem>
                  <MenuItem value="시차근로제">시차근로제</MenuItem>
                </TextField>

                <TextField
                  name="start"
                  label="근무시작시간"
                  select
                  fullWidth
                  value={startTime}
                  onChange={handleStartTime}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%'}} // 좌우 여백 설정
                  SelectProps={{
                    MenuProps: {
                      getContentAnchorEl: null,
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center',
                      },
                      PaperProps: {
                        style: {
                          maxHeight: 220, // 원하는 최대 높이로 설정
                        },
                      },
                    },
                  }}
                >
                  {Array.from({ length: 24 * 2 }).map((_, index) => {
                    const hours = Math.floor(index / 2);
                    const minutes = (index % 2) * 30;
                    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    return (
                      <MenuItem key={timeString} value={timeString}>
                        {timeString}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  name="end"
                  label="근무종료시간"
                  select
                  fullWidth
                  value={endTime}
                  onChange={handleEndTime}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%' }} // 좌우 여백 설정
                  SelectProps={{
                    MenuProps: {
                      getContentAnchorEl: null,
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center',
                      },
                      PaperProps: {
                        style: {
                          maxHeight: 220, // 원하는 최대 높이로 설정
                        },
                      },
                    },
                  }}
                >
                  {Array.from({ length: 24 * 2 }).map((_, index) => {
                    const hours = Math.floor(index / 2);
                    const minutes = (index % 2) * 30;
                    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    return (
                      <MenuItem key={timeString} value={timeString}>
                        {timeString}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  name="workHour"
                  label="소정근무시간"
                  fullWidth
                  value={editedUserData.workHour}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%' }} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="workState"
                  label="처리상태"
                  select
                  fullWidth
                  value={workState}
                  onChange={handleWorkState}
                  margin="normal"
                  style={{ marginLeft: '20px', marginRight: '10px', width: '80%' }} // 좌우 여백 설정
                >
                  <MenuItem value="정상처리">정상처리</MenuItem>
                  <MenuItem value="미처리">미처리</MenuItem>
                  <MenuItem value="근태이상">근태이상</MenuItem>
                </TextField>

                {/* 필요한 다른 입력 필드들 추가 */}
                <DialogActions>
                  <Button variant="contained" onClick={handleConfirmEditOpen}>
                    수정
                  </Button>
                  <Button variant="outlined" onClick={handleClose}>
                    취소
                  </Button>
                </DialogActions>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        {/* 수정 확인 다이얼로그 */}
        <Dialog open={confirmEditOpen} onClose={handleConfirmEditClose}>
          <DialogTitle>수정 확인</DialogTitle>
          <DialogContent>선택한 정보를 수정하시겠습니까?</DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmEdit} color="secondary" variant="contained">
              수정
            </Button>
            <Button onClick={handleConfirmEditClose} color="primary" variant="outlined">
              취소
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={editSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{ width: 400 }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            수정되었습니다!
          </Alert>
        </Snackbar>
      </Dialog>
    </Modal>
  );
};

export default ScheduleModal;
