import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Table,
  Stack,
  Paper,
  Avatar,
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
  Snackbar,
} from '@mui/material';
// components
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/privilege';
import PrivilegeModal from './PrivilegeModal';
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
  const [deleteSnackbar, setDeleteSnackbar] = useState(false);
  const [saveSnackbar, setSaveSnackbar] = useState(false);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // 선택된 사용자들을 관리하는 상태와 함수들을 새로운 상태와 함수들로 분리
  const [isSearched, setIsSearched] = useState(false); // 검색 버튼을 눌렀는지 여부를 저장하는 상태

  const [editUserId, setEditUserId] = useState(null);

  const [privilegeModalOpen, setPrivilegeModalOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [filteredAdminUsers, setFilteredAdminUsers] = useState(
    USERLIST.filter((user) => user.AccessLevel === '관리자')
  );

  const filterAdmin = applySortFilter(
    USERLIST.filter((user) => user.AccessLevel === '관리자'), // '관리자'인 사용자만 필터링
    getComparator(order, orderBy),
    filterName
  );

  const handleOpenModal = () => {
    setPrivilegeModalOpen(true);
  };

  const handleCloseModal = () => {
    setPrivilegeModalOpen(false);
    handleCloseMenu();
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    const searchQuery = event.target.value;
    setFilterName(searchQuery);
    setPage(0);
    setRowsPerPage(5);

    // 검색창에 아무것도 입력하지 않았을 때,
    if (!searchQuery) {
      setIsSearched(false);
      setFilteredAdminUsers(USERLIST.filter((user) => user.AccessLevel === '관리자'));
    } else {
      if (isSearched) {
        setFilteredAdminUsers(filterAdmin);
      }
    }
  };

  const resetFilterAndSelection = () => {
    setFilterName(''); // 검색어 초기화
    setSelected([]); // 선택된 사용자들 초기화
  };

  // Snackbar 열기 함수
  const handleOpenSnackbar = () => {
    setDeleteSnackbar(true);
  };

  // Snackbar 닫기 함수
  const handleCloseSnackbar = () => {
    setDeleteSnackbar(false);
  };

  const handleOpenSaveSnackbar = () => {
    setSaveSnackbar(true);
  };

  const handleSearch = (search) => {
    setIsSearched(true);
    const searchResult = applySortFilter(
      USERLIST.filter((user) => user.AccessLevel === '관리자'),
      getComparator(order, orderBy),
      search
    );

    setFilterName(search);
    setPage(0);
    setRowsPerPage(5);
    setFilteredAdminUsers(searchResult);
  };

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setEditUserId(row.id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleConfirmDeleteOpen = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    // 여기에 삭제 로직을 구현하세요.
    // 예를 들어, 선택된 사용자를 삭제하고 관련 상태를 업데이트하는 등의 작업을 수행할 수 있습니다.

    // 삭제 완료 후 삭제 확인 창을 닫습니다.
    setDeleteConfirmOpen(false);
  };

  const emptyAdminRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredAdminUsers.length) : 0;
  const isNotFound = !filteredAdminUsers.length && !!filterName;

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
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onSearch={handleSearch}
          />
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
                  disableBox
                />
                <TableBody>
                  {filterAdmin.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { name, depart, rank, phone, id, date, AccessLevel } = row;

                    return (
                      <TableRow key={name}>
                        {/* <TableCell>{}</TableCell> */}
                        <TableCell component="th" scope="row" padding="none" >
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ justifyContent: 'center' }}>
                            <Avatar alt={name} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="center">{depart}</TableCell>

                        <TableCell align="center">{rank}</TableCell>

                        <TableCell align="center">{phone}</TableCell>

                        <TableCell align="center">{id}</TableCell>

                        <TableCell align="center">{date}</TableCell>

                        <TableCell align="center">
                          {AccessLevel === '관리자' ? (
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: 'center' }}>
                              <SupervisorAccountIcon sx={{ fontSize: 18 }} />
                              <Label color="success">관리자</Label>
                            </Stack>
                          ) : (
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: 'center' }}>
                              <PersonIcon sx={{ fontSize: 18 }} />
                              <Label color="default">사원</Label>
                            </Stack>
                          )}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => {
                              handleOpenMenu(event, row);
                            }}
                          >
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

        <PrivilegeModal open={privilegeModalOpen} onClose={handleCloseModal} editUserId={editUserId} />

        <MenuItem onClick={handleConfirmDeleteOpen} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          삭제
        </MenuItem>
      </Popover>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <Typography>해당 사원을 관리자에서 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleConfirmDeleteClose();
              handleOpenSnackbar();
              handleCloseMenu();
            }}
            color="error"
          >
            삭제
          </Button>
          <Button
            onClick={() => {
              setDeleteConfirmOpen(false);
              handleCloseMenu();
            }}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={deleteSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ width: 400 }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          삭제되었습니다!
        </Alert>
      </Snackbar>
    </>
  );
}
