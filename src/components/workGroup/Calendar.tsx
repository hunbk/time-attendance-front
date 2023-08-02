import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Box, Typography } from '@mui/material';
import Header from './Header';

type CalendarProps = {
  groupName: string;
  workHourPerDay: number;
  convertedWorkDays: string[];
};

const Calendar: React.FC<CalendarProps> = ({ groupName, workHourPerDay, convertedWorkDays }) => {
  const [workDaysInMonth, setWorkDaysInMonth] = useState(0);
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const handleDatesSet = (dateInfo) => {
    const calendarApi = dateInfo.view.calendar;
    const events = calendarApi.getEvents();
    let currentMonthIndex = 0;
    const startDates = [];

    // 현재 달력에 표시된 달이 1일부터 시작하면 해당 월의 인덱스 검색, 지난달 말일부터 표시되어있으면 +1하여 현 월의 인덱스를 넣음.
    if (new Date(dateInfo.start).getDate() === 1) {
      currentMonthIndex = new Date(dateInfo.start).getMonth();
    } else {
      currentMonthIndex = new Date(dateInfo.start).getMonth() + 1;
    }

    const currentYear = new Date(dateInfo.start).getFullYear();

    events.forEach((event) => {
      if (event.start.getMonth() === currentMonthIndex) {
        startDates.push(event.start.getDate());
      }
    });

    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

    function getWorkdaysInMonth(year, monthIndex, daysInMonth) {
      let counter = 0;

      for (let i = 1; i <= daysInMonth; i += 1) {
        if (!startDates.includes(i)) {
          const dayOfWeek = new Date(year, monthIndex, i).getDay();

          if (convertedWorkDays.includes(days[dayOfWeek])) {
            counter += 1;
          }

        }
      }

      return counter;
    }


    setWorkDaysInMonth(getWorkdaysInMonth(currentYear, currentMonthIndex, daysInMonth));
  };



  return (
    <Box m="20px">
      <Header title="근로그룹스케줄" subtitle="근로그룹의 근로일 근무시간을 확인합니다." />
      <Typography sx={{display: "flex", justifyContent: "space-around"}} component={"div"}>
        <span>{groupName}</span>
        <span>소정근로일 수 {workDaysInMonth}일</span>
        <span>
          소정근무시간 {workHourPerDay * workDaysInMonth}
          시간
        </span>
      </Typography>

      <Box display="flex" justifyContent="space-between" component={"div"}>
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            }}
            initialView="dayGridMonth"
            initialEvents={[
              {
                id: '12315',
                title: '창립기념일',
                date: '2023-07-10',
              },
              {
                id: '5123',
                title: '석가탄신일',
                date: '2023-07-28',
              },
              {
                id: '5323',
                title: '크리스마스',
                date: '2023-12-25',
              },
            ]}
            datesSet={handleDatesSet}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
