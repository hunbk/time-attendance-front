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
import loginAxios from '../../api/loginAxios';

type DistributionPageProps = {
    userListWrappedD: UserResponseDtoWrappedType[];
    userListWrappedND: UserResponseDtoWrappedType[];
    setUserListWrappedD: Dispatch<SetStateAction<UserResponseDtoWrappedType[]>>;
    setUserListWrappedND: Dispatch<SetStateAction<UserResponseDtoWrappedType[]>>;
    workGroupSimple: WorkGroupSimpleType[];
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

const DistributionPage: FC<DistributionPageProps> = ({ userListWrappedD, userListWrappedND, setUserListWrappedD, setUserListWrappedND, workGroupSimple, selectedWorkGroup, isDistributed }) => {
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [isModification, setIsModification] = useState<boolean>(false);
    const [selectedWorkGroupId, setSelectedWorkGroupId] = useState<number>(0);
    const [selectedWorkGroupName, setSelectedWorkGroupName] = useState<string>("");
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);
    const [userListWrappedFiltered, setUserListWrappedFiltered] = useState<UserResponseDtoWrappedType[]>(null);
    const [selectedCard, setSelectedCard] = useState(false);
    const handleModalOpen = (event: MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.id === "modification") {
            setIsModification(true);
        } else {
            setIsModification(false);
        }

        setIsModalOpened(true);
    };
    const customLocaleText = {
        noRowsLabel: '조회할 근로제를 선택해주세요.',
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

    const filterByWorkGroup = async (selectedWorkGroupId: number, selectedWorkGroupName: string) => {
        try {
            const response = await loginAxios.get(`/api/workgroups/distribution/${selectedWorkGroupId}`);

            if (response.status === 200) {
                const tempUserListFiltered: UserResponseDtoWrappedType[] = [];

                userListWrappedD.forEach((user) => {
                    if (response.data.includes(user.userId)) {
                        tempUserListFiltered.push(user);
                    }
                })

                setSelectedWorkGroupId(selectedWorkGroupId);
                setSelectedWorkGroupName(selectedWorkGroupName);
                setUserListWrappedFiltered(tempUserListFiltered);
            } else {
                // Handle other status codes
            }
        } catch (error) {
            // Handle errors
            console.error('An error occurred:', error);
        }
    }


    const updateDistribution = async (selectedUserIds: number[], selectedWorkGroupId?: number, applyNow?: boolean) => {
        if (isDistributed) {
            // 배포 해제
            if (!selectedWorkGroupId) {
                setUserListWrappedFiltered(null);
                setUserListWrappedD(userListWrappedD.filter((user) => !selectedUserIds.includes(user.id)));
                setUserListWrappedND([...userListWrappedND, ...userListWrappedD.filter((user) => selectedUserIds.includes(user.id))]);

                try {
                    const response = await loginAxios.delete(`/api/workgroups/distribution/${selectedUserIds}`);

                    if (response.status === 200) {
                        alert("배포해제되었습니다.");
                    } else {
                        // Handle other status codes
                    }
                } catch (error) {
                    // Handle errors
                    console.error('An error occurred:', error);
                }
            }
            // 근로제 변경
            else {
                try {
                    const response = await loginAxios.put(`/api/workgroups/distribution/${applyNow}`, {
                        userIds: selectedUserIds,
                        workGroupId: selectedWorkGroupId
                    });
                    if (response.status === 200) {
                        alert("근로제 변경되었습니다.");
                        setUserListWrappedFiltered(userListWrappedFiltered.filter((user) => !selectedUserIds.includes(user.id)));
                    } else {
                        // Handle other status codes
                    }
                } catch (error) {
                    // Handle errors
                    console.error('An error occurred:', error);
                } 
            }

        }
        // 배포
        else {
            setUserListWrappedFiltered(null);
            setUserListWrappedND(userListWrappedND.filter((user) => !selectedUserIds.includes(user.id)));
            setUserListWrappedD([...userListWrappedD, ...userListWrappedND.filter((user) => selectedUserIds.includes(user.id))]);

            try {
                const response = await loginAxios.post('/api/workgroups/distribution', {
                    userIds: selectedUserIds,
                    workGroupId: selectedWorkGroupId
                });

                if (response.status === 200) {
                    alert("배포되었습니다.");
                } else {
                    // Handle other status codes
                }
            } catch (error) {
                // Handle errors
                console.error('An error occurred:', error);
            }

        }
    }

    return (
        <Grid container spacing={2}>
            {isDistributed === true ? <Grid xs={2}>
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    defaultExpanded={["-1"]}
                >
                    <TreeItem nodeId="-1" label="근로제">
                        {workGroupSimple.map((item, index) => <TreeItem key={index} nodeId={`${index}`} label={item.name} onClick={() => { filterByWorkGroup(item.id, item.name) }} />)}
                    </TreeItem>
                </TreeView>
            </Grid> : <></>}
            <Grid xs={isDistributed === true ? 10 : 12}>
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
                />
            </Grid>
            {isDistributed === true ? <Grid xs={2}> </Grid> : <></>}
            <Grid xs={isDistributed === true ? 10 : 12} sx={{ display: "flex", justifyContent: "end", margin: "20px 0" }}>
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
                                    updateDistribution(selectedUserIds, selectedWorkGroup.id, false);
                                    setIsModalOpened(false);
                                }}>변경(정산: 내일부터 적용)</Button>
                                <Button variant="outlined" onClick={() => {
                                    updateDistribution(selectedUserIds, selectedWorkGroup.id, true);
                                    setIsModalOpened(false);
                                }}>변경(정산: 오늘부터 적용)</Button>
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