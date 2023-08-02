import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import CalendarModal from "../../components/workGroup/CalendarModal";
import SwitchWrapped from "../../components/workGroup/SwitchWrapped";

type WorkGroupResponseDtoType = {
  id: number;
  name: string;
  type: string;
  timeRangeType: string;
  start: string;
  end: string;
  numOfMembers: number;
  workDays: string;
  isOn: boolean;
  dateUpdated: string;
};

const ListPage = ({ setIsWorkGroupListHidden }) => {
  // const navigate = useNavigate();
  const [workGroupResponseDtoList, setWorkGroupResponseDtoList] = useState<WorkGroupResponseDtoType[]>([]);

  function getTotalBreakTimeHour(breakTime: string[]) {
    // breakTime: ["12:00:00-13:00:00", "16:00:00-17:00:00"],
    let totalBreakTimeHour = 0;

    breakTime.forEach((interval: string, index: number) => {
      const startHour = parseInt(interval.substring(0, 2), 10);
      const startMinute = parseInt(interval.substring(3, 5), 10);
      const endHour = parseInt(interval.substring(9, 11), 10);
      const endMinute = parseInt(interval.substring(12, 14), 10);
      let resultHour;
      let resultMinute;
      let breakHourNum;

      if (startMinute <= endMinute) {
        resultMinute = endMinute - startMinute;
        resultHour = endHour - startHour;
      } else {
        resultMinute = startMinute - endMinute;
        resultHour = endHour - startHour - 1;
      }

      if (resultMinute === 30) {
        breakHourNum = resultHour + 0.5;
      } else {
        breakHourNum = resultHour;
      }

      totalBreakTimeHour += breakHourNum;
    });

    return totalBreakTimeHour;
  }


  const columns: GridColDef<WorkGroupResponseDtoType>[] = [
    {
      field: "workGroupName",
      headerName: "근로그룹명(유형)",
      flex: 1,
      renderCell: ({ row: { name, type } }) => {
        return (
          <Box>
            <Typography>
              {name}
            </Typography>
            <Typography>
              {type === 'n' ? "일반" : "시차"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "workHourSummary",
      headerName: "근무시간 요약",
      flex: 1,
      renderCell: ({ row: { timeRangeType, start, end } }) => {
        const timeRangeTypeArr = timeRangeType.split(", ");
        const startArr = start.split(", ");
        const endArr = end.split(", ");

        let workHour = '';
        const breakHours = [];

        for (let i = 0; i < timeRangeTypeArr.length; i += 1) {
          if (timeRangeTypeArr[i] === "work") {
            workHour = `${startArr[i].substring(0, 5)} ~ ${endArr[i].substring(0, 5)}`;
          } else if (timeRangeTypeArr[i] === "break") {
            breakHours.push(`${startArr[i].substring(0, 5)} ~ ${endArr[i].substring(0, 5)}`);
          }
        }

        return (
          <Box>
            <Typography>
              근무시간 {workHour}
            </Typography>
            <Typography component={"div"}>
              휴식시간 {breakHours.map((breakHour, index) => <Typography key={index}>{breakHour}</Typography>)}
              {/* 휴식시간 {breakHours} */}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "workGroupSummary",
      headerName: "그룹정보",
      flex: 1,
      renderCell: ({ row: { numOfMembers, dateUpdated } }) => {
        return (
          <Box>
            <Typography>
              인원: {numOfMembers}명
            </Typography>
            <Typography>
              업데이트일자: {dateUpdated.substring(0, 10)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "workGroupCalendar",
      headerName: "캘린더",
      flex: 1,
      renderCell: ({ row: { name, timeRangeType, start, end, workDays } }) => {
        const timeRangeTypeArr = timeRangeType.split(", ");
        const startArr = start.split(", ");
        const endArr = end.split(", ");
        const workDaysArr = workDays.split(", ");
        const convertedWorkDays = [];
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

        days.forEach((day, index) => {
          if (workDaysArr[index] === "근무") {
            convertedWorkDays.push(day);
          }
        })

        const breakHours = [];
        let resultHour;
        let resultMinute;
        let workHourNum;

        for (let i = 0; i < timeRangeTypeArr.length; i += 1) {
          if (timeRangeTypeArr[i] === "work") {
            const startHour = parseInt(startArr[i].substring(0, 2), 10);
            const startMinute = parseInt(startArr[i].substring(3, 5), 10);
            const endHour = parseInt(endArr[i].substring(0, 2), 10);
            const endMinute = parseInt(endArr[i].substring(3, 5), 10);

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
          } else if (timeRangeTypeArr[i] === "break") {
            breakHours.push(`${startArr[i]}-${endArr[i]}`);
          }
        }

        const breakHourNum = getTotalBreakTimeHour(breakHours);

        return (
          <CalendarModal groupName={name} workHourPerDay={workHourNum - breakHourNum} convertedWorkDays={convertedWorkDays} />
        );
      },
    },
    {
      field: "isOn",
      headerName: "사용여부",
      flex: 1,
      renderCell: ({ row: { isOn, numOfMembers } }) => {
        return (
          <SwitchWrapped
            isOn={isOn}
            numOfMembers={numOfMembers}
          />
        );
      },
    },
  ]

  async function postData() {
    const url = `http://localhost:8080/api/getWorkGroupResponseDtoList`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
    });

    response.json().then((data) => setWorkGroupResponseDtoList(data));
  }

  useEffect(() => {
    postData();
  }, []);

  return (
    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="60vh"
        sx={{ display: "flex", flexDirection: "column" }}
        component={"div"}
      >
        {workGroupResponseDtoList.length !== 0 && <DataGrid sx={{
          '& .MuiDataGrid-selectedRowCount': {
            display: 'none',
          },
        }} rowHeight={90} rows={workGroupResponseDtoList} columns={columns} />}
        <Button sx={{ alignSelf: 'flex-end', marginTop: '10px' }} variant="outlined" onClick={() => {
          setIsWorkGroupListHidden(true);
        }}>근로그룹 추가하기</Button>
      </Box>
    </Box>
  );
};

export default ListPage;
