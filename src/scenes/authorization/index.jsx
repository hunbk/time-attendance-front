import { useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AccessibilityOutlined from '@mui/icons-material/AccessibilityOutlined';
import Header from "../../components/Header";

//id, name, depart, rank, workType
const Authorization = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedRows, setSelectedRows] = useState([]); // 선택한 행을 저장하는 상태 변수 추가

  const columns = [
    { field: "id", headerName: "사원번호", headerAlign: "center", align: "center" },
    {
      field: "name",
      headerName: "이름",
      cellClassName: "name-column--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "휴대전화",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "depart",
      headerName: "부서",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rank",
      headerName: "직급",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "AccessLevel",
      headerName: "접근권한",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row: { AccessLevel } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={AccessLevel === "관리자" ? colors.greenAccent[700] : colors.grey[700]}
            borderRadius="4px"
          >
            {AccessLevel === "관리자" && <AdminPanelSettingsOutlinedIcon />}
            {AccessLevel === "사원" && <AccessibilityOutlined />}
            {AccessLevel === "유저" && <AccessibilityOutlined />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {AccessLevel}
            </Typography>
          </Box>
        );
      },
    },
  ];
  const handleSelectionModelChange = (selectionModel) => {
    setSelectedRows(selectionModel); // 선택된 행을 저장

    // 선택된 행을 alert로 띄우는 부분을 주석 처리하거나 삭제

    // const selectedRows = selectionModel.map((index) => mockDataTeam[index - 1].name);
    // alert(selectedRows);
  };

  const handleGrantAccess = () => {
    // "권한부여" 버튼 클릭 시 선택된 행을 alert로 띄우기
    const selectedRowNames = selectedRows.map((index) => mockDataTeam[index - 1].name);
    alert(selectedRowNames);
  };

  return (
    <Box m="20px">
      <Header title="권한부여" subtitle="사원에게 권한부여" />
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
            color: `${colors.greenAccent[400]} !important`,
          },
        }}
      >
        <Box mb="20px">
          <Button variant="contained" onClick={handleGrantAccess}>
            권한부여
          </Button>
        </Box>
        <DataGrid checkboxSelection onSelectionModelChange={handleSelectionModelChange} rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Authorization;
