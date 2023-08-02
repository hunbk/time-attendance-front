import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
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
} from '@mui/material';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { SettleListHead, SettleListToolbar } from '../../sections/@dashboard/settlement';
// mock
import USERLIST from '../../_mock/privilege';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: '근무일자', alignRight: false },
  { id: 'id', label: '사원번호', alignRight: false },
  { id: 'name', label: '이름', alignRight: false },
  { id: 'depart', label: '부서', alignRight: false },
  { id: 'rank', label: '직급', alignRight: false },
  { id: 'workType', label: '근무제유형', alignRight: false },
  { id: 'workStart', label: '근무시작시간', alignRight: false },
  { id: 'workEnd', label: '근무종료시간', alignRight: false },
  { id: 'workHour', label: '소정근무시간', alignRight: false },
  { id: 'workState', label: '처리상태', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SchedulePage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filteredUsers, setFilteredUsers] = useState(applySortFilter(USERLIST, getComparator(order, orderBy), filterName));

  const [isSearched, setIsSearched] = useState(false); // 검색 버튼을 눌렀는지 여부를 저장하는 상태

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
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
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

    // 검색창에 아무것도 입력하지 않았을 때는 전체 목록을 보여줍니다.
    if (!searchQuery) {
      setIsSearched(false); // 검색 버튼을 누르지 않은 경우이므로 isSearched 상태를 false로 설정합니다.
      setFilteredUsers(USERLIST); // 전체 목록을 보여주기 위해 filteredUsers 상태를 USERLIST로 초기화합니다.
    } else {
      // 검색 버튼을 눌렀을 때만 실시간으로 결과가 나오도록 로직을 실행합니다.
      if (isSearched) {
        const searchResult = applySortFilter(USERLIST, getComparator(order, orderBy), searchQuery);
        setFilteredUsers(searchResult);
      }
    }
  };

  // date를 원하는 형식으로 변환하는 함수
  const formatDate = (params) => {
    const date = new Date(params); // 문자열 형식의 date를 Date 객체로 변환
    return date.toLocaleDateString(); // 날짜 형식으로 출력
  };

  const handleSearch = (searchQuery) => {
    setIsSearched(true); // 검색 버튼을 눌렀을 때에만 결과값을 표시하기 위해 상태를 업데이트합니다.

    // 검색어를 기반으로 사용자 목록을 필터링합니다.
    const searchResult = applySortFilter(USERLIST, getComparator(order, orderBy), searchQuery);

    // 필터링된 결과를 화면에 표시하기 위해 filteredUsers 상태를 업데이트합니다.
    setFilterName(searchQuery); // 검색어를 입력창에 표시하기 위해 filterName 상태를 업데이트합니다.
    setPage(0); // 현재 페이지를 0으로 초기화합니다.
    setRowsPerPage(5); // rowsPerPage를 초기 값으로 설정합니다.
    setFilteredUsers(searchResult);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  // const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            정산목록
          </Typography>
        </Stack>

        <Card>
          <SettleListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onSearch={handleSearch}
          />
          <Scrollbar>
            <TableContainer>
              <Table>
                <SettleListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  disableCheckbox
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { date, id, name, depart, rank, workType, workStart, workEnd, workHour, workState } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id}>
                        <TableCell padding="checkbox">{}</TableCell>

                        <TableCell align="left">{formatDate(date)}</TableCell>

                        <TableCell align="left">{id}</TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{depart}</TableCell>

                        <TableCell align="left">{rank}</TableCell>

                        <TableCell align="left">{workType}</TableCell>

                        <TableCell align="left">{workStart}</TableCell>

                        <TableCell align="left">{workEnd}</TableCell>

                        <TableCell align="left">{workHour}</TableCell>

                        <TableCell align="left">{workState}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
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
                            해당 사원을 찾지 못했습니다.
                          </Typography>

                          <Typography variant="body2">
                            해당 사원에 대한 정보가 없습니다. &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> 다시 한번 검색어를 확인해주세요.
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
            count={filteredUsers.length}
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
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
