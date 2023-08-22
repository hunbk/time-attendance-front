import { useState } from 'react';
// @mui
import {
  Table,
  Button,
  MenuItem,
  TableBody,
  TableContainer,
  Modal,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
// components

// mock
import USERLIST from '../../_mock/privilege';
// ----------------------------------------------------------------------

const PrivilegeModal = ({ open, onClose, editUserId }) => {
  const findUserData = USERLIST.find((user) => user.id === editUserId);
  const [userData, setUserData] = useState(findUserData);

  const [accessLevel, setAccessLevel] = useState(userData.AccessLevel);

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

  const handleAccessLevel = (event) => {
    setAccessLevel(event.target.value);
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

  const textFieldStyle = {
    width: '100%', // 원하는 너비 값으로 조절
  };
  // ... (필요한 함수들과 상태들을 PrivilegeModal 컴포넌트로 옮길 수 있습니다)

  return (
    <Modal open={open} onClose={handleClose} style={modalStyle}>
      {/* Scrollbar 대신 MUI의 Dialog 컴포넌트 사용 */}
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
        <DialogTitle>권한 수정</DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table sx={{ minHeight: 400, display: 'block', alignItems: 'start', justifyContent: 'start' }}>
              {/* 이름, 부서, 직급, 사원번호, 권한 */}
              <TableBody>
                <TextField
                  name="name"
                  label="이름"
                  fullWidth
                  value={userData.name}
                  margin="normal"
                  style={textFieldStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="depart"
                  label="부서"
                  fullWidth
                  value={userData.depart}
                  margin="normal"
                  style={textFieldStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="rank"
                  label="직급"
                  fullWidth
                  value={userData.rank}
                  margin="normal"
                  style={textFieldStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="id"
                  label="사원번호"
                  fullWidth
                  value={userData.id}
                  margin="normal"
                  style={textFieldStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="accessLevel"
                  label="권한 등급"
                  select
                  fullWidth
                  value={accessLevel}
                  onChange={handleAccessLevel}
                  margin="normal"
                  style={textFieldStyle} // 좌우 여백 설정
                 
                >
                  <MenuItem value="인사 관리" >
                    인사 관리
                  </MenuItem>
                  <MenuItem value="재무 관리" >
                    재무 관리
                  </MenuItem>
                  <MenuItem value="사원" >
                    사원
                  </MenuItem>
                </TextField>

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
          <DialogTitle>권한 변경 확인</DialogTitle>
          <DialogContent>
            {accessLevel === '인사 관리' && <DialogContentText>인사 관리로 권한을 변경하시겠습니까?</DialogContentText>}
            {accessLevel === '재무 관리' && <DialogContentText>재무 관리로 권한을 변경하시겠습니까?</DialogContentText>}
            {accessLevel === '사원' && <DialogContentText>사원으로 권한을 변경하시겠습니까?</DialogContentText>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmEdit} variant="contained">
              확인
            </Button>
            <Button onClick={handleConfirmEditClose} variant="outlined">
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
            권한이 수정되었습니다!
          </Alert>
        </Snackbar>
      </Dialog>
    </Modal>
  );
};

export default PrivilegeModal;
