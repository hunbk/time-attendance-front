import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import CalendarModal from "../../components/workGroup/CalendarModal";
import SwitchWrapped from "../../components/workGroup/SwitchWrapped";
import { DataType } from "./WorkGroupEnrollmentPage";
import { DataToBeModifiedType } from "./WorkGroupIndexPage";

type WorkGroupListPageProps = {
  setIsWorkGroupListHidden: Dispatch<SetStateAction<boolean>>;
  setDataToBeModified: Dispatch<SetStateAction<DataToBeModifiedType>>;
}

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

const WorkGroupListPage: FC<WorkGroupListPageProps> = ({ setIsWorkGroupListHidden, setDataToBeModified }) => {
  const [workGroupResponseDtoList, setWorkGroupResponseDtoList] = useState<WorkGroupResponseDtoType[]>([]);
  const getData = async () => {
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
    getData();
  }, []);

  const alignments: string[] = [];
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const getTotalHours = (timeRangeArr: string[]) => {
    // timeRangeArr: ["12:00:00-13:00:00", "16:00:00-17:00:00"],
    let totalHours = 0;

    timeRangeArr.forEach((timeRange: string) => {
      const startHour = parseInt(timeRange.substring(0, 2), 10);
      const startMinute = parseInt(timeRange.substring(3, 5), 10);
      const endHour = parseInt(timeRange.substring(9, 11), 10);
      const endMinute = parseInt(timeRange.substring(12, 14), 10);
      let hoursGap: number;
      let minutesGap: number;
      let hours: number;

      if (startMinute <= endMinute) {
        minutesGap = endMinute - startMinute;
        hoursGap = endHour - startHour;
      } else {
        minutesGap = startMinute - endMinute;
        hoursGap = endHour - startHour - 1;
      }

      if (minutesGap === 30) {
        hours = hoursGap + 0.5;
      } else {
        hours = hoursGap;
      }

      totalHours += hours;
    });

    return totalHours;
  }

  const handleDelete = async (workGroupId: number) => {
    fetch(`http://localhost:8080/api/workgroups/${workGroupId}`, {
      method: 'DELETE',
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        window.location.href = "http://localhost:3000/dashboard/workgroups";
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const responseDtoToDataType = (workGroupId: number) => {
    const tempData: DataType = {
      name: "",
      type: 'n',
      workDayType: {
        mon: '무급',
        tue: '무급',
        wed: '무급',
        thu: '무급',
        fri: '무급',
        sat: '무급',
        sun: '무급',
      },
      timeRangeType: [],
      start: [],
      end: [],
    };

    tempData.timeRangeType = workGroupResponseDtoList[workGroupId - 1].timeRangeType.split(", ") as ("work" | "break" | "approved" | "compulsory")[];
    tempData.start = workGroupResponseDtoList[workGroupId - 1].start.split(", ");
    tempData.end = workGroupResponseDtoList[workGroupId - 1].end.split(", ");
    tempData.name = workGroupResponseDtoList[workGroupId - 1].name;
    tempData.type = workGroupResponseDtoList[workGroupId - 1].type as "n" | "f";
    const workDaysArr = workGroupResponseDtoList[workGroupId - 1].workDays.split(", ") as ("근무" | "유급" | "무급")[];
    tempData.workDayType.mon = workDaysArr[0] as "근무" | "유급" | "무급";
    tempData.workDayType.tue = workDaysArr[1] as "근무" | "유급" | "무급";
    tempData.workDayType.wed = workDaysArr[2] as "근무" | "유급" | "무급";
    tempData.workDayType.thu = workDaysArr[3] as "근무" | "유급" | "무급";
    tempData.workDayType.fri = workDaysArr[4] as "근무" | "유급" | "무급";
    tempData.workDayType.sat = workDaysArr[5] as "근무" | "유급" | "무급";
    tempData.workDayType.sun = workDaysArr[6] as "근무" | "유급" | "무급";

    generateAlignments(workDaysArr);

    return tempData;
  }

  const generateAlignments = (workDaysArr: ("근무" | "유급" | "무급")[]) => {
    for (let i = 0; i < workDaysArr.length; i += 1) {
      if (workDaysArr[i] === "근무") {
        alignments.push(DAYS[i]);
      }
    }
  };

  const handleModify = (workGroupId: number) => {
    setDataToBeModified({
      id: workGroupId,
      contents: responseDtoToDataType(workGroupId),
      alignments
    });
    setIsWorkGroupListHidden(true);
  }

  const columns: GridColDef<WorkGroupResponseDtoType>[] = [
    {
      field: "workGroupName",
      headerName: "근로그룹명(유형)",
      headerAlign: 'center',
      align: 'center',
      flex: 0.7,
      renderCell: ({ row: { name, type } }) =>
        <Box>
          <Typography>
            {name}
          </Typography>
          <Typography>
            {type === 'n' ? "일반" : "시차"}
          </Typography>
        </Box>
    },
    {
      field: "workHourSummary",
      headerName: "근무시간 요약",
      headerAlign: 'center',
      align: 'center',
      flex: 1.2,
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
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "workGroupSummary",
      headerName: "그룹정보",
      headerAlign: 'center',
      align: 'center',
      flex: 1.2,
      renderCell: ({ row: { numOfMembers, dateUpdated } }) =>
        <Box>
          <Typography>
            인원: {numOfMembers}명
          </Typography>
          <Typography>
            업데이트일자: {dateUpdated.substring(0, 10)}
          </Typography>
        </Box>
    },
    {
      field: "workGroupCalendar",
      headerName: "캘린더",
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
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
        const workHours = [];

        for (let i = 0; i < timeRangeTypeArr.length; i += 1) {
          if (timeRangeTypeArr[i] === "work") {
            workHours.push(`${startArr[i]}-${endArr[i]}`);
          } else if (timeRangeTypeArr[i] === "break") {
            breakHours.push(`${startArr[i]}-${endArr[i]}`);
          }
        }

        const workHoursTotal = getTotalHours(workHours);
        const breakHoursTotal = getTotalHours(breakHours);

        return (
          <CalendarModal groupName={name} workHourPerDay={workHoursTotal - breakHoursTotal} convertedWorkDays={convertedWorkDays} />
        );
      },
    },
    {
      field: "isOn",
      headerName: "사용여부",
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row: { isOn, numOfMembers } }) =>
        <SwitchWrapped
          isOn={isOn}
          numOfMembers={numOfMembers}
        />
    },
    {
      field: "modDelButtons",
      headerName: "수정/삭제",
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row: { id } }) =>
        <>
          <Button size="small" onClick={() => handleModify(id)}>수정</Button>
          <Button size="small" onClick={() => handleDelete(id)}>삭제</Button>
        </>
    },
  ]

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

export default WorkGroupListPage;