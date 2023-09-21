import { FC, useState, MouseEvent, Dispatch, SetStateAction, useEffect, useCallback, useRef } from "react";
import Grid from '@mui/system/Unstable_Grid';
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { UserResponseDtoWrappedType } from "./DistributionIndexPage";
import { WorkGroupSimpleType } from "./WorkGroupIndexPage";
import handleRequest, { FetchResultType } from "src/utils/workGroupHandleRequest";
import { enqueueSnackbar } from "notistack";
import Swal from 'sweetalert2'

type DistributionPageProps = {
    userListWrappedD: UserResponseDtoWrappedType[];
    userListWrappedND: UserResponseDtoWrappedType[];
    setUserListWrappedD: Dispatch<SetStateAction<UserResponseDtoWrappedType[]>>;
    setUserListWrappedND: Dispatch<SetStateAction<UserResponseDtoWrappedType[]>>;
    workGroupSimple: WorkGroupSimpleType[];
    selectedWorkGroup: WorkGroupSimpleType;
    setWorkGroupSimpleCard: Dispatch<SetStateAction<WorkGroupSimpleType[]>>;
    isDistributed: boolean;
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const DistributionPage: FC<DistributionPageProps> = ({ userListWrappedD, userListWrappedND, setUserListWrappedD, setUserListWrappedND, workGroupSimple, selectedWorkGroup, setWorkGroupSimpleCard, isDistributed }) => {
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [isModification, setIsModification] = useState<boolean>(false);
    const [selectedWorkGroupId, setSelectedWorkGroupId] = useState<number>(0);
    const [selectedWorkGroupName, setSelectedWorkGroupName] = useState<string>("");
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);
    const [userListWrappedFiltered, setUserListWrappedFiltered] = useState<UserResponseDtoWrappedType[]>(null);
    const [workGroupChangedInto, setWorkGroupChangedInto] = useState({
        id: 0,
        name: '',
    });
    const rowsPerPage = useRef(5);
    const handleModalOpen = (event: MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.id === "modification") {
            setIsModification(true);
        } else {
            setIsModification(false);
        }

        if (selectedUserIds.length !== 0) {
            setIsModalOpened(true);
        } else {
            // enqueueSnackbar(`선택된 근로자가 없습니다.`, { variant: "error" });
            Swal.fire({
                title: '선택된 근로자가 없습니다.',
                icon: 'error',
                confirmButtonText: '확인',
                confirmButtonColor: "#2065D1"
            })
        }

    };
    const customLocaleText = {
        noRowsLabel: isDistributed ? '조회할 근로제를 선택해주세요.' : '미배포된 근로자가 없습니다.',
        MuiTablePagination: {
            labelRowsPerPage: "페이지당 목록 수: ",
            labelDisplayedRows: ({ from, to, count, page }) => {
                const numOfRowsAtCurrentPage = to - from + 1;

                if (page === 0) {
                    rowsPerPage.current = numOfRowsAtCurrentPage;
                }

                const totalNumberOfPages = Math.ceil(count / rowsPerPage.current);

                return `현재 페이지: ${page + 1} / 전체 페이지: ${totalNumberOfPages}`;
            }
        }
    };

    const columns: GridColDef<UserResponseDtoWrappedType>[] = [
        {
            field: "name",
            headerName: "이름",
            flex: 1,
            renderCell: ({ row: { name } }) =>
                <Box>
                    <Typography>
                        {name}
                    </Typography>
                </Box>
        },
        {
            field: "workgroup",
            headerName: "근로제",
            flex: 1,
            renderCell: () =>
                <Box>
                    <Typography>
                        {selectedWorkGroupName.length === 0 ? "미배포" : selectedWorkGroupName}
                    </Typography>
                </Box>
        },
        {
            field: "role",
            headerName: "직책",
            flex: 1,
            renderCell: ({ row: { position } }) =>
                <Box>
                    <Typography>
                        {position}
                    </Typography>
                </Box>
        },
        {
            field: "email",
            headerName: "이메일",
            flex: 1,
            renderCell: ({ row: { email } }) =>
                <Box>
                    <Typography>
                        {email}
                    </Typography>
                </Box>
        },
        {
            field: "hire_date",
            headerName: "입사일자",
            flex: 1,
            renderCell: ({ row: { hireDate } }) =>
                <Box>
                    <Typography>
                        {hireDate.toString()}
                    </Typography>
                </Box>
        },
    ];

    const filterByWorkGroup = useCallback(async (selectedWorkGroupId: number, selectedWorkGroupName: string) => {
        const { status, data }: FetchResultType = await handleRequest('get', `/api/workgroups/distribution/${selectedWorkGroupId}`);
        if (status === 200) {
            const tempUserListFiltered: UserResponseDtoWrappedType[] = [];

            userListWrappedD.forEach((user) => {
                if (data.includes(user.userId)) {
                    tempUserListFiltered.push(user);
                }
            })

            setSelectedWorkGroupId(selectedWorkGroupId);
            setSelectedWorkGroupName(selectedWorkGroupName);
            setUserListWrappedFiltered(tempUserListFiltered);
        } else {
            console.error(data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isDistributed && selectedWorkGroup.id !== 0) {
            filterByWorkGroup(selectedWorkGroup.id, selectedWorkGroup.name);
        }

    }, [selectedWorkGroup, isDistributed, filterByWorkGroup]);

    const updateDistribution = async (selectedUserIds: number[], workGroupIdChangedInto?: number, applyNow?: boolean) => {
        if (isDistributed) {
            // 배포 해제
            if (!workGroupIdChangedInto) {
                // setUserListWrappedFiltered(null);
                setUserListWrappedFiltered(userListWrappedFiltered.filter((user) => !selectedUserIds.includes(user.id)));
                setUserListWrappedD(userListWrappedD.filter((user) => !selectedUserIds.includes(user.id)));
                setUserListWrappedND([...userListWrappedND, ...userListWrappedD.filter((user) => selectedUserIds.includes(user.id))]);

                const { status, data }: FetchResultType = await handleRequest('delete', `/api/workgroups/distribution/${selectedUserIds}`);
                if (status === 200) {
                    enqueueSnackbar(`배포해제되었습니다.`, { variant: "success" });
                    setWorkGroupSimpleCard((draft) => draft.map((item) => item.id === selectedWorkGroup.id ? { ...item, numOfMembers: item.numOfMembers - selectedUserIds.length } : item));
                } else {
                    console.error(data);
                }
            }
            // 근로제 변경
            else {
                const { status, data }: FetchResultType = await handleRequest('put', `/api/workgroups/distribution/${applyNow}`, {
                    userIds: selectedUserIds,
                    workGroupId: workGroupIdChangedInto
                });
                if (status === 200) {
                    enqueueSnackbar(`근로제 변경되었습니다.`, { variant: "success" });
                    setUserListWrappedFiltered(userListWrappedFiltered.filter((user) => !selectedUserIds.includes(user.id)));

                    // Find the matching item in workGroupSimpleCard and update the numOfMembers property by adding the number of selectedUserIds using immer and update the numOfMembers property of the not matched item by decreasing the number of selectedUserIds using immer.
                    setWorkGroupSimpleCard((draft) => draft.map((item) => item.id === workGroupIdChangedInto ? { ...item, numOfMembers: item.numOfMembers + selectedUserIds.length } : item.id === selectedWorkGroup.id ? { ...item, numOfMembers: item.numOfMembers - selectedUserIds.length } : item));
                } else {
                    console.error(data);
                }
            }
        }
        // 배포
        else {
            setUserListWrappedFiltered(null);
            setUserListWrappedND(userListWrappedND.filter((user) => !selectedUserIds.includes(user.id)));
            setUserListWrappedD([...userListWrappedD, ...userListWrappedND.filter((user) => selectedUserIds.includes(user.id))]);

            const { status, data }: FetchResultType = await handleRequest('post', '/api/workgroups/distribution', {
                userIds: selectedUserIds,
                workGroupId: workGroupIdChangedInto
            });
            if (status === 200) {
                enqueueSnackbar(`배포되었습니다.`, { variant: "success" });
                setWorkGroupSimpleCard((draft) => draft.map((item) => item.id === selectedWorkGroup.id ? { ...item, numOfMembers: item.numOfMembers + selectedUserIds.length } : item));
            } else {
                console.error(data);
            }
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <DataGrid checkboxSelection rows={userListWrappedFiltered !== null ? userListWrappedFiltered : isDistributed ? selectedWorkGroupId !== 0 ? userListWrappedD : [] : userListWrappedND} columns={columns} onRowSelectionModelChange={(selection: number[]) => {
                    setSelectedUserIds(selection);

                    if (isDistributed) {
                        const tempSelectedNames: string[] = [];
                        userListWrappedD.forEach((user) => {
                            if (selection.includes(user.id)) {
                                tempSelectedNames.push(user.name);
                            }
                        })
                        setSelectedUserNames(tempSelectedNames);
                    } else {
                        const tempSelectedNames: string[] = [];
                        userListWrappedND.forEach((user) => {
                            if (selection.includes(user.id)) {
                                tempSelectedNames.push(user.name);
                            }
                        })
                        setSelectedUserNames(tempSelectedNames);
                    }

                }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    localeText={customLocaleText}
                    sx={{ height: "380px" }}
                />
            </Grid>
            <Grid xs={12} sx={{ display: "flex", justifyContent: "end", margin: "20px 0" }}>
                {isDistributed ? <><Button id="modification" onClick={handleModalOpen} variant="outlined" sx={{ marginRight: "10px" }}>근로제 변경</Button><Button id="deletion" onClick={handleModalOpen} variant="outlined">배포 해제</Button>
                    <Modal
                        open={isModalOpened}
                        onClose={() => setIsModalOpened(false)}
                    >
                        {isModification ? <Box sx={style}>

                            <TreeView
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto', marginBottom: "20px" }}
                                defaultExpanded={["-1"]}
                            >
                                <TreeItem nodeId="-1" label="변경할 근로제를 선택해주세요">
                                    {workGroupSimple.map((item, index) => item.id !== selectedWorkGroupId && <TreeItem key={index} nodeId={`${index}`} label={item.name} onClick={() => {
                                        setWorkGroupChangedInto({
                                            id: item.id,
                                            name: item.name,
                                        })
                                    }} />)}
                                </TreeItem>
                            </TreeView>

                            {workGroupChangedInto.id !== 0 ?
                                <><Typography variant="body1" component={'div'} sx={{ textAlign: "center" }}>
                                    {selectedUserNames.map((name, index) => <strong key={`a${index}`}>{name}{index !== selectedUserNames.length - 1 ? ', ' : ''}</strong>)}님을 <div><strong>{workGroupChangedInto.name}</strong>로 변경하시겠습니까?</div>
                                </Typography>

                                    <Typography component={"div"} sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                                        <Button variant="outlined" onClick={() => {
                                            updateDistribution(selectedUserIds, workGroupChangedInto.id, false);
                                            setIsModalOpened(false);
                                            setWorkGroupChangedInto({
                                                id: 0,
                                                name: '',
                                            })
                                        }}>변경(정산: 내일부터 적용)</Button>
                                        <Button variant="outlined" onClick={() => {
                                            updateDistribution(selectedUserIds, workGroupChangedInto.id, true);
                                            setIsModalOpened(false);
                                        }}>변경(정산: 오늘부터 적용)</Button>
                                        <Button variant="outlined" onClick={() => {
                                            setIsModalOpened(false);
                                            setWorkGroupChangedInto({ id: 0, name: '' });
                                            setWorkGroupChangedInto({
                                                id: 0,
                                                name: '',
                                            })
                                        }}>취소</Button>
                                    </Typography></> : <></>}

                        </Box> : <Box sx={style}>
                            <Box sx={{ display: "flex", alignContent: "center", flexDirection: "column", textAlign: "center" }}>
                                <Typography variant="body1" component={'div'}>
                                    {selectedUserNames.map((name, index) => <strong key={`b${index}`}>{name}{index !== selectedUserNames.length - 1 ? ', ' : ''}</strong>)}님을 <div><strong>배포해제</strong>하시겠습니까?</div>
                                </Typography>
                                <Typography sx={{ mt: 2 }} component={"div"}>
                                    <Button variant="outlined" onClick={() => setIsModalOpened(false)}>취소</Button>
                                    <Button variant="contained" onClick={() => {
                                        updateDistribution(selectedUserIds);
                                        setIsModalOpened(false);
                                    }} sx={{ marginLeft: "10px" }}>확인</Button>
                                </Typography>
                            </Box>
                        </Box>}
                    </Modal></> : <><Button id="distribution" onClick={handleModalOpen} variant="outlined">근로그룹배포</Button>
                    <Modal
                        open={isModalOpened}
                        onClose={() => setIsModalOpened(false)}
                    >
                        <Box sx={style}>
                            <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column", textAlign: "center" }}>
                                <Typography sx={{ mt: 2 }} component={'div'}>
                                    {selectedUserNames.map((name, index) => <strong key={`b${index}`}>{name}{index !== selectedUserNames.length - 1 ? ', ' : ''}</strong>)}님을 <div><strong>{selectedWorkGroup.name}</strong>으로 배포하시겠습니까?</div>

                                    <Box sx={{ marginTop: "10px" }}>
                                        <Button variant="outlined" onClick={() => setIsModalOpened(false)}>취소</Button>
                                        <Button variant="contained" onClick={() => {
                                            updateDistribution(selectedUserIds, selectedWorkGroup.id);
                                            setIsModalOpened(false);
                                        }}
                                            sx={{ marginLeft: "10px" }}>확인</Button>
                                    </Box>
                                </Typography>
                            </Box>
                        </Box>
                    </Modal></>}
            </Grid>
        </Grid >
    )
};

export default DistributionPage;