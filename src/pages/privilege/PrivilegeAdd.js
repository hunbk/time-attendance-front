import { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from '@mui/material';
// components
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { enqueueSnackbar } from 'notistack';

// LoginAxios
import loginAxios from '../../api/loginAxios';

// 유저 상태
import { useAuthState } from '../../context/AuthProvider';
import { forEach } from 'lodash';
// ----------------------------------------------------------------------

const LIST_HEAD = [
  { id: 'name', label: '이름', alignRight: false },
  // { id: 'dept', label: '부서', alignRight: false },
  { id: 'position', label: '직급', alignRight: false },
  { id: 'userId', label: '사원번호', alignRight: false },
  { id: 'hireDate', label: '입사일', alignRight: false },
  { id: 'role', label: '권한', alignRight: false },
  { id: '' },
];

const MODAL_HEAD = [
  { id: 'name', label: '이름', alignRight: false },
  // { id: 'dept', label: '부서', alignRight: false },
  { id: 'position', label: '직급', alignRight: false },
  { id: 'userId', label: '사원번호', alignRight: false },
  { id: 'role', label: '권한', alignRight: false },
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
      const filteredUser = array.find((user) => user.name === queryId);
      if (filteredUser) {
        filteredUsers.push(filteredUser);
      }
    });

    return filteredUsers;
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function PrivilegeAdd() {
  const { user } = useAuthState();
  // 회원 목록
  const [users, setUsers] = useState([]);
  // 회사 목록 조회 API
  const getUserList = async () => {
    const res = await loginAxios.get(`/api/users?companyId=${user.companyId}`);
    const filteredData = res.data.filter(userData => userData.userId !== user.userId)
    setUsers(filteredData);
    setFilteredModalUsers(filteredData);
  };

  useEffect(() => {
    getUserList();
  }, []);

  const [modalPage, setModalPage] = useState(0);
  const [rowsModalPerPage, setRowsModalPerPage] = useState(5);
  const [modalFilterName, setModalFilterName] = useState('');
  const [modalSelected, setModalSelected] = useState([]);
  const [saveSnackbar, setSaveSnackbar] = useState(false);
  const [nullSnackbar, setNullSnackbar] = useState(false);
  const [openAdminModal, setOpenAdminModal] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  // 선택된 사용자들을 관리하는 상태와 함수들을 새로운 상태와 함수들로 분리

  const [isModalSearched, setIsModalSearched] = useState(false); // 검색 버튼을 눌렀는지 여부를 저장하는 상태

  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const [selectedAdminType, setSelectedAdminType] = useState('USER'); // selectedAdminType 상태 추가

  const [filteredModalUsers, setFilteredModalUsers] = useState([]);

  const [confirmEditOpen, setConfirmEditOpen] = useState(false);

  const filterUser = applySortFilter(filteredModalUsers, getComparator(order, orderBy), modalFilterName);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleModalSelectAllClick = (event) => {
    if (isModalSearched) {
      if (event.target.checked) {
        const newSelecteds = filteredModalUsers.map((n) => n.userId);
        setModalSelected(newSelecteds);
      } else {
        setModalSelected([]);
      }
    } else {
      if (event.target.checked) {
        const newSelecteds = users.map((n) => n.userId);
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
      setFilteredModalUsers(users);
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

  const handleOpenSaveSnackbar = () => {
    enqueueSnackbar(`권한이 변경되었습니다!`,{variant:"success"});
  };

  const handleOpenNullSnackbar = () => {
    enqueueSnackbar(`사원을 선택해주세요!`,{variant:"warning"});
  };

  const handleModalSearch = (search) => {
    setIsModalSearched(true);
    const searchResult = applySortFilter(users, getComparator(order, orderBy), search);
    setModalFilterName(search);
    setModalPage(0);
    setRowsModalPerPage(5);
    setFilteredModalUsers(searchResult);
  };

  const handleSaveConfirmOpen = () => {
    setSaveConfirmOpen(true);
  };

  const handleOpenAdminModal = () => {
    setOpenAdminModal(true);
  };

  const handleCloseAdminModal = () => {
    setOpenAdminModal(false);
  };

  const handleSaveConfirmClose = () => {
    if (selectedAdminType === 'ADMIN') {
      handleOpenAdminModal();
    } else {
      updateAdminType();
      setSaveConfirmOpen(false);
      handleConfirmEditClose();
    }
  };

  const handleConfirmEditOpen = () => {
    setConfirmEditOpen(true);
  };

  const handleConfirmEditClose = () => {
    setConfirmEditOpen(false);
  };

  const updateAdminType = async () => {
    const newArray = modalSelected.map((userId) => ({
      userId,
      role: selectedAdminType,
    }));
    await loginAxios.patch('/api/users', newArray);
    getUserList();
    resetSelectedAdminType();
    setModalSelected([]);
    handleOpenSaveSnackbar();
  };

  const resetSelectedAdminType = () => {
    setSelectedAdminType('USER');
  };

  const handleFilterButtonClick = (filteredUsers) => {
    setFilteredModalUsers(filteredUsers);
  };

  const emptyModalRows = modalPage > 0 ? Math.max(0, (1 + modalPage) * rowsModalPerPage - users.length) : 0;

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
        <title>권한 관리</title>
      </Helmet>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            권한 설정
          </Typography>
        </Stack>
        <Card>
          <UserListToolbar
            numSelected={modalSelected.length}
            filterName={modalFilterName}
            onFilterName={handleModalFilterByName}
            onSearch={handleModalSearch}
            onFilterUsers={handleFilterButtonClick}
            users={users}
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
                      const { name, position, userId, userCode, hireDate, role } = row;

                      const selectedModalUser = modalSelected.indexOf(userId) !== -1;

                      return (
                        <TableRow key={name}>
                          <TableCell align="left">
                            <Checkbox
                              checked={selectedModalUser}
                              onChange={(event) => handleModalClick(event, userId)}
                            />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ justifyContent: 'center' }}>
                              <Avatar alt={name} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          {/* <TableCell align="center">{dept}</TableCell> */}

                          <TableCell align="center">{position}</TableCell>

                          <TableCell align="center">{userCode}</TableCell>

                          <TableCell align="center">{hireDate}</TableCell>

                          <TableCell align="center">
                            {(() => {
                              switch (role) {
                                case 'USER':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <PersonIcon sx={{ fontSize: 17 }} />
                                      <Label color="default">일반 권한자</Label>
                                    </Stack>
                                  );
                                case 'HR':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <SupervisorAccountIcon sx={{ fontSize: 17 }} />
                                      <Label color="success">인사 관리자</Label>
                                    </Stack>
                                  );
                                case 'FO':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <AccountBalanceIcon sx={{ fontSize: 17 }} />
                                      <Label color="warning">재무 관리자</Label>
                                    </Stack>
                                  );
                                case 'MNG':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <AccountBoxIcon sx={{ fontSize: 17 }} />
                                      <Label color="info">총괄 책임자</Label>
                                    </Stack>
                                  );
                                case 'ADMIN':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <AdminPanelSettingsIcon sx={{ fontSize: 17 }} />
                                      <Label color="error">최고 권한자</Label>
                                    </Stack>
                                  );
                                default:
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <PersonIcon sx={{ fontSize: 18 }} />
                                      <Label color="default">일반 권한자</Label>
                                    </Stack>
                                  );
                              }
                            })()}
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
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 , marginBottom:1, marginTop:3}}>
          <DialogActions>
            <Button
              onClick={() => {
                resetFilterAndSelection();
              }}
            >
              취소
            </Button>

            <Button
              sx={{ mr: 1 }}
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
              권한 부여
            </Button>
          </DialogActions>
        </Box>
        </Card>
      </Container>

      <Dialog open={openAdminModal} onClose={handleCloseAdminModal} minWidth="sm">
        <DialogTitle>경고</DialogTitle>
        <DialogContent>
          <Typography>
            해당 권한은 신중하게 부여되어야 합니다. <br />
            이 권한은 시스템 전체에 영향을 미치며, <br />
            잘못 사용될 경우 심각한 보안 문제를 유발할 수 있습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSaveConfirmOpen(false);
              handleCloseAdminModal();
              handleSaveConfirmOpen();
              handleConfirmEditClose();
            }}
          >
            취소
          </Button>
          <Button
            onClick={() => {
              resetSelectedAdminType();
              setModalSelected([]);
              updateAdminType();
              setSaveConfirmOpen(false);
              handleConfirmEditClose();
              handleCloseAdminModal();
            }}
            variant="contained"
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={saveConfirmOpen}
        onClose={() => {
          setSaveConfirmOpen(false);
          resetSelectedAdminType();
        }}
        minWidth="sm"
      >
        <DialogTitle>관리자 권한 변경</DialogTitle>
        <DialogContent>
          <Typography>어떤 권한으로 변경하시겠습니까?</Typography>

          {/* 드롭다운 메뉴 */}
          <Select
            value={selectedAdminType}
            onChange={(event) => setSelectedAdminType(event.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="ADMIN">
              <Stack direction="row" alignItems="center" spacing={1}>
                <AdminPanelSettingsIcon sx={{ fontSize: 17 }} />
                <Label color="error">최고 권한자</Label>
              </Stack>
            </MenuItem>
            <MenuItem value="MNG">
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccountBoxIcon sx={{ fontSize: 17 }} />
                <Label color="info">총괄 책임자</Label>
              </Stack>
            </MenuItem>
            <MenuItem value="HR">
              <Stack direction="row" alignItems="center" spacing={1}>
                <SupervisorAccountIcon sx={{ fontSize: 17 }} />
                <Label color="success">인사 관리자</Label>
              </Stack>
            </MenuItem>
            <MenuItem value="FO">
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccountBalanceIcon sx={{ fontSize: 17 }} />
                <Label color="warning">재무 관리자</Label>
              </Stack>
            </MenuItem>
            <MenuItem value="USER">
              <Stack direction="row" alignItems="center" spacing={1}>
                <PersonIcon sx={{ fontSize: 17 }} />
                <Label color="default">일반 권한자</Label>
              </Stack>
            </MenuItem>
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
                    const userRole = users.find((u) => u.userId === selectedUser);
                    if (userRole) {
                      return (
                        <TableRow key={userRole.name}>
                          <TableCell align="center" component="th" scope="row" padding="5">
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ justifyContent: 'center' }}>
                              <Avatar alt={userRole.name} />
                              <Typography variant="subtitle2" noWrap>
                                {userRole.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          {/* <TableCell align="center">{userRole.dept}</TableCell> */}
                          <TableCell align="center">{userRole.position}</TableCell>
                          <TableCell align="center">{userRole.userCode}</TableCell>
                          <TableCell align="center">
                            {(() => {
                              switch (userRole.role) {
                                case 'USER':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <PersonIcon sx={{ fontSize: 17 }} />
                                      <Label color="default">일반 권한자</Label>
                                    </Stack>
                                  );
                                case 'HR':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <SupervisorAccountIcon sx={{ fontSize: 17 }} />
                                      <Label color="success">인사 관리자</Label>
                                    </Stack>
                                  );
                                case 'FO':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <AccountBalanceIcon sx={{ fontSize: 17 }} />
                                      <Label color="warning">재무 관리자</Label>
                                    </Stack>
                                  );
                                case 'MNG':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <AccountBoxIcon sx={{ fontSize: 17 }} />
                                      <Label color="info">총괄 책임자</Label>
                                    </Stack>
                                  );
                                case 'ADMIN':
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <AdminPanelSettingsIcon sx={{ fontSize: 17 }} />
                                      <Label color="error">최고 권한자</Label>
                                    </Stack>
                                  );
                                default:
                                  return (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ justifyContent: 'center' }}
                                    >
                                      <PersonIcon sx={{ fontSize: 18 }} />
                                      <Label color="default">일반 권한자</Label>
                                    </Stack>
                                  );
                              }
                            })()}
                          </TableCell>
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
              setSaveConfirmOpen(false);
              resetSelectedAdminType();
            }}
          >
            취소
          </Button>
          <Button
            onClick={() => {
              handleConfirmEditOpen();
            }}
            variant="contained"
          >
            변경
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmEditOpen} onClose={handleConfirmEditClose}>
        <DialogTitle>권한 변경 확인</DialogTitle>
        <DialogContent>
          {(() => {
            switch (selectedAdminType) {
              case 'ADMIN':
                return <DialogContentText>최고 권한자로 권한을 변경하시겠습니까?</DialogContentText>;
              case 'MNG':
                return <DialogContentText>총괄 책임자로 권한을 변경하시겠습니까?</DialogContentText>;
              case 'HR':
                return <DialogContentText>인사 관리자로 권한을 변경하시겠습니까?</DialogContentText>;
              case 'FO':
                return <DialogContentText>재무 관리자로 권한을 변경하시겠습니까?</DialogContentText>;
              case 'USER':
                return <DialogContentText>일반 권한자로 권한을 변경하시겠습니까?</DialogContentText>;
              default:
                return <DialogContentText>일반 권한자로 권한을 변경하시겠습니까?</DialogContentText>;
            }
          })()}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleConfirmEditClose}>취소</Button>
          <Button onClick={handleSaveConfirmClose} variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
