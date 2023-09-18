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
import Swal from 'sweetalert2';
import './Privilege.css';

// LoginAxios
import loginAxios from '../../api/loginAxios';

// 유저 상태
import { useAuthState } from '../../context/AuthProvider';
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
      const filteredUser = array.find((user) => user.name.includes(queryId));
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
    const filteredData = res.data.filter((userData) => userData.userId !== user.userId);
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
    setRowsModalPerPage(parseInt(event.target.value, 5));
  };

  const handleModalFilterByName = (name) => {
    setModalFilterName(name);
    setModalPage(0);
    setRowsModalPerPage(5);

    // 검색창에 아무것도 입력하지 않았을 때,
    if (!name) {
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
    enqueueSnackbar(`권한이 변경되었습니다!`, { variant: 'success' });
  };

  const handleOpenNullSnackbar = () => {
    enqueueSnackbar(`사원을 선택해주세요!`, { variant: 'warning' });
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
    Swal.fire({
      icon: 'warning',
      title: `경고!`,
      html: '<strong>해당 권한은 신중하게 부여되어야 합니다.<br> 이 권한은 시스템 전체에 영향을 미치며,<br>잘못 사용될 경우 심각한 보안 문제를 유발할 수 있습니다.</strong>',
      showConfirmButton: true,
      showCancelButton: true,
      showDenyButton: false,
      confirmButtonText: `변경`,
      cancelButtonText: `취소`,
      reverseButtons: true,
      customClass: {
        container: 'custom-swal', // SweetAlert2 팝업의 컨테이너 클래스 설정
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: '해당 정보가 수정되었습니다!',
          confirmButtonText:'확인',
          timer: 1300,
          customClass: {
            container: 'custom-swal',
          },
        });
        resetSelectedAdminType();
        setModalSelected([]);
        updateAdminType();
        setSaveConfirmOpen(false);
      } else if (result.isDenied) {
        setSaveConfirmOpen(false);
        handleCloseAdminModal();
        handleSaveConfirmOpen();
        handleConfirmEditClose();
      }
    });
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
    Swal.fire({
      icon:'question',
      title: '권한 변경 확인',
      html: (() => {
        switch (selectedAdminType) {
          case 'ADMIN':
            return '<strong><span style="font-size: 17px; color: #FF3D00;">최고 관리자</span></strong>로 권한을 변경하시겠습니까?';
          case 'MNG':
            return '<strong><span style="font-size: 17px; color: #1976D2;">총괄 책임자</span></strong>로 권한을 변경하시겠습니까?';
          case 'HR':
            return '<strong><span style="font-size: 17px; color: #64DD17;">인사 관리자</span></strong>로 권한을 변경하시겠습니까?';
          case 'FO':
            return '<strong><span style="font-size: 17px; color: #FFA500;">재무 관리자</span></strong>로 권한을 변경하시겠습니까?';
          case 'USER':
            return '<strong>일반 권한자</strong>로 권한을 변경하시겠습니까?';
          default:
            return '일반 권한자로 권한을 변경하시겠습니까?';
        }
      })(),
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      reverseButtons: true,
      customClass: {
        container: 'custom-swal',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleSaveConfirmClose();
      }
    });
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

  const isModalNotFound = !filterUser.length && modalFilterName;

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
              <Table size="small">
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
                </TableBody>

                {isModalNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper sx={{ textAlign: 'center', minWidth: 478 }}>
                          <Typography variant="h6" paragraph>
                            {modalFilterName} 사원을 찾지 못했습니다.
                          </Typography>
                          <Typography variant="body2">
                            <strong>{modalFilterName}</strong> 사원에 대한 정보가 없습니다. &nbsp;
                            <br /> 다시 한번 사원이름을 확인해주세요.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {filterUser.length === 0 && !modalFilterName && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper sx={{ textAlign: 'center', minWidth: 478 }}>
                          <Typography variant="h6" paragraph>
                            해당 조건에 대한 결과가 존재하지 않습니다.
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

          {/* 페이징 기능 추가 */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredModalUsers.length}
            rowsPerPage={rowsModalPerPage}
            page={modalPage}
            onPageChange={handleModalChangePage}
            onRowsPerPageChange={handleChangeModalRowsPerPage}
            labelRowsPerPage="페이지당 목록 수 :"
            labelDisplayedRows={({ count }) =>
              `현재 페이지: ${modalPage + 1} / 전체 페이지: ${Math.ceil(count / rowsModalPerPage)}`
            }
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, marginBottom: 1, marginTop: 3 }}>
            <DialogActions>
              <Button
                onClick={() => {
                  resetFilterAndSelection();
                }}
              >
                선택 취소
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
              <Table size="small">
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
    </>
  );
}
