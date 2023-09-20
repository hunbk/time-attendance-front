import { FC, useState, MouseEvent, forwardRef } from "react";
import { Box, Button, Grid, IconButton, Snackbar, Typography, Stack } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { WorkGroupResponseDtoType } from "src/pages/workgroup/WorkGroupListPage";
import CalendarModal from "./CalendarModal";
import SwitchWrapped from "./SwitchWrapped";
import Popover from '@mui/material/Popover';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { enqueueSnackbar } from 'notistack';
import Swal from 'sweetalert2'

type WorkGroupCardListProps = {
    workGroupResponseDto: WorkGroupResponseDtoType;
    handleModify: (workGroupId: number) => void;
    handleDelete: (workGroupId: number) => void;
}

const WorkGroupCardList: FC<WorkGroupCardListProps> = ({ workGroupResponseDto, handleModify, handleDelete }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClickPopover = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
    };
    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

    const workHours = [];
    let approvedHour = '';
    const breakHours = [];
    const compulsoryHours = [];

    const timeRangeTypeArr = workGroupResponseDto.timeRangeType?.split(", ");
    const startArr = workGroupResponseDto.start?.split(", ");
    const endArr = workGroupResponseDto.end?.split(", ");

    for (let i = 0; i < timeRangeTypeArr?.length; i += 1) {
        switch (timeRangeTypeArr[i]) {
            case "근무":
                workHours.push(`${startArr[i].substring(0, 5)} ~ ${endArr[i].substring(0, 5)}`);
                break;
            case "휴게":
                breakHours.push(`${startArr[i].substring(0, 5)} ~ ${endArr[i].substring(0, 5)}`);
                break;
            case "의무":
                compulsoryHours.push(`${startArr[i].substring(0, 5)} ~ ${endArr[i].substring(0, 5)}`);
                break;
            case "승인":
                approvedHour = `${startArr[i].substring(0, 5)} ~ ${endArr[i].substring(0, 5)}`;
                break;
            default:
        }
    }



    const getTotalHours = (timeRange: string[] | string) => {
        // timeRangeArr: ["12:00 ~ 13:00", "16:00 ~ 17:00"],
        let totalHours = 0;
        const calculateGap = (timeRange: string) => {
            const startHour = parseInt(timeRange.substring(0, 2), 10);
            const startMinute = parseInt(timeRange.substring(3, 5), 10);
            const endHour = parseInt(timeRange.substring(8, 10), 10);
            const endMinute = parseInt(timeRange.substring(11, 13), 10);
            let hoursGap: number;
            let minutesGap: number;
            let hours: number;

            if (startMinute <= endMinute) {
                minutesGap = endMinute - startMinute;
                hoursGap = endHour - startHour;
            } else {
                minutesGap = startMinute - endMinute;
                hoursGap = endHour - startHour - 1;
            }

            if (minutesGap === 30) {
                hours = hoursGap + 0.5;
            } else {
                hours = hoursGap;
            }

            totalHours += hours;
        }

        if (Array.isArray(timeRange)) {
            timeRange.forEach((timeRange: string) => {
                calculateGap(timeRange);
            });
        } else {
            calculateGap(timeRange);
        }

        return totalHours;
    }

    const workHoursTotal = getTotalHours(workHours);
    const breakHoursTotal = getTotalHours(breakHours);
    const workDaysArr = workGroupResponseDto.workDays?.split(", ");
    const convertedWorkDays = [];
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    days.forEach((day, index) => {
        if (workDaysArr[index] === "근무") {
            convertedWorkDays.push(day);
        }
    })

    return (
        <Box>
            <Card sx={{ display: 'flex', height: "150px" }}>
                <Grid container>
                    <Grid item xs={3}>
                        <CardContent>
                            <Typography variant="h5">
                                {workGroupResponseDto.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {workGroupResponseDto.type === '일반' ? "일반" : "시차"}
                            </Typography>
                            <Typography variant="caption">
                                인원: {workGroupResponseDto.numOfMembers}명
                            </Typography>
                        </CardContent>
                    </Grid>
                    <Grid item xs={9}>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        근무시간
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" sx={{ marginLeft: "10px" }}>
                                        {workGroupResponseDto.type === "시차" && "["}
                                        {workHours.length !== 0 ? workHours.map((workHour, index) =>
                                            <span key={index}>{index === workHours.length - 1 ? workHour : `${workHour}, `}</span>) : "없음"
                                        }
                                        {workGroupResponseDto.type === "시차" && "]"}
                                    </Typography>
                                </Grid>
                                <Box sx={{ position: "absolute", right: "15px" }}>
                                    {/* <IconButton>
                                        <CalendarModal groupName={workGroupResponseDto.name} workHourPerDay={workHoursTotal - breakHoursTotal} convertedWorkDays={convertedWorkDays} />
                                    </IconButton> */}
                                    <IconButton aria-describedby={id} onClick={handleClickPopover}>
                                        <Typography>
                                            <MoreVertIcon fontSize="small" />
                                        </Typography>
                                    </IconButton>
                                    <Popover
                                        id={id}
                                        open={openPopover}
                                        anchorEl={anchorEl}
                                        onClose={handleClosePopover}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                            <Button sx={{ color: "black" }} onClick={() => handleModify(workGroupResponseDto.id)}>
                                                <EditIcon fontSize="small" sx={{ marginRight: "10px" }} />
                                                수정
                                            </Button>

                                            <Button sx={{ color: "red" }} onClick={() => {
                                                if (workGroupResponseDto.numOfMembers > 0) {
                                                    // enqueueSnackbar(`배포인원 0명일 때 삭제 가능합니다.`, { variant: "error" });
                                                    Swal.fire({
                                                        text: '배포인원 0명일 때 삭제 가능합니다.',
                                                        icon: 'error',
                                                        confirmButtonText: '확인'
                                                    })
                                                } else {
                                                    handleDelete(workGroupResponseDto.id);
                                                    enqueueSnackbar(`삭제되었습니다.`, { variant: "success" });
                                                }
                                            }}>
                                                <DeleteIcon fontSize="small" sx={{ marginRight: "10px" }} />
                                                삭제
                                            </Button>
                                        </Box>
                                    </Popover>
                                </Box>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        휴게시간
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" sx={{ marginLeft: "10px" }}>
                                        {breakHours.length !== 0 ? breakHours.map((breakHour, index) =>
                                            <span key={index}>{index === breakHours.length - 1 ? breakHour : `${breakHour}, `}</span>) : "없음"
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Typography variant="body2">의무근로시간</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" sx={{ marginLeft: "10px" }}>
                                        {compulsoryHours.length !== 0 ? compulsoryHours.map((compulsoryHour, index) =>
                                            <span key={index}>{index === compulsoryHours.length - 1 ? compulsoryHour : `${compulsoryHour}, `}</span>) : "없음"
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        승인근로시간
                                    </Typography>
                                </Grid>
                                <Grid item xs={7}>
                                    <Typography variant="body2" sx={{ marginLeft: "10px" }}>
                                        {approvedHour.length !== 0 ? approvedHour : "없음"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ display: "flex", justifyContent: "end" }}>
                                    <Typography>
                                        <SwitchWrapped
                                            id={workGroupResponseDto.id}
                                            isOn={workGroupResponseDto.isOn}
                                            numOfMembers={workGroupResponseDto.numOfMembers}
                                        />
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "end", marginTop: "5px" }}>
                                    <Typography variant="caption">
                                        최종 업데이트 날짜: {workGroupResponseDto.dateUpdated.substring(0, 10)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Grid>
                </Grid >
            </Card >
        </Box>);
}

export default WorkGroupCardList;