import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
} from '@mui/material';
// components
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/privilege';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: '이름', alignRight: false },
  { id: 'depart', label: '부서', alignRight: false },
  { id: 'rank', label: '직급', alignRight: false },
  { id: 'phone', label: '전화번호', alignRight: false },
  { id: 'id', label: '사원번호', alignRight: false },
  { id: 'date', label: '입사일', alignRight: false },
  { id: 'AccessLevel', label: '권한', alignRight: false },
  { id: '' },
];

const MODAL_HEAD = [
  { id: 'name', label: '이름', alignRight: false },
  { id: 'depart', label: '부서', alignRight: false },
  { id: 'rank', label: '직급', alignRight: false },
  { id: 'id', label: '사원번호', alignRight: false },
  { id: 'date', label: '입사일', alignRight: false },
  { id: 'AccessLevel', label: '권한', alignRight: false },
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
    // 콤마(,)로 구분된 id들을 배열로 변환
    const queryIds = query.split(',').map((id) => id.trim());

    // 필터링된 사용자 목록을 저장할 배열
    const filteredUsers = [];

    // 각 id에 대해 사용자를 조회하여 필터링된 배열에 추가
    queryIds.forEach((queryId) => {
      const filteredUser = array.find((_user) => _user.id.toString() === queryId);
      if (filteredUser) {
        filteredUsers.push(filteredUser);
      }
    });

    return filteredUsers;
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function PrivilegePage() {
  const [open, setOpen] = useState(null);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // 선택된 사용자들을 관리하는 상태와 함수들을 새로운 상태와 함수들로 분리

  const [modalPage, setModalPage] = useState(0);
  const [rowsModalPerPage, setRowsModalPerPage] = useState(5);
  const [modalFilterName, setModalFilterName] = useState('');
  const [modalSelected, setModalSelected] = useState([]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    resetFilterAndSelection(); // 팝업창 이동 시 검색어와 선택된 사용자 초기화
    setOpen(null);
  };

  // "관리자 추가" 버튼 클릭 시 실행되는 함수
  const handleOpenNewUserDialog = () => {
    resetFilterAndSelection(); // 팝업창 열릴 때 검색어와 선택된 사용자 초기화
    setIsNewUserDialogOpen(true);
  };

  // "취소" 버튼 클릭 시 실행되는 함수
  const handleCloseNewUserDialog = () => {
    resetFilterAndSelection(); // 팝업창 이동 시 검색어와 선택된 사용자 초기화
    setIsNewUserDialogOpen(false);
  };

  // "저장" 버튼 클릭 시 실행되는 함수
  const handleSaveNewUserDialog = () => {
    // 여기에 관리자 추가 로직을 구현하면 됩니다.
    // ...
    setIsNewUserDialogOpen(false); // 팝업 닫기
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredAdminUsers.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleModalSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredModalUsers.map((n) => n.name);
      setModalSelected(newSelecteds);
      return;
    }
    setModalSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleModalClick = (event, name) => {
    const selectedIndex = modalSelected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(modalSelected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(modalSelected.slice(1));
    } else if (selectedIndex === modalSelected.length - 1) {
      newSelected = newSelected.concat(modalSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(modalSelected.slice(0, selectedIndex), modalSelected.slice(selectedIndex + 1));
    }
    setModalSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleModalChangePage = (event, newPage) => {
    setModalPage(newPage);
  };

  const handleChangeModalRowsPerPage = (event) => {
    setModalPage(0);
    setRowsModalPerPage(parseInt(event.target.value, 10));
  };

  const handleModalFilterByName = (event) => {
    setModalPage(0);
    setModalFilterName(event.target.value);
  };

  const filteredAdminUsers = applySortFilter(
    USERLIST.filter((user) => user.AccessLevel === '관리자'), // '관리자'인 사용자만 필터링
    getComparator(order, orderBy),
    filterName
  );

  const filteredModalUsers = applySortFilter(
    USERLIST.filter((user) => user.AccessLevel === '사원'), // '사원'인 사용자만 필터링
    getComparator(order, orderBy),
    modalFilterName
  );

  const resetFilterAndSelection = () => {
    setFilterName(''); // 검색어 초기화
    setSelected([]); // 선택된 사용자들 초기화
    setModalFilterName(''); // 팝업창의 검색어 초기화
    setModalSelected([]); // 팝업창의 선택된 사용자들 초기화
  };

  const emptyAdminRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredAdminUsers.length) : 0;
  const emptyModalRows =
    modalPage > 0 ? Math.max(0, (1 + modalPage) * rowsModalPerPage - filteredModalUsers.length) : 0;

  const isNotFound = !filteredAdminUsers.length && !!filterName;
  const isModalNotFound = !filteredModalUsers.length && !!modalFilterName;

  const modalStyle = {
    // 팝업창의 넓이를 원하는 값으로 지정합니다. 필요에 따라 변경할 수 있습니다.
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            관리자 목록
          </Typography>
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenNewUserDialog}>
            관리자 추가
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredAdminUsers.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  disableCheckbox
                />
                <TableBody>
                  {filteredAdminUsers
                    .filter((user) => user.AccessLevel === '관리자') // '관리자'인 사용자만 필터링
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { name, depart, rank, phone, id, date, AccessLevel } = row;

                      return (
                        <TableRow key={name}>
                          <TableCell align="left">
                            {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} /> */}
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{depart}</TableCell>

                          <TableCell align="left">{rank}</TableCell>

                          <TableCell align="left">{phone}</TableCell>

                          <TableCell align="left">{id}</TableCell>

                          <TableCell align="left">{date}</TableCell>

                          <TableCell align="left">
                            {AccessLevel === '관리자' ? (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <SupervisorAccountIcon sx={{ fontSize: 18 }} />
                                <Label color="success">관리자</Label>
                              </Stack>
                            ) : (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <PersonIcon sx={{ fontSize: 18 }} />
                                <Label color="default">사원</Label>
                              </Stack>
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyAdminRows > 0 && (
                    <TableRow style={{ height: 53 * emptyAdminRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="left" colSpan={6} sx={{ py: 3 }}>
                        <Paper sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" paragraph>
                            검색결과가 없습니다.
                          </Typography>

                          <Typography variant="body2">
                            다음 검색에 대한 결과를 찾을 수 없습니다.&nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> 사용자의 이름을 다시 한번 확인해주세요.
                          </Typography>
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
            count={filteredAdminUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="페이지당 사원 수 :"
            labelDisplayedRows={({ count }) =>
              `현재 페이지: ${page + 1} / 전체 페이지: ${Math.ceil(count / rowsPerPage)}`
            }
          />
        </Card>
      </Container>
      {/* 기존 팝업 메뉴 */}
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
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          수정
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          삭제
        </MenuItem>
      </Popover>

      {/* 새로운 사용자 목록 팝업 */}
      <Modal
        open={isNewUserDialogOpen}
        onClose={handleCloseNewUserDialog}
        style={modalStyle} // 스크롤 적용 스타일 적용
        contentLabel="새로운 사용자 목록 팝업"
      >
        {/* Scrollbar 대신 MUI의 Dialog 컴포넌트 사용 */}
        <Dialog open={isNewUserDialogOpen} onClose={handleCloseNewUserDialog} maxWidth="md" maxHeight="lg">
          <DialogTitle>관리자 추가</DialogTitle>
          <DialogContent dividers>
            <UserListToolbar
              numSelected={modalSelected.length}
              filterName={modalFilterName}
              onFilterName={handleModalFilterByName}
            />
            <TableContainer>
              <Table
                sx={{ minWidth: 500, minHeight: 400, display: 'block', alignItems: 'start', justifyContent: 'start' }}
              >
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={MODAL_HEAD}
                  rowCount={filteredModalUsers.length}
                  numSelected={modalSelected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleModalSelectAllClick}
                />
                <TableBody>
                  {filteredModalUsers
                    .filter((user) => user.AccessLevel === '사원') // '사원'인 사용자만 필터링
                    .slice(modalPage * rowsModalPerPage, modalPage * rowsModalPerPage + rowsModalPerPage)
                    .map((row) => {
                      const { name, depart, rank, id, date, AccessLevel } = row;

                      const selectedModalUser = modalSelected.indexOf(name) !== -1;

                      return (
                        <TableRow key={name}>
                          <TableCell align="left">
                            <Checkbox checked={selectedModalUser} onChange={(event) => handleModalClick(event, name)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{depart}</TableCell>

                          <TableCell align="left">{rank}</TableCell>

                          <TableCell align="left">{id}</TableCell>

                          <TableCell align="left">{date}</TableCell>

                          <TableCell align="left">
                            {AccessLevel === '관리자' ? (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <SupervisorAccountIcon sx={{ fontSize: 18 }} />
                                <Label color="success">관리자</Label>
                              </Stack>
                            ) : (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <PersonIcon sx={{ fontSize: 18 }} />
                                <Label color="default">사원</Label>
                              </Stack>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyModalRows > 0 && (
                    <TableRow style={{ height: 53 * emptyModalRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isModalNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper sx={{ textAlign: 'center', minWidth: 478 }}>
                          <Typography variant="h6" paragraph>
                            검색결과가 없습니다.
                          </Typography>

                          <Typography variant="body2">
                            다음 검색에 대한 결과를 찾을 수 없습니다.&nbsp;
                            <strong>&quot;{modalFilterName}&quot;</strong>.
                            <br /> 사용자의 이름을 다시 한번 확인해주세요.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewUserDialog} color="primary">
              취소
            </Button>
            <Button onClick={handleSaveNewUserDialog} color="primary">
              저장
            </Button>
          </DialogActions>
          {/* 페이징 기능 추가 */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredModalUsers.length}
            rowsPerPage={rowsModalPerPage}
            page={modalPage}
            onPageChange={handleModalChangePage}
            onRowsPerPageChange={handleChangeModalRowsPerPage}
            labelRowsPerPage="페이지당 사원 수 :"
            labelDisplayedRows={({ count }) =>
              `현재 페이지: ${modalPage + 1} / 전체 페이지: ${Math.ceil(count / rowsModalPerPage)}`
            }
          />
        </Dialog>
      </Modal>
    </>
  );
}
