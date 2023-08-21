import { FC, useEffect, useState, MouseEvent, ChangeEvent } from "react";
import Grid from '@mui/system/Unstable_Grid';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

type UserResponseDtoType = {
    id: number;
    name: string;
    position: string;
    email: string;
    hireDate: Date;
    department: string;
}

type DeptType = {
    id: number;
    name: string;
}

type DistributionPageProps = {
    deptList: DeptType[];
    selectedWorkGroupId: number;
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

const DistributionPage: FC<DistributionPageProps> = ({ deptList, selectedWorkGroupId, isDistributed }) => {
    const [userList, setUserList] = useState<UserResponseDtoType[]>([]);
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [isModification, setIsModification] = useState<boolean>(false);
    const [radioGroupValue, setRadioGroupValue] = useState<string>('dept1');
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const handleModalOpen = (event: MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.id === "modification") {
            setIsModification(true);
        } else {
            setIsModification(false);
        }

        setIsModalOpened(true);
    };
    const columns: GridColDef<UserResponseDtoType>[] = [
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
            renderCell: ({ row: { department } }) =>
                <Box>
                    <Typography>
                        {department}
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
    const getData = async () => {
        const url = `http://localhost:8080/api/${isDistributed ? 'findByNotDistributed' : 'findByDistributed'}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });

        response.json().then((data) => setUserList(data));
    }

    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid xs={2}>
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                >
                    <TreeItem nodeId="1" label="더존비즈온">
                        {deptList.map((dept, index) => <TreeItem key={index} nodeId="2" label={dept.name} />)}
                    </TreeItem>
                </TreeView>
            </Grid>
            <Grid xs={10}>
                직원 리스트
                <DataGrid checkboxSelection rows={userList} columns={columns} onRowSelectionModelChange={(selection: number[]) => {
                    setSelectedUserIds(selection);
                }} />
            </Grid>
            <Grid xs={2}> </Grid>
            <Grid xs={10} sx={{ display: "flex", justifyContent: "end", margin: "20px 0" }}>
                {isDistributed ? <><Button id="modification" onClick={handleModalOpen} variant="outlined" sx={{ marginRight: "10px" }}>선택그룹 수정</Button><Button id="deletion" onClick={handleModalOpen} variant="outlined">근로그룹제외</Button>
                    <Modal
                        open={isModalOpened}
                        onClose={() => setIsModalOpened(false)}
                    >
                        {isModification ? <Box sx={style}>
                            <Typography variant="h6" component="h2">
                                선택그룹 수정
                            </Typography>
                            <Typography sx={{ mt: 1 }} component={"small"}>
                                이동할 그룹을 선택하여 근로제를 수정합니다.
                            </Typography>
                            <FormControl>
                                <FormLabel>그룹명</FormLabel>
                                <RadioGroup
                                    value={radioGroupValue}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                        setRadioGroupValue(event.currentTarget.value);
                                    }}
                                >
                                    <FormControlLabel value="dept1" control={<Radio />} label="부서1" labelPlacement="start" />
                                    <FormControlLabel value="dept2" control={<Radio />} label="부서2" labelPlacement="start" />
                                </RadioGroup>
                                <Typography component={"div"}>
                                    <Button variant="outlined" onClick={() => setIsModalOpened(false)} sx={{ marginRight: "10px" }}>취소</Button>
                                    <Button variant="outlined" onClick={() => {
                                        console.log(`selected user id: ${selectedUserIds}, selected work group: ${selectedWorkGroupId}`);
                                    }}>확인</Button>
                                </Typography>
                            </FormControl>
                        </Box> : <Box sx={style}>
                            <Typography variant="h6" component="h2">
                                근로그룹 배포 해제
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                배포해제시 선택된 사용자는 해당 근로그룹에 접근이 불가능합니다. 계속 진행하시겠습니까?

                                <Button variant="outlined" onClick={() => setIsModalOpened(false)}>취소</Button>
                                <Button variant="outlined" onClick={() => {
                                    console.log(`selected user id: ${selectedUserIds}, selected work group: ${selectedWorkGroupId}`);
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
                                선택한 사용자에게 근로그룹을 배포하시겠습니까?

                                <Button variant="outlined" onClick={() => setIsModalOpened(false)}>취소</Button>
                                <Button variant="outlined" onClick={() => {
                                    console.log(`selected user id: ${selectedUserIds}, selected work group: ${selectedWorkGroupId}`);
                                }}>확인</Button>
                            </Typography>
                        </Box>
                    </Modal></>}
            </Grid>
        </Grid >
    )
};

export default DistributionPage;