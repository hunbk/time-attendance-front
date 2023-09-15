import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Skeleton, Typography } from '@mui/material';
import { fDateTime } from '../../utils/formatTime';
import { enqueueSnackbar } from 'notistack';

import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';

import loginAxios from '../../api/loginAxios';
import dayjs from 'dayjs';

export default function NavWork() {
  dayjs.locale('ko'); // 한국 시간으로 조회를 위한 설정

  const [loading, setLoading] = useState(true);

  const [isWorked, setIsWorked] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [workStartTime, setWorkStartTime] = useState();
  const [workEndTime, setWorkEndTime] = useState();
  const [stateWorkEndTime, setStateWorkEndTime] = useState();

  const getData = async () => {
    // 서버에서 오늘 출근기록 조회
    // 오늘 기록 존재 시, isWorked를 true
    const currentDate = dayjs().format('YYYY-MM-DD');

    await loginAxios
      .get('/api/time-records/me', {
        params: { date: currentDate },
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.startWork) {
            setIsWorked(true);
            setWorkStartTime(response.data.startWork);
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
        setIsWorked(true);
        enqueueSnackbar('출근을 기록했습니다.', { variant: 'info' });
      }
    });
  };

  const handleWorkEnd = () => {
    loginAxios.post('/api/time-records/leave').then((response) => {
      if (response.status === 200) {
        setIsLeave(true);
        setStateWorkEndTime(dayjs()); // useEffect에서 퇴근 시간 리렌더링을 위한 상태 변경
        enqueueSnackbar('퇴근을 기록했습니다.', { variant: 'info' });
      }
    });
  };

  return (
    <Box>
      {loading ? (
        // <CircularProgress />
        <Skeleton animation="pulse" variant="rounded" width={240} height={30} sx={{ mt: 2 }} />
      ) : (
        <ButtonGroup sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Button
            size="small"
            fullWidth
            variant="outlined"
            color="info"
            startIcon={<AlarmOnIcon />}
            disabled={isWorked}
            onClick={handleWorkStart}
          >
            출근
          </Button>

          <Button
            size="small"
            fullWidth
            variant="outlined"
            color="info"
            startIcon={<AlarmOffIcon />}
            disabled={!isWorked}
            onClick={handleWorkEnd}
          >
            퇴근
          </Button>
        </ButtonGroup>
      )}
      <Box sx={{ ml: 1 }}>
        {/* TODO: 디자인 개선할 것 */}
        <Typography variant="subtitle2">
          {workStartTime ? `${fDateTime(workStartTime, 'yyyy.MM.dd HH:mm')} (출근)` : null}
        </Typography>
        <Typography variant="subtitle2">
          {workEndTime ? `${fDateTime(workEndTime, 'yyyy.MM.dd HH:mm')} (퇴근)` : null}
        </Typography>
      </Box>
    </Box>
  );
}
