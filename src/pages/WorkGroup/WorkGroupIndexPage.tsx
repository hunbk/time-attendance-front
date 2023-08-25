import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import WorkGroupListPage from './WorkGroupListPage';
import WorkGroupEnrollmentPage, { DataType } from './WorkGroupEnrollmentPage';
import DistributionIndexPage from './DistributionIndexPage';
import { useState, SyntheticEvent, FC } from 'react';
import CustomTabPanel from 'src/components/workGroup/CustomTabPanel';

export type DataToBeModifiedType = {
    id: number;
    contents: DataType;
    alignments: {
        work: string[],
        payLeave: string[],
        nonPayLeave: string[],
    }
}

export type WorkGroupSimpleType = {
    id: number;
    name: string;
    type: string;
    numOfMembers: number;
}

const WorkGroupIndexPage: FC = () => {
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [isWorkGroupListHidden, setIsWorkGroupListHidden] = useState<boolean>(false);
    const [dataToBeModified, setDataToBeModified] = useState<DataToBeModifiedType>(null);
    const [workGroupSimple, setWorkGroupSimple] = useState<WorkGroupSimpleType[]>([]);
    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setCurrentTabIndex(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTabIndex} onChange={handleChange}>
                    <Tab label="근로그룹목록" />
                    <Tab label="근로그룹배포" />
                </Tabs>
            </Box>
            <CustomTabPanel value={currentTabIndex} index={0}>
                {isWorkGroupListHidden ? <WorkGroupEnrollmentPage setIsWorkGroupListHidden={setIsWorkGroupListHidden} dataToBeModified={dataToBeModified} setDataToBeModified={setDataToBeModified} /> : <WorkGroupListPage setIsWorkGroupListHidden={setIsWorkGroupListHidden} setDataToBeModified={setDataToBeModified} setWorkGroupSimple={setWorkGroupSimple}/>}
            </CustomTabPanel>
            <CustomTabPanel value={currentTabIndex} index={1}>
                <DistributionIndexPage workGroupSimple={workGroupSimple} />
            </CustomTabPanel>
        </Box>
    )
};

export default WorkGroupIndexPage;

