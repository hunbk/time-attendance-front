import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box } from "@mui/material";
import Header from "./Header";

const Calendar = ({ groupName, workHour, breakTime }) => {
  const [workDays, setWorkDays] = useState(0);

  const startHour = parseInt(workHour.substring(0, 2));
  const startMinute = parseInt(workHour.substring(2, 4));
  const endHour = parseInt(workHour.substring(5, 7));
  const endMinute = parseInt(workHour.substring(7, 9));
  let resultHour, resultMinute, workHourNum;

  if (startMinute <= endMinute) {
    resultMinute = endMinute - startMinute;
    resultHour = endHour - startHour;
  } else {
    resultMinute = startMinute - endMinute;
    resultHour = endHour - startHour - 1;
  }

  if (resultMinute === 30) {
    workHourNum = resultHour + 0.5;
  } else {
    workHourNum = resultHour;
  }

  function getTotalBreakTimeHour() {
    // breakTime: ["1200-1300", "1600-1700"],
    let totalBreakTimeHour = 0;

    breakTime.map((interval, index) => {
      const startHour = parseInt(interval.substring(0, 2));
      const startMinute = parseInt(interval.substring(2, 4));
      const endHour = parseInt(interval.substring(5, 7));
      const endMinute = parseInt(interval.substring(7, 9));
      let resultHour, resultMinute, workHourNum;

      if (startMinute <= endMinute) {
        resultMinute = endMinute - startMinute;
        resultHour = endHour - startHour;
      } else {
        resultMinute = startMinute - endMinute;
        resultHour = endHour - startHour - 1;
      }

      if (resultMinute === 30) {
        workHourNum = resultHour + 0.5;
      } else {
        workHourNum = resultHour;
      }

      totalBreakTimeHour += workHourNum;
    });

    return totalBreakTimeHour;
  }

  function getWeekendsInMonth(year, monthIndex, daysInMonth) {
    let counter = 0;

    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = new Date(year, monthIndex, i).getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        counter++;
      }
    }

    return counter;
  }

  const handleDatesSet = (dateInfo) => {
    const calendarApi = dateInfo.view.calendar;
    let events = calendarApi.getEvents();
    let currentMonthIndex = 0;
    if (new Date(dateInfo.start).getDate() === 1) {
      currentMonthIndex = new Date(dateInfo.start).getMonth();
    } else {
      currentMonthIndex = new Date(dateInfo.start).getMonth() + 1;
    }

    const currentYear = new Date(dateInfo.start).getFullYear();
    events = events.filter(
      (event) => event.start.getMonth() === currentMonthIndex
    );
    const daysInMonth = new Date(
      currentYear,
      currentMonthIndex + 1,
      0
    ).getDate();

    setWorkDays(
      daysInMonth -
        events.length -
        getWeekendsInMonth(currentYear, currentMonthIndex, daysInMonth)
    );
  };

  return (
    <Box m="20px">
      <Header
        title="근로그룹스케줄"
        subtitle="근로그룹의 근로일 근무시간을 확인합니다."
      />
      <span>{groupName}</span>
      <span>소정근로일 수 {workDays}일</span>
      <span>
        소정근무시간 {(workHourNum - getTotalBreakTimeHour()) * workDays}시간
      </span>

      <Box display="flex" justifyContent="space-between">
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            initialEvents={[
              {
                id: "12315",
                title: "창립기념일",
                date: "2023-07-10",
              },
              {
                id: "5123",
                title: "석가탄신일",
                date: "2023-07-28",
              },
              {
                id: "5323",
                title: "크리스마스",
                date: "2023-12-25",
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
