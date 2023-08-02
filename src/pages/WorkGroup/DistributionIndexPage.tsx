import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Unstable_Grid';
import styled from '@mui/system/styled';
import Stack from '@mui/system/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Typography, CardActionArea } from '@mui/material';
import DistributionPage from './DistributionPage';
import WorkGroupCard from 'src/components/workGroup/WorkGroupCard';



interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component='div'>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

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

const DistributionIndexPage = () => {
    const [value, setValue] = React.useState(0);
    const [workGroupSimple, setWorkGroupSimple] = React.useState<WorkGroupSimpleType[]>([]);
    const [deptList, setDeptList] = React.useState<DeptType[]>([]);
    const [selectedWorkGroupId, setSelectedWorkGroupId] = React.useState('');

    const handleSelectedWorkGroupId = (id) => {
        setSelectedWorkGroupId(id);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    async function postData1() {
        const url = `http://localhost:8080/api/getWorkGroupSimpleInfo`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });

        response.json().then((data) => setWorkGroupSimple(data));
    }

    async function postData2() {
        const url = `http://localhost:8080/api/findAllDepts`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });

        response.json().then((data) => setDeptList(data));
    }

    React.useEffect(() => {
        postData1();
        postData2();
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid xs={2}>
                <Box sx={{ width: '100%' }}>
                    근로그룹목록
                    <Stack spacing={2}>
                        {workGroupSimple?.map((item, index) => <WorkGroupCard key={index} id={item.id} name={item.name} type={item.type} numOfMembers={item.numOfMembers} handleSelectedWorkGroupId={handleSelectedWorkGroupId}/>)}
                    </Stack>
                </Box>
            </Grid>
            <Grid xs={10}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="미배포사용자" />
                            <Tab label="배포사용자" />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <DistributionPage deptList={deptList} selectedWorkGroupId={selectedWorkGroupId} isDistributed={false}/>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <DistributionPage deptList={deptList} selectedWorkGroupId={selectedWorkGroupId} isDistributed/>
                    </CustomTabPanel>
                </Box>
            </Grid>
        </Grid>
    )
};

export default DistributionIndexPage;

