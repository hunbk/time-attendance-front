import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListPage from './ListPage';
import EnrollmentPage from './EnrollmentPage';
import DistributionIndexPage from './DistributionIndexPage';

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



const IndexPage = () => {
    const [value, setValue] = React.useState(0);
    const [isWorkGroupListHidden, setIsWorkGroupListHidden] = React.useState<boolean>(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="근로그룹목록" />
                    <Tab label="근로그룹배포" />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                {isWorkGroupListHidden ? <EnrollmentPage setIsWorkGroupListHidden={setIsWorkGroupListHidden} /> : <ListPage setIsWorkGroupListHidden={setIsWorkGroupListHidden} />}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <DistributionIndexPage />
            </CustomTabPanel>
        </Box>
    )
};

export default IndexPage;

