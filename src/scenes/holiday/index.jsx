import React, { useEffect, useRef, useState } from "react";
import { Field, Form, Formik } from "formik";
import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";
import { mockDataHoliday } from "../../data/mockData";

const Holiday = () => {
  const baseUrl = "http://localhost:8080";

  const [holidays, setHolidays] = useState(mockDataHoliday);
  const formikRef = useRef();

  const handleDateClick = (selected) => {
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (formikRef.current) {
      formikRef.current.setFieldValue("date", selected.startStr);
    }
  };

  // 휴일 데이터 요청
  const getHolidays = async () => {
    await axios
      .get(baseUrl + `/api/holidays`)
      .then((response) => setHolidays(response.data));
  };

  // Fullcalendar 라이브러리가 이해하는 포맷으로 변환
  const convertFullcalendarFormat = (originalData) => {
    return originalData.map((holiday) => ({
      id: holiday.id,
      start: holiday.date,
      title: holiday.name,
    }));
  };

  useEffect(() => {
    console.log("Mount:", holidays);
    getHolidays();
    console.log("휴일정보 받아옴");
  }, []);

  useEffect(() => {
    console.log("Update:", holidays);
  }, [holidays]);

  // 휴일 등록
  const handleFormSubmit = async (values) => {
    await axios
      .post(baseUrl + "/api/holidays", values)
      .then((response) => getHolidays())
      .catch((error) => console.log(error));
  };

  // 휴일 삭제
  const handleEventClick = async (selected) => {
    console.log(selected.event.id);
    const holidayId = selected.event.id;
    if (window.confirm(`삭제하시겠습니까?`)) {
      // selected.event.remove();
      await axios
        .delete(baseUrl + `/api/holidays/${holidayId}`)
        .then((response) => getHolidays());
    }
  };

  return (
    <Box m="20px">
      <Header title="휴일 관리" subtitle="회사의 휴일을 관리합니다." />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR */}
        <Box flex="1 1 80%" ml="15px">
          <FullCalendar
            locale={"ko"}
            height="75vh"
            plugins={[multiMonthPlugin, dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "title",
              right: "today dayGridMonth,multiMonthYear prev,next",
            }}
            buttonText={{
              today: "오늘",
              month: "월",
              year: "년",
              day: "일",
            }}
            initialView="dayGridMonth"
            // initialEvents={convertFullcalendarFormat(holidays)} // 첫 렌더링 시만 값 적용
            events={convertFullcalendarFormat(holidays)} // 이벤트마다 적용
            // editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEventRows={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            dayCellContent={dayCellContent}
          />
        </Box>

        {/* FORM */}
        <Box
          flex="1 1 20%"
          ml="15px"
          mr="15px"
          display="flex"
          flexDirection="column"
        >
          <Formik
            innerRef={formikRef}
            initialValues={{
              date: "",
              payType: "paid",
              name: "",
            }}
            onSubmit={(values) => {
              console.log(values);
              handleFormSubmit(values);
            }}
          >
            {(formik) => (
              <Form>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="date"
                    type="date"
                    label="휴무 날짜"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    fullWidth
                    select
                    name="payType"
                    label="급여 여부"
                  >
                    <MenuItem value="paid">유급 휴일</MenuItem>
                    <MenuItem value="unpaid">무급 휴일</MenuItem>
                  </Field>
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="name"
                    label="휴일 이름"
                  />
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  color="primary"
                  variant="contained"
                >
                  휴일 등록
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default Holiday;

const dayCellContent = (args) => {
  // 주말에 따라 스타일 지정
  const dayOfWeek = args.date.getDay();
  const styles = {
    color: dayOfWeek === 0 ? "red" : dayOfWeek === 6 ? "blue" : "black",
  };

  return <div style={styles}>{args.dayNumberText}</div>;
};
