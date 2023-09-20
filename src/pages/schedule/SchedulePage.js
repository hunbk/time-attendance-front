import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Box,
  Button,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  LinearProgress,
} from '@mui/material';
// components
import { enqueueSnackbar } from 'notistack';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { SettleListHead, SettleListToolbar } from '../../sections/@dashboard/settlement';
import ScheduleModal from './ScheduleModal';
import Swal from 'sweetalert2';
import './Schedule.css';

// LoginAxios
import loginAxios from '../../api/loginAxios';

// 유저 상태
import { useAuthState } from '../../context/AuthProvider';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: '근무일자' },
  { id: 'userId', label: '사원번호' },
  { id: 'name', label: '이름' },
  { id: 'position', label: '직급' },
  { id: 'workGroupType', label: '근무제유형' },
  { id: 'start', label: '근무시작시간' },
  { id: 'end', label: '근무종료시간' },
  { id: 'workingTime', label: '소정근무시간' },
  { id: 'overTime', label: '연장근무시간' },
  { id: 'workState', label: '처리상태' },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    // 각 id에 대해 사용자를 조회하여 필터링된 배열에 추가
    const filteredUser = array.filter((_user) => _user.name.includes(query));
    return filteredUser;
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SchedulePage() {
  // 로그인 한 유저 정보
  const { user } = useAuthState();

  // 회원 목록
  const [users, setUsers] = useState([]);

  // 회사 목록 조회 API
  const getUserList = async () => {
    const start = startDate.toISOString().substring(0, 10);
    const end = endDate.toISOString().substring(0, 10);
    const res = await loginAxios.get(`/api/settlements?companyId=${user.companyId}&start=${start}&end=${end}`);
    setUsers(res.data);
    setFilteredUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    getUserList();
  }, []);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filteredUsers, setFilteredUsers] = useState(users);

  const [settlementIds, setSettlementIds] = useState(null);

  // 기본적으로 Calendar 숨기고 open하면 Date에 new Date() 설정함
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isSearched, setIsSearched] = useState(false); // 검색 버튼을 눌렀는지 여부를 저장하는 상태

  // 수정 대상 회원의 id를 저장
  const [userData, setUserData] = useState([]);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDeleteConfirmOpen = () => {
    Swal.fire({
      icon: 'warning',
      title: '삭제하시겠습니까?',
      html: '<strong>해당 정보는 차후 정산에 영향을 미칠 수 있습니다.<br>다시 한 번 확인해주세요.</strong>',
      showConfirmButton: false,
      showCancelButton: true,
      showDenyButton: true,
      denyButtonText: `삭제`,
      cancelButtonText: `취소`,
      reverseButtons: true,
      customClass: {
        container: 'custom-swal', // SweetAlert2 팝업의 컨테이너 클래스 설정
      },
    }).then((result) => {
      if (result.isDenied) {
        handleCloseMenu();
        handleDeleteSnackbar();
      }
    });
  };

  const handleDeleteSnackbar = () => {
    enqueueSnackbar(`삭제되었습니다!`, { variant: 'success' });
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };

  const handleDelete = async () => {
    await loginAxios.delete('/api/settlements', settlementIds);
    handleOpenSnackbar();
    handleDeleteConfirmClose();
  };

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setSettlementIds(row.settlementId);
    console.log(row);
    console.log(settlementIds);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (name) => {
    setFilterName(name);
    setPage(0);

    // 검색창에 아무것도 입력하지 않았을 때는 전체 목록을 보여줍니다.
    if (name !== null || name === '') {
      setIsSearched(false); // 검색 버튼을 누르지 않은 경우이므로 isSearched 상태를 false로 설정합니다.
      setFilteredUsers(users); // 전체 목록을 보여주기 위해 filteredUsers 상태를 USERLIST로 초기화합니다.
    } else {
      // 검색 버튼을 눌렀을 때만 실시간으로 결과가 나오도록 로직을 실행합니다.
      if (isSearched) {
        const filteredUsers = users.filter((user) => user.name.includes(name));
        setFilteredUsers(filteredUsers);
      }
    }
  };

  // date를 원하는 형식으로 변환하는 함수
  const formatDate = (params) => {
    const date = new Date(params); // 문자열 형식의 date를 Date 객체로 변환
    return date.toLocaleDateString(); // 날짜 형식으로 출력
  };

  const isNotFound = !filteredUsers.filter((user) => user.name.includes(filterName)).length && !!filterName;

  const filterUser = applySortFilter(filteredUsers, getComparator(order, orderBy), filterName);

  // Snackbar 열기 함수
  const handleOpenSnackbar = () => {
    enqueueSnackbar(`삭제되었습니다!`, { variant: 'error' });
  };

  const handleOpenModal = () => {
    if (userData.workState === '미처리') {
      Swal.fire({
        icon: 'error',
        html: '<strong>해당 정산은 직접 수정할 수 없습니다!<br> 서비스 관리자에게 재정산을 요청하세요!</strong>',
        confirmButtonText: '확인',
        confirmButtonColor:'#2065D1',
        customClass: {
          container: 'custom-swal',
        },
      });
      handleCloseMenu();
    } else {
      setScheduleModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setScheduleModalOpen(false);
    handleCloseMenu();
  };

  const formatTimeToTime = (time) => {
    if (time !== null) {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    }
    return `-`;
  };

  useEffect(() => {
    getUserList();
  }, [startDate, endDate]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Box width="50%">
          <LinearProgress color="primary" />
        </Box>
      </Box>
    );

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            정산목록
          </Typography>
        </Stack>
        <Card>
          <SettleListToolbar
            numSelected={selected.length}
            onFilterName={handleFilterByName}
            startDate={startDate} // Calendar 컴포넌트로부터 받아온 startDate를 전달합니다.
            endDate={endDate} // Calendar 컴포넌트로부터 받아온 endDate를 전달합니다.
            setStartDate={setStartDate} // Calendar 컴포넌트로부터 받아온 setStartDate를 전달합니다.
            setEndDate={setEndDate} // Calendar 컴포넌트로부터 받아온 setEndDate를 전달합니다.
          />
          {console.log(`시작일자 + ${startDate}`)}
          {console.log(`종료일자' + ${endDate}`)}

          <Scrollbar>
            <TableContainer>
              <Table size="small">
                <SettleListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredUsers.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  disableCheckbox
                />
                <TableBody>
                  {filterUser.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      settlementId,
                      date,
                      userCode,
                      startTime,
                      endTime,
                      name,
                      position,
                      workGroupType,
                      workingTime,
                      overTime,
                      workState,
                      startWork,
                      leaveWork,
                    } = row;

                    return (
                      <TableRow hover key={settlementId}>
                        <TableCell padding="checkbox">{}</TableCell>

                        <TableCell align="left">{formatDate(date)}</TableCell>

                        <TableCell align="left">{userCode}</TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{position}</TableCell>

                        <TableCell align="left">{workGroupType}</TableCell>

                        <TableCell align="left">{formatTimeToTime(startTime)}</TableCell>

                        <TableCell align="left">{formatTimeToTime(endTime)}</TableCell>

                        <TableCell align="left">{formatTimeToTime(workingTime)}</TableCell>

                        <TableCell align="left">{formatTimeToTime(overTime)}</TableCell>

                        <TableCell align="left">
                          {workState === '정상처리' ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Label color="info">정상처리</Label>
                            </Stack>
                          ) : workState === '근태이상' ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Label color="error">근태이상</Label>
                            </Stack>
                          ) : (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Label color="default">미처리</Label>
                            </Stack>
                          )}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="normal"
                            color="inherit"
                            onClick={(event) => {
                              handleOpenMenu(event, row);
                              setUserData(row);
                            }}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            {filterName} 사원을 찾지 못했습니다.
                          </Typography>

                          <Typography variant="body2">
                            <strong>{filterName}</strong> 사원에 대한 정보가 없습니다. &nbsp;
                            <br /> 다시 한번 사원이름을 확인해주세요.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {filteredUsers.filter((user) => user.name.includes(filterName)).length === 0 && !filterName && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            해당 목록이 존재하지 않습니다.
                          </Typography>

                          <Typography variant="body2">다시 한번 조건을 확인해주세요.</Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="페이지당 목록 수 :"
            labelDisplayedRows={({ count }) =>
              `현재 페이지: ${page + 1} / 전체 페이지: ${Math.ceil(count / rowsPerPage)}`
            }
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleOpenModal}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          수정
        </MenuItem>

        <ScheduleModal
          open={scheduleModalOpen}
          onClose={handleCloseModal}
          userData={userData}
          getUserList={getUserList}
        />

        <MenuItem onClick={handleDeleteConfirmOpen} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          삭제
        </MenuItem>
      </Popover>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>선택한 항목을 정말 삭제하시겠습니까?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            취소
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
