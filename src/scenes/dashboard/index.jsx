import { CheckCircle } from "@mui/icons-material";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { default as BarChart } from "../../components/BarChart";
import { Time, User_Data, mockBarData } from "../../data/mockData";
import { tokens } from "../../theme";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Start1 : 사용자 이름 가져오기
  const user = User_Data.find((user) => user.id === 1);
  const userName = user ? user.name : "사용자 없음";
  const subTitleText = `${userName}님 출근완료 상태입니다`;
  // End1 : 사용자 이름 가져오기

  // Start2 : 지각 횟수 가져오기
  const userDept = user ? user.dept : "사용자 없음";
  const UseDept = `${userDept}`;
  const userlate = user ? user.worklate : "지각 데이터 없음";
  const UseLate = `${userlate}`;
  // End2 : 지각 횟수 가져오기

  // Start3 : 사용자인지 관리자인지 판별하기
  const UserOrManagement = User_Data.find((user) => user.userType === "True");
  const UserOrManager = UserOrManagement ? "사용자" : "관리자";
  const userType = `${UserOrManager}`;
  // End3 : 사용자인지 관리자인지 판별하기

  // Start4 : 근무시간, 연장 근무 시간, 총 근무 시간 계산
  const getWeeklyWorkHours = (workData) => {
    let 기본_근무_시간 = 0;
    let 초과_근무_시간 = 0;
    let 외근 = 0;

    workData.forEach((data) => {
      기본_근무_시간 += data["기본 근무 시간"];
      초과_근무_시간 += data["초과 근무 시간"];
      외근 += data["외근"];
    });

    return [기본_근무_시간, 초과_근무_시간, 외근];
  };

  const [기본_근무_시간, 초과_근무_시간, 외근] =
    getWeeklyWorkHours(mockBarData);
  const 총_근무_시간 = 기본_근무_시간 + 초과_근무_시간 + 외근;
  // End4 : 근무시간, 연장 근무 시간, 총 근무 시간 계산

  // Start5 : 잔여 연차 사용 연차 계산
  const calculateYears = (joinCompany) => {
    const joinDate = new Date(joinCompany);
    const currentDate = new Date();
    const yearsOfService = currentDate.getFullYear() - joinDate.getFullYear();

    return yearsOfService;
  };

  const VacationDate = (calculateYears) => {
    let vacationDays = 0;

    if (calculateYears === 0) {
      vacationDays = 0;
    } else if (calculateYears <= 2) {
      vacationDays = 15;
    } else if (calculateYears <= 4) {
      vacationDays = 16;
    } else if (calculateYears <= 5) {
      vacationDays = 17;
    } else if (calculateYears <= 7) {
      vacationDays = 18;
    } else if (calculateYears <= 15) {
      vacationDays = 19;
    } else if (calculateYears <= 19) {
      vacationDays = 24;
    } else if (calculateYears <= 21) {
      vacationDays = 25;
    } else if (calculateYears <= 25) {
      vacationDays = 25;
    }
    return vacationDays;
  };

  User_Data.forEach((user) => {
    const Currnetyears = calculateYears(user.joinCompany);
    const vacationDays = VacationDate(Currnetyears);

    user.calculateYears = Currnetyears;
    user.vacationDays = vacationDays;
  });
  // End5 : 잔여 연차 사용 연차 계산

  // Start6 : 차트 위 날짜 구하기
  function getChartDate() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const Day = dayOfWeek === 0 ? 1 : 1 - dayOfWeek;
    const ChartDate = new Date(today);
    ChartDate.setDate(ChartDate.getDate() + Day);
    return ChartDate;
  }

  const getStartDate = getChartDate();
  const getEndDate = new Date(getStartDate);
  getEndDate.setDate(getEndDate.getDate() + 6);

  const [currentDates, setcurrentDates] = useState({
    startDate: getStartDate,
    endDate: getEndDate,
  });

  const handleButtonClick = (direction) => {
    const { startDate, endDate } = currentDates;
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (direction === "prev") {
      newStartDate.setDate(newStartDate.getDate() - 7);
      newEndDate.setDate(newEndDate.getDate() - 7);
    } else if (direction === "next") {
      newStartDate.setDate(newStartDate.getDate() + 7);
      newEndDate.setDate(newEndDate.getDate() + 7);
    }

    setcurrentDates({ startDate: newStartDate, endDate: newEndDate });
  };
  // End6 : 차트 위 날짜 구하기

  // Start7 : 오늘 가서 할 것 ! 요일 구하기
  // const[Day, setDay] = useState();

  // const  whatDay = new Date();
  // const day = whatDay.getDay();
  // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // setDay(days[day]);

  return (
    <Box m="20px">
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="200px"
        gap="20px"
      >
        {/* 상단 첫번째 줄 박스 전체 라인 CSS */}
        {/* 상단 첫번째 박스 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          paddingTop="30px"
          paddingLeft="30px"
          borderRadius={3}
        >
          <Box>
            <CheckCircle
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
            <Typography variant="h5">{subTitleText}</Typography>
            <Typography>타입 : {userType}</Typography>
            <Typography variant="subtitle2">부서 : {UseDept}</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            marginLeft="auto"
            marginRight="30px"
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ width: "150px", marginBottom: "10px" }}
              onClick={() => {
                // 여기에 출근 버튼 클릭 시 실행할 함수 추가
              }}
            >
              출근
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ width: "150px", marginBottom: "10px" }}
              onClick={() => {
                // 여기에 퇴근 버튼 클릭 시 실행할 함수 추가
              }}
            >
              퇴근
            </Button>
          </Box>
        </Box>
        {/* 상단 두번째 박스 */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          pt={0}
          pl={3}
          pr={3}
          borderRadius={5}
        >
          <Box pt={5}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  p={2}
                  borderRadius={3}
                  boxShadow={10}
                  minHeight="120px"
                >
                  <Typography variant="h5">
                    {`근무 시간 : ${기본_근무_시간.toFixed(1)} 시간`}
                  </Typography>
                  &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
                  <Typography variant="h5">
                    {`연장 근무 : ${초과_근무_시간.toFixed(1)} 시간`}
                  </Typography>
                  &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
                  <Typography variant="h5">
                    {`총 근무 시간 : ${총_근무_시간.toFixed(1)} 시간`}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* 상단 세번째 박스 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          pt={0}
          pl={3}
          pr={3}
          borderRadius={5}
        >
          <Box pt={5}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  p={2}
                  borderRadius={3}
                  boxShadow={10}
                  minHeight="120px"
                >
                  <Typography variant="h5" color="text.primary">
                    {user.calculateYears} 사용연차 / {user.vacationDays}{" "}
                    남은연차
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  p={2}
                  borderRadius={3}
                  boxShadow={10}
                  minHeight="120px"
                >
                  <Typography variant="h5" color="text.secondary">
                    {UseLate}회
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* 차트 영역 구현 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius={3}
        >
          <Box
            mt="25px"
            p="10px 30px"
            display="flex"
            alignItems="center"
            width="100%" // 전체 넓이를 설정합니다.
          >
            {/* 출근 및 초과근무 */}
            <Typography
              variant="h6"
              fontWeight="600"
              color={colors.grey[100]}
              width="50%" // 자신의 넓이를 50%로 설정합니다.
              textAlign="left" // 오른쪽 정렬로 설정합니다.
            >
              출근 및 초과근무
            </Typography>

            {/* 기간 */}
            <Typography
              width="50%" // 자신의 넓이를 50%로 설정합니다.
              textAlign="left" // 왼쪽 정렬로 설정합니다.
            >
              <div>
                <button onClick={() => handleButtonClick("prev")}>{"<"}</button>
                {currentDates.startDate.toLocaleDateString()}
                {" ~ "}
                {currentDates.endDate.toLocaleDateString()}
                <button onClick={() => handleButtonClick("next")}>{">"}</button>
              </div>
            </Typography>
          </Box>

          {/* 차트 구현 영역 */}
          {/* 차트 크기 조절 영역 */}
          <Box height="70%" m="20px 10 10 10">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          height="100%"
          width="100%"
          borderRadius="10px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography
              paddingLeft="20px"
              color={colors.grey[100]}
              variant="h5"
              fontWeight="600"
            >
              일자
            </Typography>

            <Typography
              pr="30px"
              color={colors.grey[100]}
              variant="h5"
              fontWeight="600"
              pl="50px"
            >
              출근 시각
            </Typography>

            <Typography
              pr="30px"
              color={colors.grey[100]}
              variant="h5"
              fontWeight="600"
            >
              퇴근시각
            </Typography>

            <Typography
              pr="30px"
              color={colors.grey[100]}
              variant="h5"
              fontWeight="600"
            >
              상태
            </Typography>
          </Box>

          {/* 여기는 차트 오른쪽 부분 */}
          {Time.map((TimeTable, i) => (
            <Box
              key={`${TimeTable.Time}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`2px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {TimeTable.Time}(월)
                </Typography>

                <Typography color={colors.grey[100]}></Typography>
              </Box>
              {/* 스케쥴 구간 */}
              <Box color={colors.grey[100]} pr="150px">
                <Typography variant="h5">{TimeTable.StartWork}</Typography>
              </Box>

              <select
                style={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "1px 10px",
                  color: "black",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                <option
                  value="option1"
                  style={{
                    color: "red",
                  }}
                >
                  예정
                </option>

                <option
                  value="option2"
                  style={{
                    color: "blue",
                  }}
                >
                  보류
                </option>

                <option
                  value="option3"
                  style={{
                    color: "green",
                  }}
                >
                  완료
                </option>
              </select>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
