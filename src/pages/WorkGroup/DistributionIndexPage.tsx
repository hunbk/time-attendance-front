import Box from '@mui/system/Box';
import Grid from '@mui/system/Unstable_Grid';
import Stack from '@mui/system/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DistributionPage from './DistributionPage';
import WorkGroupCard from 'src/components/workGroup/WorkGroupCard';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import CustomTabPanel from 'src/components/workGroup/CustomTabPanel';

type WorkGroupSimpleType = {
    id: number;
    name: string;
    type: string;
    numOfMembers: number;
}

type DeptType = {
    id: number;
    name: string;
}

const DistributionIndexPage: FC = () => {
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [workGroupSimple, setWorkGroupSimple] = useState<WorkGroupSimpleType[]>([]);
    const [deptList, setDeptList] = useState<DeptType[]>([]);
    const [selectedWorkGroupId, setSelectedWorkGroupId] = useState<number>(0);
    const handleSelectedWorkGroupId = (id: number) => {
        setSelectedWorkGroupId(id);
    };
    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setCurrentTabIndex(newValue);
    };
    const getWorkGroupSimpleData = async () => {
        const url = `http://localhost:8080/api/workgroups-simple`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });

        response.json().then((data) => setWorkGroupSimple(data));
    }
    const getAllDeptsData = async () => {
        const url = `http://localhost:8080/api/findAllDepts`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });

        response.json().then((data) => setDeptList(data));
    }

    useEffect(() => {
        getWorkGroupSimpleData();
        getAllDeptsData();
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid xs={2}>
                <Box sx={{ width: '100%' }}>
                    근로그룹목록
                    <Stack spacing={2}>
                        {workGroupSimple.length !== 0 && workGroupSimple.map((item, index) => <WorkGroupCard key={index} id={item.id} name={item.name} type={item.type} numOfMembers={item.numOfMembers} handleSelectedWorkGroupId={handleSelectedWorkGroupId} />)}
                    </Stack>
                </Box>
            </Grid>
            <Grid xs={10}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTabIndex} onChange={handleChange}>
                            <Tab label="미배포사용자" />
                            <Tab label="배포사용자" />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={currentTabIndex} index={0}>
                        <DistributionPage deptList={deptList} selectedWorkGroupId={selectedWorkGroupId} isDistributed={false} />
                    </CustomTabPanel>
                    <CustomTabPanel value={currentTabIndex} index={1}>
                        <DistributionPage deptList={deptList} selectedWorkGroupId={selectedWorkGroupId} isDistributed />
                    </CustomTabPanel>
                </Box>
            </Grid>
        </Grid>
    )
};

export default DistributionIndexPage;