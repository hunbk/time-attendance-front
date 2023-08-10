import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, CircularProgress, Typography } from '@mui/material';
import loginAxios from '../../api/loginAxios';
import dayjs from 'dayjs';

export default function NavWork() {
  dayjs.locale('ko'); // 한국 시간으로 조회를 위한 설정

  const [loading, setLoading] = useState(true);

  const [isWorked, setIsWorked] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [workStartTime, setWorkStartTime] = useState('-');
  const [workEndTime, setWorkEndTime] = useState('-');
  const [stateWorkEndTime, setStateWorkEndTime] = useState();

  const getData = async () => {
    setLoading(true); // 요청 시작 전에 로딩 상태를 true로 설정

    // 서버에서 오늘 출근기록 조회
    // 오늘 기록 존재 시, isWorked를 true
    const currentDate = dayjs().format('YYYY-MM-DD');

    await loginAxios
      .get('/api/time-records/me', {
        params: { date: currentDate },
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.work) {
            setIsWorked(true);
            setWorkStartTime(response.data.work);
          }
          if (response.data.leaveWork) {
            setWorkEndTime(response.data.leaveWork);
          }
        }
      })
      .catch((error) => {
        // 오늘 출근기록이 없을 때
        if (error.response && error.response.status === 404) {
          setIsWorked(false);
        }
      })
      .finally(() => {
        setLoading(false); // 요청 완료 후에 로딩 상태를 false로 설정
      });
  };

  // 출근, 퇴근 요청 시 리렌더링을 위함
  useEffect(() => {
    getData();
  }, [isWorked, isLeave, workStartTime, stateWorkEndTime]);

  const handleWorkStart = () => {
    loginAxios.post('/api/time-records/work').then((response) => {
      if (response.status === 201) {
        console.log(response);
        setIsWorked(true);
        alert('출근');
      }
    });
  };

  const handleWorkEnd = () => {
    loginAxios.post('/api/time-records/leave').then((response) => {
      if (response.status === 200) {
        setIsLeave(true);
        setStateWorkEndTime(dayjs()); // useEffect에서 퇴근 시간 리렌더링을 위한 상태 변경
        alert('퇴근');
      }
    });
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <ButtonGroup sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Button
            size="small"
            fullWidth
            variant="contained"
            color="info"
            sx={{ mr: 1 }} // 오른쪽 마진을 추가하여 버튼 사이에 간격을 만듭니다.
            disabled={isWorked}
            onClick={handleWorkStart}
          >
            출근
          </Button>

          <Button size="small" fullWidth variant="contained" color="info" disabled={!isWorked} onClick={handleWorkEnd}>
            퇴근
          </Button>
        </ButtonGroup>
      )}
      <Box>
        {/* TODO: 디자인 개선할 것 */}
        {workStartTime && <Typography>출근 시간: {workStartTime}</Typography>}
        {workEndTime && <Typography>퇴근 시간: {workEndTime}</Typography>}
      </Box>
    </Box>
  );
}
