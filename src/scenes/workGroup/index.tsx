import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataWorkGroup } from "../../data/mockData";
import Header from "../../components/Header";
import type { GridColDef } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import CalendarModal from "../../components/CalendarModal";
import SwitchWrapped from "../../components/SwitchWrapped";
import { useNavigate } from "react-router-dom";

type mockDataWorkGroupType = {
  id: number;
  name: string;
  type: string;
  workDay: Array<string>;
  hasHoliday: boolean;
  payLeaveSat: boolean;
  payLeaveSun: boolean;
  workHour: string;
  breakTime: Array<string>;
  workHourCompulsory: Array<string>;
  workHourOvertime: string;
  hasRecordRestriction: boolean;
  recordRestrictionMethod: string;
  isOn: boolean;
  additionalWorkStartTime: Array<string>;
};

const WorkGroup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns: GridColDef<mockDataWorkGroupType>[] = [
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
              {type}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "workHourSummary",
      headerName: "근무시간 요약",
      flex: 1,
      renderCell: ({ row: { workHour, breakTime } }) => {
        return (
          <Box>
            <Typography>
              근무시간 {workHour}
            </Typography>
            <Typography>
              휴식시간 {breakTime}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "workGroupSummary",
      headerName: "그룹정보",
      flex: 1,
      renderCell: () => {
        return (
          <Box>
            <Typography>
              인원: ?명
            </Typography>
            <Typography>
              업데이트일자: ????.??.??
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "workGroupCalendar",
      headerName: "캘린더",
      flex: 1,
      renderCell: ({ row: { name, workHour, breakTime } }) => {
        return (
          <CalendarModal groupName={name} workHour={workHour} breakTime={breakTime} />
        );
      },
    },
    {
      field: "isOn",
      headerName: "사용여부",
      flex: 1,
      renderCell: ({ row: { isOn } }) => {
        return (
          <SwitchWrapped
            isOn={isOn}
          />
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="WORK GROUP" subtitle="WORK GROUP LIST" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <Button variant="outlined" onClick={() => {
          navigate("/workGroup/newGroup");
        }}>근로그룹 추가하기</Button>
        <DataGrid checkboxSelection rows={mockDataWorkGroup} columns={columns} />

      </Box>
    </Box>
  );
};

export default WorkGroup;
