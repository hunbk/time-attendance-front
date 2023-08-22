import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Table,
  Stack,
  Paper,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  Avatar,
  Snackbar,
  Alert,
  Container,
  Card,
  Select,
  MenuItem,
} from '@mui/material';
// components
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/privilege';
// ----------------------------------------------------------------------

const LIST_HEAD = [
  { id: 'name', label: '이름', alignRight: false },
  { id: 'depart', label: '부서', alignRight: false },
  { id: 'rank', label: '직급', alignRight: false },
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
  { id: 'AccessLevel', label: '권한', alignRight: false },
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

export default function PrivilegeAdd() {
  const [modalPage, setModalPage] = useState(0);
  const [rowsModalPerPage, setRowsModalPerPage] = useState(5);
  const [modalFilterName, setModalFilterName] = useState('');
  const [modalSelected, setModalSelected] = useState([]);
  const [saveSnackbar, setSaveSnackbar] = useState(false);
  const [nullSnackbar, setNullSnackbar] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  // 선택된 사용자들을 관리하는 상태와 함수들을 새로운 상태와 함수들로 분리

  const [isModalSearched, setIsModalSearched] = useState(false); // 검색 버튼을 눌렀는지 여부를 저장하는 상태

  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const [selectedAdminType, setSelectedAdminType] = useState('사원'); // selectedAdminType 상태 추가

  const [filteredModalUsers, setFilteredModalUsers] = useState(
    USERLIST.filter((user) => user.AccessLevel === '사원') // '사원'인 사용자만 필터링
  );

  const filterUser = applySortFilter(
    USERLIST.filter((user) => user.AccessLevel === '사원'), // '사원'인 사용자만 필터링
    getComparator(order, orderBy),
    modalFilterName
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleModalSelectAllClick = (event) => {
    if (isModalSearched) {
      if (event.target.checked) {
        const newSelecteds = filteredModalUsers.map((n) => n.name);
        setModalSelected(newSelecteds);
      } else {
        setModalSelected([]);
      }
    } else {
      if (event.target.checked) {
        const newSelecteds = USERLIST.filter((user) => user.AccessLevel === '사원').map((n) => n.name);
        setModalSelected(newSelecteds);
      } else {
        setModalSelected([]);
      }
    }
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

  const handleModalChangePage = (event, newPage) => {
    setModalPage(newPage);
  };

  const handleChangeModalRowsPerPage = (event) => {
    setModalPage(0);
    setRowsModalPerPage(parseInt(event.target.value, 10));
  };

  const handleModalFilterByName = (event) => {
    const searchQuery = event.target.value;
    setModalFilterName(searchQuery);
    setModalPage(0);
    setRowsModalPerPage(5);

    // 검색창에 아무것도 입력하지 않았을 때,
    if (!searchQuery) {
      setIsModalSearched(false);
      setFilteredModalUsers(USERLIST.filter((user) => user.AccessLevel === '사원'));
    } else {
      if (isModalSearched) {
        setFilteredModalUsers(filterUser);
      }
    }
  };

  const resetFilterAndSelection = () => {
    setModalFilterName(''); // 팝업창의 검색어 초기화
    setModalSelected([]); // 팝업창의 선택된 사용자들 초기화
    onClose();
  };

  const handleCloseSaveSnackbar = () => {
    setSaveSnackbar(false);
  };

  const handleOpenSaveSnackbar = () => {
    setSaveSnackbar(true);
  };

  const handleOpenNullSnackbar = () => {
    setNullSnackbar(true);
  };

  const handleCloseNullSnackbar = () => {
    setNullSnackbar(false);
  };

  const handleModalSearch = (search) => {
    setIsModalSearched(true);
    const searchResult = applySortFilter(
      USERLIST.filter((user) => user.AccessLevel === '사원'),
      getComparator(order, orderBy),
      search
    );
    setModalFilterName(search);
    setModalPage(0);
    setRowsModalPerPage(5);
    setFilteredModalUsers(searchResult);
  };

  const handleSaveConfirmOpen = () => {
    setSaveConfirmOpen(true);
  };

  const handleSaveConfirmClose = () => {
    // 여기에 삭제 로직을 구현하세요.
    // 예를 들어, 선택된 사용자를 삭제하고 관련 상태를 업데이트하는 등의 작업을 수행할 수 있습니다.

    // 삭제 완료 후 삭제 확인 창을 닫습니다.
    setSaveConfirmOpen(false);
  };

  const handleSelectedAdminType = () => {
    setSelectedAdminType('사원');
  };

  const emptyModalRows =
    modalPage > 0 ? Math.max(0, (1 + modalPage) * rowsModalPerPage - filteredModalUsers.length) : 0;

  const isModalNotFound = !filteredModalUsers.length && !!modalFilterName;

  const modalStyle = {
    // 팝업창의 넓이를 원하는 값으로 지정합니다. 필요에 따라 변경할 수 있습니다.
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  // ... (필요한 함수들과 상태들을 PrivilegeModal 컴포넌트로 옮길 수 있습니다)

  return (
    <>
      <Helmet>
        <title>관리자 추가</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            사원 목록
          </Typography>
        </Stack>
        <Card>
          <UserListToolbar
            numSelected={modalSelected.length}
            filterName={modalFilterName}
            onFilterName={handleModalFilterByName}
            onSearch={handleModalSearch}
          />
          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={LIST_HEAD}
                  rowCount={filteredModalUsers.length}
                  numSelected={modalSelected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleModalSelectAllClick}
                  disableCheckbox
                />
                <TableBody>
                  {filterUser
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
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ justifyContent: 'center' }}>
                              <Avatar alt={name} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="center">{depart}</TableCell>

                          <TableCell align="center">{rank}</TableCell>

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
          </Scrollbar>

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
        </Card>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            onClick={() => {
              if (modalSelected !== null && modalSelected.length !== 0) {
                handleSaveConfirmOpen();
              } else {
                // modalSelected가 null일 때 경고창 띄우기
                handleOpenNullSnackbar();
              }
            }}
            variant="contained"
          >
            추가
          </Button>
          <Button
            onClick={() => {
              resetFilterAndSelection();
              handleCloseSaveSnackbar();
            }}
            variant="outlined"
          >
            취소
          </Button>
        </Box>
      </Container>

      <DialogActions>
        <Snackbar
          open={saveSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSaveSnackbar}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{ width: 400 }}
        >
          <Alert onClose={handleCloseSaveSnackbar} severity="success" sx={{ width: '100%' }}>
            관리자로 변경되었습니다!
          </Alert>
        </Snackbar>

        <Snackbar
          open={nullSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseNullSnackbar}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{ width: 400 }}
        >
          <Alert onClose={handleCloseNullSnackbar} severity="error" sx={{ width: '100%' }}>
            선택한 사원이 없습니다!
          </Alert>
        </Snackbar>
      </DialogActions>

      <Dialog open={saveConfirmOpen} onClose={() => setSaveConfirmOpen(false)} minWidth="sm">
        <DialogTitle>관리자 권한 부여</DialogTitle>
        <DialogContent>
          <Typography>선택한 사원들에게 어떤 권한을 부여하시겠습니까?</Typography>

          {/* 드롭다운 메뉴 */}
          <Select
            value={selectedAdminType}
            onChange={(event) => setSelectedAdminType(event.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="HR">인사 관리</MenuItem>
            <MenuItem value="FO">재무 관리</MenuItem>
          </Select>
          {modalSelected.length > 0 && (
            <TableContainer>
              <Table>
                <UserListHead
                  order={order}
                  headLabel={MODAL_HEAD}
                  rowCount={filteredModalUsers.length}
                  numSelected={modalSelected.length}
                  disableBox
                />
                <TableBody>
                  {modalSelected.map((selectedUser) => {
                    const user = filteredModalUsers.find((u) => u.name === selectedUser);
                    if (user) {
                      return (
                        <TableRow key={user.name}>
                          <TableCell align="center" component="th" scope="row" padding="5">
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ justifyContent: 'center' }}>
                              <Avatar alt={user.name} />
                              <Typography variant="subtitle2" noWrap>
                                {user.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">{user.depart}</TableCell>
                          <TableCell align="center">{user.rank}</TableCell>
                          <TableCell align="center">{user.id}</TableCell>
                          <TableCell align="center">
                            {user.AccessLevel === '관리자' ? (
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

                          {/* ... 추가 사용자 정보 열 */}
                        </TableRow>
                      );
                    }
                    return null;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleOpenSaveSnackbar();
              handleSelectedAdminType();
              setModalSelected([]);
              handleSaveConfirmClose();
            }}
            variant="contained"
          >
            추가
          </Button>
          <Button onClick={() => setSaveConfirmOpen(false)} variant="outlined">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </>

    // <DialogTitle>관리자 추가</DialogTitle>
    // <DialogContent dividers>
    //   <UserListToolbar
    //     numSelected={modalSelected.length}
    //     filterName={modalFilterName}
    //     onFilterName={handleModalFilterByName}
    //     onSearch={handleModalSearch}
    //   />
    //   <TableContainer>
    //     <Table
    //       sx={{ minWidth: 500, minHeight: 400, display: 'block', alignItems: 'start', justifyContent: 'start' }}
    //     >
    //       <UserListHead
    //         order={order}
    //         orderBy={orderBy}
    //         headLabel={MODAL_HEAD}
    //         rowCount={filteredModalUsers.length}
    //         numSelected={modalSelected.length}
    //         onRequestSort={handleRequestSort}
    //         onSelectAllClick={handleModalSelectAllClick}
    //       />
    // <TableBody>
    //   {filterUser
    //     .slice(modalPage * rowsModalPerPage, modalPage * rowsModalPerPage + rowsModalPerPage)
    //     .map((row) => {
    //       const { name, depart, rank, id, date, AccessLevel } = row;

    //       const selectedModalUser = modalSelected.indexOf(name) !== -1;

    //       return (
    //         <TableRow key={name}>
    //           <TableCell align="left">
    //             <Checkbox checked={selectedModalUser} onChange={(event) => handleModalClick(event, name)} />
    //           </TableCell>

    //           <TableCell component="th" scope="row" padding="none">
    //             <Stack direction="row" alignItems="center" spacing={2}>
    //               <Typography variant="subtitle2" noWrap>
    //                 {name}
    //               </Typography>
    //             </Stack>
    //           </TableCell>

    //           <TableCell align="left">{depart}</TableCell>

    //           <TableCell align="left">{rank}</TableCell>

    //           <TableCell align="left">{id}</TableCell>

    //           <TableCell align="left">{date}</TableCell>

    //           <TableCell align="left">
    //             {AccessLevel === '관리자' ? (
    //               <Stack direction="row" alignItems="center" spacing={1}>
    //                 <SupervisorAccountIcon sx={{ fontSize: 18 }} />
    //                 <Label color="success">관리자</Label>
    //               </Stack>
    //             ) : (
    //               <Stack direction="row" alignItems="center" spacing={1}>
    //                 <PersonIcon sx={{ fontSize: 18 }} />
    //                 <Label color="default">사원</Label>
    //               </Stack>
    //             )}
    //           </TableCell>
    //         </TableRow>
    //       );
    //     })}
    //   {emptyModalRows > 0 && (
    //     <TableRow style={{ height: 53 * emptyModalRows }}>
    //       <TableCell colSpan={6} />
    //     </TableRow>
    //   )}
    // </TableBody>

    //     {isModalNotFound && (
    //       <TableBody>
    //         <TableRow>
    //           <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
    //             <Paper sx={{ textAlign: 'center', minWidth: 478 }}>
    //               <Typography variant="h6" paragraph>
    //                 검색결과가 없습니다.
    //               </Typography>

    //               <Typography variant="body2">
    //                 다음 검색에 대한 결과를 찾을 수 없습니다.&nbsp;
    //                 <strong>&quot;{modalFilterName}&quot;</strong>.
    //                 <br /> 사용자의 이름을 다시 한번 확인해주세요.
    //               </Typography>
    //             </Paper>
    //           </TableCell>
    //         </TableRow>
    //       </TableBody>
    //     )}
    //   </Table>
    // </TableContainer>
    // </DialogContent>
    //     <DialogActions>
    //       <Button onClick={handleSaveConfirmOpen} variant="contained">
    //         추가
    //       </Button>
    //       <Button
    //         onClick={() => {
    //           resetFilterAndSelection();
    //           handleCloseSaveSnackbar();
    //         }}
    //         variant="outlined"
    //       >
    //         취소
    //       </Button>

    //       <Snackbar
    //         open={saveSnackbar}
    //         autoHideDuration={2000}
    //         onClose={handleCloseSaveSnackbar}
    //         anchorOrigin={{
    //           vertical: 'top',
    //           horizontal: 'center',
    //         }}
    //         sx={{ width: 400 }}
    //       >
    //         <Alert onClose={handleCloseSaveSnackbar} severity="success" sx={{ width: '100%' }}>
    //           관리자로 전환되었습니다!
    //         </Alert>
    //       </Snackbar>

    //       <Snackbar
    //         open={nullSnackbar}
    //         autoHideDuration={2000}
    //         onClose={handleCloseNullSnackbar}
    //         anchorOrigin={{
    //           vertical: 'top',
    //           horizontal: 'center',
    //         }}
    //         sx={{ width: 400 }}
    //       >
    //         <Alert onClose={handleCloseNullSnackbar} severity="error" sx={{ width: '100%' }}>
    //           선택한 사용자가 없습니다!
    //         </Alert>
    //       </Snackbar>
    //     </DialogActions>

    //     <Dialog open={saveConfirmOpen} onClose={() => setSaveConfirmOpen(false)}>
    //       <DialogTitle>관리자 전환 확인</DialogTitle>
    //       <DialogContent>
    //         <Typography>선택한 사원을 관리자로 추가하시겠습니까?</Typography>
    //       </DialogContent>
    //       <DialogActions>
    //         <Button
    //           onClick={() => {
    //             if (modalSelected !== null && modalSelected.length !== 0) {
    //               handleSaveConfirmClose();
    //               handleOpenSaveSnackbar();
    //               setModalSelected([]);
    //             } else {
    //               // modalSelected가 null일 때 경고창 띄우기
    //               handleOpenNullSnackbar();
    //               handleSaveConfirmClose();
    //               setModalSelected([]);
    //             }
    //           }}
    //           variant="contained"
    //         >
    //           추가
    //         </Button>
    //         <Button onClick={() => setSaveConfirmOpen(false)} variant="outlined">
    //           취소
    //         </Button>
    //       </DialogActions>
    //     </Dialog>

    //     {/* 페이징 기능 추가 */}
    //     <TablePagination
    //       rowsPerPageOptions={[5, 10, 25]}
    //       component="div"
    //       count={filteredModalUsers.length}
    //       rowsPerPage={rowsModalPerPage}
    //       page={modalPage}
    //       onPageChange={handleModalChangePage}
    //       onRowsPerPageChange={handleChangeModalRowsPerPage}
    //       labelRowsPerPage="페이지당 사원 수 :"
    //       labelDisplayedRows={({ count }) =>
    //         `현재 페이지: ${modalPage + 1} / 전체 페이지: ${Math.ceil(count / rowsModalPerPage)}`
    //       }
    //     />
    //   </Dialog>
    // </Modal>
  );
}
