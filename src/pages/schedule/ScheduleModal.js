import { useState, useEffect } from 'react';
// @mui
import {
  Table,
  Button,
  MenuItem,
  TableBody,
  Modal,
  TextField,
  Snackbar,
  Alert,
  TableContainer,
  Stack,
} from '@mui/material';
// components

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Label from '../../components/label';

// mock
import USERLIST from '../../_mock/privilege';

// LoginAxios
import loginAxios from '../../api/loginAxios';

// 유저 상태
import { useAuthState } from '../../context/AuthProvider';

const ScheduleModal = ({ open, onClose, userData, editSnackbar, onEditSnackbarChange, getUserList }) => {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDateTimeToTime = (localDateTime) => {
    const dateTime = new Date(localDateTime);
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  // 로그인 한 유저 정보
  const { user } = useAuthState();

  const [startTime, setStartTime] = useState(formatTime(userData.startTime));
  const [endTime, setEndTime] = useState(formatTime(userData.endTime));
  const [workingTime, setWorkingTime] = useState(formatTime(userData.workingTime));
  const [overTime, setOverTime] = useState(formatTime(userData.overTime));
  const [workState, setWorkState] = useState(userData.workState);

  const [confirmEditOpen, setConfirmEditOpen] = useState(false);

  const [warningModalOpen, setWarningModalOpen] = useState(false);

  // Snackbar 열기 함수
  const handleOpenSnackbar = () => {
    onEditSnackbarChange(true);
  };

  const handleConfirmEditOpen = () => {
    setConfirmEditOpen(true);
  };

  const handleConfirmEditClose = () => {
    setConfirmEditOpen(false);
  };

  const handleConfirmEdit = async () => {
    const startTimeDate = startTime;
    const endTimeDate = endTime;
    const workingTimeDate = workingTime;
    const overTimeDate = overTime;
    const settlementId = userData.settlementId;

    const editedData = {
      startTime: startTimeDate, // Date 객체를 보내기
      endTime: endTimeDate, // Date 객체를 보내기
      workingTime: workingTimeDate, // Date 객체를 보내기
      overTime: overTimeDate, // Date 객체를 보내기
      workState, // workState을 String 형태 그대로 보내기
      settlementId,
    };
    await loginAxios.patch('/api/settlements', editedData);
    handleOpenSnackbar();
    handleConfirmEditClose();
    getUserList();
    onClose();
  };

  const handleStartTime = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTime = (event) => {
    setEndTime(event.target.value);
  };

  const handleWorkingTime = (event) => {
    setWorkingTime(event.target.value);
  };

  const handleOverTime = (event) => {
    setOverTime(event.target.value);
  };

  const handleWorkState = (event) => {
    setWorkState(event.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const selectDayType = () => {
    if (userData.dayType === '근무') {
      calculateWorkDayType();
    } else if (userData.dayType === '유급') {
      calculatePaidDayType();
    } else {
      calculateUnpaidDayType();
    }
  };

  const isDutyType = () => {};

  const handleWarningModalOpen = () => {
    setWarningModalOpen(true);
  };

  const handleWarningModalClose = () => {
    setWarningModalOpen(false);
  };

  useEffect(() => {
    selectDayType();
  }, [startTime, endTime]);

  // 정상 근무 계산 로직
  const calculateWorkDayType = () => {
    // 'start'와 'end' 시간을 배열로 파싱합니다.
    const startTimes = userData.start.split(', ').map((time) => time.split(':').map(Number));
    const endTimes = userData.end.split(', ').map((time) => time.split(':').map(Number));
    const timeRangeTypes = userData.timeRangeType.split(', ');
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);

    const breakIndexes = [];
    const workIndexes = [];
    const dutyIndexes = [];
    let approvedIndex = 0;

    timeRangeTypes.forEach((type, index) => {
      if (type === '휴게') {
        breakIndexes.push(index);
      } else if (type === '근무') {
        workIndexes.push(index);
      } else if (type === '승인') {
        approvedIndex = index;
      } else if (type === '의무') {
        dutyIndexes.push(index);
      }
    });

    const startInMinutes = start[0] * 60 + start[1];
    const endInMinutes = end[0] * 60 + end[1];
    const startapproved = startTimes[approvedIndex][0] * 60 + startTimes[approvedIndex][1];
    const endapproved = endTimes[approvedIndex][0] * 60 + endTimes[approvedIndex][1];

    // 총 근무 시간을 계산하기 위한 변수를 초기화합니다.
    let totalWorkingTimeInMinutes = endInMinutes - startInMinutes; // 소정 근무 시간
    let totalOverTimeInMinutes = 0;

    // 의무 시간 관련 로직
    dutyIndexes.forEach((i) => {
      const startduty = startTimes[i][0] * 60 + startTimes[i][1];
      const endduty = endTimes[i][0] * 60 + endTimes[i][1];
      console.log('의무 시간 검사');

      if (startduty < startInMinutes || endduty > endInMinutes) {
        handleWarningModalOpen();
      }
    });

    // 휴게 시간 관련 로직
    breakIndexes.forEach((i) => {
      const startbreak = startTimes[i][0] * 60 + startTimes[i][1];
      const endbreak = endTimes[i][0] * 60 + endTimes[i][1];

      if (startbreak >= startInMinutes && endbreak <= endInMinutes) {
        totalWorkingTimeInMinutes -= endbreak - startbreak;
      }
    });

    // 승인 시간 관련 로직
    workIndexes.forEach((i) => {
      const startwork = startTimes[i][0] * 60 + startTimes[i][1];
      const endwork = endTimes[i][0] * 60 + endTimes[i][1];
      if (startwork === startInMinutes && endInMinutes >= startapproved && endInMinutes <= endapproved) {
        totalOverTimeInMinutes = endInMinutes - endwork;
        if (totalOverTimeInMinutes >= 0) {
          totalWorkingTimeInMinutes -= totalOverTimeInMinutes;
        } else {
          totalOverTimeInMinutes = 0;
        }
      }
    });

    // 총 근무 시간을 시간과 분으로 변환하여 workingTime 상태를 업데이트합니다.
    const workingTimeHours = Math.floor(totalWorkingTimeInMinutes / 60);
    const workingTimeMinutes = totalWorkingTimeInMinutes % 60;

    // 초과 시간을 시간과 분으로 변환하여 workingTime 상태를 업데이트합니다.
    const overTimeHours = Math.floor(totalOverTimeInMinutes / 60);
    const overTimeMinutes = totalOverTimeInMinutes % 60;

    // workingTime 상태를 업데이트합니다.
    setWorkingTime(`${workingTimeHours.toString().padStart(2, '0')}:${workingTimeMinutes.toString().padStart(2, '0')}`);
    setOverTime(`${overTimeHours.toString().padStart(2, '0')}:${overTimeMinutes.toString().padStart(2, '0')}`);
  };

  // 유급 휴무 계산 로직
  const calculatePaidDayType = () => {
    // 소정 근무 시간은 무조건 00:00으로 설정
    setWorkingTime('00:00');

    // startTime과 endTime을 분 단위로 변환하여 계산
    const startTimeParts = startTime.split(':').map(Number);
    const endTimeParts = endTime.split(':').map(Number);

    const startTimeInMinutes = startTimeParts[0] * 60 + startTimeParts[1];
    const endTimeInMinutes = endTimeParts[0] * 60 + endTimeParts[1];

    // 초과 근무 시간 계산
    let overTimeInMinutes = endTimeInMinutes - startTimeInMinutes;

    // endTime이 startTime보다 이전인 경우에는 하루가 더해져야 함
    if (endTimeInMinutes < startTimeInMinutes) {
      overTimeInMinutes += 24 * 60; // 하루에 해당하는 분을 더해줌
    }

    // 음수인 경우 계산을 조정해줌
    if (overTimeInMinutes < 0) {
      overTimeInMinutes += 24 * 60; // 하루에 해당하는 분을 더해주고
      overTimeInMinutes -= 60; // 1시간에 해당하는 분을 빼줌
    }

    // 분을 시간과 분으로 변환하여 설정
    const overTimeHours = Math.floor(overTimeInMinutes / 60);
    const overTimeMinutes = overTimeInMinutes % 60;

    setOverTime(`${overTimeHours.toString().padStart(2, '0')}:${overTimeMinutes.toString().padStart(2, '0')}`);
  };

  // 무급 휴무 정산 로직
  const calculateUnpaidDayType = () => {
    setWorkingTime('00:00');
    setOverTime('00:00');
  };

  const modalStyle = {
    // 팝업창의 넓이를 원하는 값으로 지정합니다. 필요에 따라 변경할 수 있습니다.
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const textStyle = {
    display: 'inline-block',
    marginLeft: '20px',
    marginRight: '10px',
    width: '40%',
  };

  return (
    <Modal open={open} onClose={handleClose} style={modalStyle}>
      <Dialog
        open={open}
        onClose={handleClose}
        minWidth="xl"
        sx={{
          width: '100%', // 원하는 모달 너비 값으로 조절
          '& .MuiDialog-paper': {
            width: '40%', // 모달 내용이 모달 창 내에서 최대 너비를 가지도록 설정
          },
        }}
      >
        <DialogTitle>사용자 정보 수정</DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table sx={{ minHeight: 500, display: 'flex', alignItems: 'start', justifyContent: 'start' }}>
              <TableBody>
                <TextField
                  name="date"
                  label="근무일자"
                  fullWidth
                  value={userData.date}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="id"
                  label="사원번호"
                  fullWidth
                  value={userData.userCode}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="name"
                  label="이름"
                  fullWidth
                  value={userData.name}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                {/* <TextField
                  name="depart"
                  label="부서"
                  fullWidth
                  value={userData.dept}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                /> */}

                <TextField
                  name="rank"
                  label="직급"
                  fullWidth
                  value={userData.position}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="workingTime"
                  label="소정근무시간"
                  fullWidth
                  value={workingTime}
                  onChange={handleWorkingTime}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="overTime"
                  label="초과근무시간"
                  fullWidth
                  value={overTime}
                  onChange={handleOverTime}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  name="workType"
                  label="근로제 유형"
                  fullWidth
                  value={userData.workGroupType}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                />

                <TextField
                  name="workState"
                  label="처리상태"
                  fullWidth
                  value={workState}
                  onChange={handleWorkState}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                />

                <TextField
                  name="start"
                  label="근무인정시작시간"
                  select
                  fullWidth
                  value={startTime}
                  onChange={handleStartTime}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                  SelectProps={{
                    renderValue: () => startTime, // 선택한 값을 표시하는 로직
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
                  {/* <MenuItem key={selectedStartTime} value={selectedStartTime}>
                    {selectedStartTime}
                  </MenuItem> */}

                  {userData.timeRangeType.split(', ').map((type, index) => {
                    if (type === '근무') {
                      const [hours, minutes] = userData.start.split(', ')[index].split(':');
                      const timeString = `${hours}:${minutes}`;
                      console.log(timeString);

                      return (
                        <MenuItem key={timeString} value={timeString}>
                          {timeString}
                        </MenuItem>
                      );
                    }
                    return null;
                  })}
                </TextField>

                <TextField
                  name="end"
                  label="근무인정종료시간"
                  select
                  fullWidth
                  value={endTime}
                  onChange={handleEndTime}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
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
                  <MenuItem key={`24:00`} value={`24:00`}>
                    00:00
                  </MenuItem>
                </TextField>

                <TextField
                  name="workStart"
                  label="근로시작시간"
                  fullWidth
                  value={formatDateTimeToTime(userData.startWork)}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                />

                <TextField
                  name="workEnd"
                  label="근로종료시간"
                  fullWidth
                  value={formatDateTimeToTime(userData.leaveWork)}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                />

                <TextField
                  name="실제출근시작"
                  label="실제출근시간"
                  fullWidth
                  value={formatDateTimeToTime(userData.startWork)}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                />

                <TextField
                  name="실제출근종료"
                  label="실제퇴근시간"
                  fullWidth
                  value={formatDateTimeToTime(userData.leaveWork)}
                  margin="normal"
                  style={textStyle} // 좌우 여백 설정
                />

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
            <Button
              onClick={() => {
                handleConfirmEdit();
              }}
              color="secondary"
              variant="contained"
            >
              수정
            </Button>
            <Button onClick={handleConfirmEditClose} color="primary" variant="outlined">
              취소
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={warningModalOpen} onClose={handleWarningModalClose}>
          <DialogTitle>경고</DialogTitle>
          <DialogContent>의무 시간에 해당하는 범위가 선택되었습니다.</DialogContent>
          <DialogActions>
            <Button onClick={handleWarningModalClose} color="primary" variant="outlined">
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    </Modal>
  );
};

export default ScheduleModal;
