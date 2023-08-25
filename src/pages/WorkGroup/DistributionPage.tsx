import { FC, useEffect, useState, MouseEvent, ChangeEvent, Dispatch, SetStateAction } from "react";
import Grid from '@mui/system/Unstable_Grid';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { UserResponseDtoWrappedType } from "./DistributionIndexPage";
import { WorkGroupSimpleType } from "./WorkGroupIndexPage";


type DistributionPageProps = {
    userListWrappedD: UserResponseDtoWrappedType[];
    userListWrappedND: UserResponseDtoWrappedType[];
    setUserListWrappedD: Dispatch<SetStateAction<UserResponseDtoWrappedType[]>>;
    setUserListWrappedND: Dispatch<SetStateAction<UserResponseDtoWrappedType[]>>;
    deptList: string[];
    selectedWorkGroup: WorkGroupSimpleType;
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

const DistributionPage: FC<DistributionPageProps> = ({ userListWrappedD, userListWrappedND, setUserListWrappedD, setUserListWrappedND, deptList, selectedWorkGroup, isDistributed }) => {
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [isModification, setIsModification] = useState<boolean>(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);
    const [userListWrappedFiltered, setUserListWrappedFiltered] = useState<UserResponseDtoWrappedType[]>(null);
    const handleModalOpen = (event: MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.id === "modification") {
            setIsModification(true);
        } else {
            setIsModification(false);
        }

        setIsModalOpened(true);
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
            field: "department",
            headerName: "부서",
            flex: 1,
            renderCell: ({ row: { dept } }) =>
                <Box>
                    <Typography>
                        {dept}
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

    const filterByDept = (dept: string) => {
        const tempUserListFiltered: UserResponseDtoWrappedType[] = [];

        if (isDistributed) {
            userListWrappedD.forEach((user) => {
                if (user.dept === dept) {
                    tempUserListFiltered.push(user);
                }
            })

            setUserListWrappedFiltered(tempUserListFiltered);
        } else {
            userListWrappedND.forEach((user) => {
                if (user.dept === dept) {
                    tempUserListFiltered.push(user);
                }
            })

            setUserListWrappedFiltered(tempUserListFiltered);
        }
    }


    const updateDistribution = async (selectedUserIds: number[], selectedWorkGroupId?: number) => {
        const url = `http://localhost:8080/api/workgroups/distribution`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userIds: selectedUserIds,
                workGroupId: selectedWorkGroupId
            }),
        });

        response.text().then((data) => {
            alert(data);

            if (!selectedWorkGroupId && isDistributed === true) {
                setUserListWrappedFiltered(null);
                setUserListWrappedD(userListWrappedD.filter((user) => !selectedUserIds.includes(user.id)));
                setUserListWrappedND([...userListWrappedND, ...userListWrappedD.filter((user) => selectedUserIds.includes(user.id))]);
            }

            if (selectedWorkGroupId && isDistributed === false) {
                setUserListWrappedFiltered(null);
                setUserListWrappedND(userListWrappedND.filter((user) => !selectedUserIds.includes(user.id)));
                setUserListWrappedD([...userListWrappedD, ...userListWrappedND.filter((user) => selectedUserIds.includes(user.id))]);
            }
        });
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={2}>
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    defaultExpanded={["-1"]}
                >
                    <TreeItem nodeId="-1" label="부서">
                        {deptList.map((dept, index) => dept === "관리자" ? <div key={index}> </div> : <TreeItem key={index} nodeId={`${index}`} label={dept} onClick={() => { filterByDept(dept) }} />)}
                    </TreeItem>
                </TreeView>
            </Grid>
            <Grid xs={10}>
                직원 리스트
                <DataGrid checkboxSelection rows={userListWrappedFiltered !== null ? userListWrappedFiltered : isDistributed ? userListWrappedD : userListWrappedND} columns={columns} onRowSelectionModelChange={(selection: number[]) => {
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
                />
            </Grid>
            <Grid xs={2}> </Grid>
            <Grid xs={10} sx={{ display: "flex", justifyContent: "end", margin: "20px 0" }}>
                {isDistributed ? <><Button id="modification" onClick={handleModalOpen} variant="outlined" sx={{ marginRight: "10px" }}>근로제 변경</Button><Button id="deletion" onClick={handleModalOpen} variant="outlined">배포 해제</Button>
                    <Modal
                        open={isModalOpened}
                        onClose={() => setIsModalOpened(false)}
                    >
                        {isModification ? <Box sx={style}>
                            <Typography variant="body1">
                                {selectedUserNames.map((name, index) => <span key={`a${index}`}>{name}</span>)}님을 {selectedWorkGroup.name}로 변경하시겠습니까?
                            </Typography>

                            <Typography component={"div"}>
                                <Button variant="outlined" onClick={() => setIsModalOpened(false)} sx={{ marginRight: "10px" }}>취소</Button>
                                <Button variant="outlined" onClick={() => {
                                    updateDistribution(selectedUserIds, selectedWorkGroup.id);
                                    setIsModalOpened(false);
                                }}>변경</Button>
                            </Typography>

                        </Box> : <Box sx={style}>
                            <Typography variant="body1">
                                {selectedUserNames.map((name, index) => <span key={`b${index}`}>{name}</span>)}님을 배포해제하시겠습니까?
                            </Typography>
                            <Typography sx={{ mt: 2 }} component={"div"}>
                                <Button variant="outlined" onClick={() => setIsModalOpened(false)}>취소</Button>
                                <Button variant="outlined" onClick={() => {
                                    updateDistribution(selectedUserIds);
                                    setIsModalOpened(false);
                                }}>확인</Button>
                            </Typography>
                        </Box>}
                    </Modal></> : <><Button id="distribution" onClick={handleModalOpen} variant="outlined">근로그룹배포</Button>
                    <Modal
                        open={isModalOpened}
                        onClose={() => setIsModalOpened(false)}
                    >
                        <Box sx={style}>
                            <Typography variant="h6" component="h2">
                                근로그룹 배포
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                {selectedUserNames.map((name, index) => <span key={`b${index}`}>{name}</span>)}님을 {selectedWorkGroup.name}으로 배포하시겠습니까?

                                <Button variant="outlined" onClick={() => setIsModalOpened(false)}>취소</Button>
                                <Button variant="outlined" onClick={() => {
                                    updateDistribution(selectedUserIds, selectedWorkGroup.id);
                                    setIsModalOpened(false);
                                }}>확인</Button>
                            </Typography>
                        </Box>
                    </Modal></>}
            </Grid>
        </Grid >
    )
};

export default DistributionPage;