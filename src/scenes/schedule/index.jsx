import { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";

import Calendar from "./Calendar";

const Schedule = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const columns = [
    {
      field: "date",
      headerName: "근무 일자",
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    { field: "name", headerName: "이름", headerAlign: "center", align: "center", cellClassName: "name-column--cell", flex: 1 },
    { field: "depart", headerName: "부서", headerAlign: "center", align: "center" },
    { field: "rank", headerName: "직급", headerAlign: "center", align: "center" },
    { field: "workType", headerName: "근무제유형", headerAlign: "center", align: "center", flex: 1 },
    { field: "workStart", headerName: "근무시작시간", type: "time", headerAlign: "center", align: "center" },
    { field: "workEnd", headerName: "근무종료시간", type: "time", headerAlign: "center", align: "center" },
    { field: "workHour", headerName: "소정근무시간", type: "time", headerAlign: "center", align: "center" },
    {
      field: "workState",
      headerName: "처리상태",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row: { workState } }) => {
        return (
          <Box
            width="70%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={workState === "정상처리" ? colors.greenAccent[700] : colors.grey[700]}
            borderRadius="120px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: "0px", fontSize: "12px" }}>
              {workState}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="근무스케줄" />
      <Calendar startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Schedule;
