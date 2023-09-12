import { useEffect, useState } from 'react';
import { Box, Container, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import {
  addDays,
  startOfWeek,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';

import { Helmet } from 'react-helmet-async';
import AttendanceWidgetSummary from './AttendanceWidgetSummary';

import WorkGroupInfo from './WorkGroupInfo';
import WeeklyWorkChart from './WeeklyWorkChart';
import TimeRecordList from './TimeRecordList';
import { useAuthState } from '../../context/AuthProvider';
import loginAxios from '../../api/loginAxios';
import dayjs from 'dayjs';

export default function MyPage() {
  const [loading, setLoading] = useState(true);
  const [workGroupData, setWorkGroupData] = useState({});
  const [selectedWeek, setSelectedWeek] = useState({ start: '', end: '' }); // 주간 정보를 저장할 상태 변수
  const [weeklyWorkData, setWeeklyWorkData] = useState([]);
  const [selectedTimeRecordDate, setSelectedTimeRecordDate] = useState({ start: '', end: '' }); // 출퇴근기록 날짜의 선택 범위를 저장할 상태 변수
  const [timeRecordData, setTimeRecordData] = useState([]);

  const { user } = useAuthState();

  useEffect(() => {
    const today = new Date();
    const startWeek = startOfWeek(today, { weekStartsOn: 1 }); // 주의 시작일 (월요일)
    const endWeek = endOfWeek(today, { weekStartsOn: 1 }); // 주의 종료일 (일요일)
    const startMonth = startOfMonth(today);
    const endMonth = endOfMonth(today);

    fetchWorkGroupData();
    fetchWeekData(startWeek, endWeek);
    fetchTimeRecordData(startMonth, endMonth);
  }, []);

  // 사용자의 근로그룹 정보 요청 API
  const fetchWorkGroupData = async () => {
    const response = await loginAxios.get(`/api/users/${user.userId}/workgroup`);
    if (response.status === 200) {
      setWorkGroupData(response.data);
      setLoading(false);
    }
  };

  // 사용자의 주간 근무기록 요청 API(정산기록)
  const fetchWeekData = async (start, end) => {
    const response = await loginAxios.get(`/api/users/${user.userId}/time-records/weekly`, {
      params: { startDate: format(start, 'yyyy-MM-dd') },
    });

    try {
      if (response.data) {
        const filledData = fillMissingDates(response.data.list, format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'));
        setWeeklyWorkData(filledData);
        setSelectedWeek({ start, end });
      }
    } catch {
      throw new Error('주간 근무기록 요청 에러');
    }
  };

  // 출퇴근기록 요청 API
  const fetchTimeRecordData = async (start, end) => {
    const response = await loginAxios.get(`/api/users/${user.userId}/time-records`, {
      params: { startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd') },
    });

    try {
      if (response.data) {
        setTimeRecordData(response.data.list);
        setSelectedTimeRecordDate({ start, end });
      }
    } catch {
      throw new Error('출퇴근기록 요청 에러');
    }
  };

  // 주간 근무기록 이동 함수
  const updateWeek = (direction) => {
    // selectedWeek을 기준으로 이전 주나 다음 주의 start와 end를 계산
    // direction을 숫자로 변환
    const dir = direction === 'prev' ? -1 : 1;

    const newStart = addDays(selectedWeek.start, dir * 7);
    const newEnd = addDays(selectedWeek.end, dir * 7);

    fetchWeekData(newStart, newEnd);
  };

  // 주간 근무기록 데이터에서 출근하지 않은 날짜가 있을 경우 생성해서 돌려주는 함수
  const fillMissingDates = (data, startDate, endDate) => {
    // eachDayOfInterval 함수를 사용하여 startDate부터 endDate까지의 모든 날짜를 생성합니다.
    const allDates = eachDayOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate),
    });

    // allDates 배열을 순회하며 데이터가 없는 날짜에 대한 빈 객체를 생성합니다.
    const filledData = allDates.map((dateObj) => {
      const dateStr = format(dateObj, 'yyyy-MM-dd');
      const existingData = data.find((item) => item.date === dateStr);

      return (
        existingData || {
          date: dateStr,
          workingTime: '00:00:00',
          overTime: '00:00:00',
        }
      );
    });

    return filledData;
  };

  // 출퇴근기록 선택 날짜 업데이트 함수
  const updateSelectedTimeRecordDate = (newStart, newEnd) => {
    setSelectedTimeRecordDate({ start: newStart, end: newEnd });
  };

  // 출퇴근기록 검색 버튼
  const handleTimeRecordSearch = () => {
    fetchTimeRecordData(selectedTimeRecordDate.start, selectedTimeRecordDate.end);
  };

  return (
    <>
      {loading ? (
        // 로딩 중일 때
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <Box width="50%">
            <LinearProgress color="primary" />
          </Box>
        </Box>
      ) : (
        // 로딩 완료되면 실제 컨텐츠 표시
        <>
          <Helmet>
            <title> 마이페이지 </title>
          </Helmet>

          <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="left" mb={5}>
              <Typography variant="h4" gutterBottom>
                마이페이지
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              {/* 나의 근로그룹 정보 */}
              <Grid item xs={12} sm={12} md={3}>
                <WorkGroupInfo data={workGroupData} />
              </Grid>

              {/* 근태현황 카운트 위젯 */}
              {/* <Grid item xs={12} sm={4} md={2}>
                <AttendanceWidgetSummary title="정상처리" total={1} color="info" />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <AttendanceWidgetSummary title="근태이상" total={1} color="error" />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <AttendanceWidgetSummary
                  title="미처리"
                  total={1}
                  sx={{
                    color: 'black',
                    bgcolor: 'rgb(230, 230, 230)',
                  }}
                />
              </Grid> */}

              {/* 주간 근무차트 */}
              <Grid item xs={12} sm={12} md={9}>
                <WeeklyWorkChart
                  title="주간 근무차트"
                  subheader={`${user.name}님의 주간 근무시간을 확인합니다.`}
                  workData={weeklyWorkData}
                  selectedWeek={selectedWeek}
                  updateWeek={updateWeek}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <TimeRecordList
                  title="출퇴근기록"
                  subheader="기간을 설정하여 출근내역을 확인합니다."
                  rows={timeRecordData}
                  selectedTimeRecordDate={selectedTimeRecordDate}
                  updateSelectedTimeRecordDate={updateSelectedTimeRecordDate}
                  handleTimeRecordSearch={handleTimeRecordSearch}
                />
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  );
}
