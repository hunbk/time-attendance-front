import Box from '@mui/system/Box';
import Grid from '@mui/system/Unstable_Grid';
import Stack from '@mui/system/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DistributionPage from './DistributionPage';
import WorkGroupCard from 'src/components/workGroup/WorkGroupCard';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import CustomTabPanel from 'src/components/workGroup/CustomTabPanel';
import { WorkGroupSimpleType } from './WorkGroupIndexPage';
import { useAuthState } from '../../context/AuthProvider';
import loginAxios from '../../api/loginAxios';

type DistributionIndexPageProps = {
    workGroupSimple: WorkGroupSimpleType[];
}

export type UserResponseDtoType = {
    userId: number;
    name: string;
    email: string;
    phone: string;
    hireDate: Date;
    birthday: Date;
    dept: string;
    position: string;
    role: string;
    distribution: boolean;
    companyId: number
}

export type UserResponseDtoWrappedType = {
    id: number;
    userId: number;
    name: string;
    email: string;
    phone: string;
    hireDate: Date;
    birthday: Date;
    dept: string;
    position: string;
    role: string;
    distribution: boolean;
    companyId: number
}

const DistributionIndexPage: FC<DistributionIndexPageProps> = ({ workGroupSimple }) => {
    const { user } = useAuthState();
    const [userListWrappedD, setUserListWrappedD] = useState<UserResponseDtoWrappedType[]>([]);
    const [userListWrappedND, setUserListWrappedND] = useState<UserResponseDtoWrappedType[]>([]);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [selectedWorkGroup, setSelectedWorkGroup] = useState<WorkGroupSimpleType>({
        id: 0,
        name: "",
        type: "일반",
        numOfMembers: 0
    });
    const handleSelectedWorkGroup = (id: number, name: string, type: string, numOfMembers: number) => {
        const tempWorkGroupSimple = {
            id,
            name,
            type,
            numOfMembers
        }

        setSelectedWorkGroup(tempWorkGroupSimple);
    };
    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setCurrentTabIndex(newValue);
    };

    const getUsers = async () => {
        try {
            const response = await loginAxios.get(`/api/users?companyId=${user.companyId}`);

            if (response.status === 200) {
                const data = response.data as UserResponseDtoType[];
                wrapIdForUserList(data);
            } else {
                // Handle other status codes
            }
        } catch (error) {
            // Handle errors
            console.error('An error occurred:', error);
        }
    }

    // Add id property and filter by distribution
    const wrapIdForUserList = (userList: UserResponseDtoType[]) => {
        const tempUserListWrappedD = [];
        const tempUserListWrappedND = [];

        userList.forEach((user) => {
            const userListWrapped = {
                ...user, id: user.userId
            }

            if (userListWrapped.position !== "관리자" && userListWrapped.userId !== 1 && userListWrapped.userId !== 2) {
                if (userListWrapped.distribution === true) {
                    tempUserListWrappedD.push(userListWrapped);
                } else {
                    tempUserListWrappedND.push(userListWrapped);
                }
            }
        });

        setUserListWrappedD(tempUserListWrappedD);
        setUserListWrappedND(tempUserListWrappedND);
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid xs={2}>
                <Box sx={{ width: '100%' }}>
                    <Stack spacing={2}>
                        {workGroupSimple.length !== 0 && workGroupSimple.map((item, index) => <WorkGroupCard key={index} id={item.id} name={item.name} type={item.type} numOfMembers={item.numOfMembers} isSelected={item.id === selectedWorkGroup.id} handleSelectedWorkGroup={handleSelectedWorkGroup} />)}
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
                        <DistributionPage userListWrappedD={userListWrappedD} userListWrappedND={userListWrappedND} setUserListWrappedD={setUserListWrappedD} setUserListWrappedND={setUserListWrappedND} workGroupSimple={workGroupSimple} selectedWorkGroup={selectedWorkGroup} isDistributed={false} />
                    </CustomTabPanel>
                    <CustomTabPanel value={currentTabIndex} index={1}>
                        <DistributionPage userListWrappedD={userListWrappedD} userListWrappedND={userListWrappedND} setUserListWrappedD={setUserListWrappedD} setUserListWrappedND={setUserListWrappedND} workGroupSimple={workGroupSimple} selectedWorkGroup={selectedWorkGroup} isDistributed />
                    </CustomTabPanel>
                </Box>
            </Grid>
        </Grid>
    )
};

export default DistributionIndexPage;