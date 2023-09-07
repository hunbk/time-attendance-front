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
import { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

interface State extends SnackbarOrigin {
    openSnackbar: boolean;
    severity: AlertColor;
    message: string;
}

type WorkGroupCardListProps = {
    workGroupResponseDto: WorkGroupResponseDtoType;
    handleModify: (workGroupId: number) => void;
    handleDelete: (workGroupId: number) => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
    (props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const WorkGroupCardList: FC<WorkGroupCardListProps> = ({ workGroupResponseDto, handleModify, handleDelete }) => {
    const [state, setState] = useState<State>({
        openSnackbar: false,
        severity: "success",
        message: "",
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, openSnackbar } = state;

    const handleClickSnackbar = (newState: SnackbarOrigin, severity: AlertColor, message: string) => {
        setState({ ...newState, openSnackbar: true, severity, message });
    };

    const handleCloseSnackbar = () => {
        setState({ ...state, openSnackbar: false });
    };
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClickPopover = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
    };
    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;
    const timeRangeTypeArr = workGroupResponseDto.timeRangeType.split(", ");
    const startArr = workGroupResponseDto.start.split(", ");
    const endArr = workGroupResponseDto.end.split(", ");

    let workHour = '';
    let approvedHour = '';
    const breakHours = [];
    const compulsoryHours = [];

    for (let i = 0; i < timeRangeTypeArr.length; i += 1) {
        switch (timeRangeTypeArr[i]) {
            case "근무":
                workHour = `${startArr[i].substring(0, 5)} ~ ${endArr[i].substring(0, 5)}`;
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

    const workHoursTotal = getTotalHours(workHour);
    const breakHoursTotal = getTotalHours(breakHours);
    const workDaysArr = workGroupResponseDto.workDays.split(", ");
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
                                        {workHour}
                                    </Typography>
                                </Grid>
                                <Box sx={{ position: "absolute", right: "15px" }}>
                                    <IconButton>
                                        <CalendarModal groupName={workGroupResponseDto.name} workHourPerDay={workHoursTotal - breakHoursTotal} convertedWorkDays={convertedWorkDays} />
                                    </IconButton>
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
                                                    handleClickSnackbar({ vertical: 'top', horizontal: 'center' }, "error", "배포인원 0명일 때 삭제 가능합니다.");
                                                } else {
                                                    handleDelete(workGroupResponseDto.id);
                                                    handleClickSnackbar({ vertical: 'top', horizontal: 'center' }, "success", "삭제되었습니다.");
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
                                        휴식시간
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" sx={{ marginLeft: "10px" }}>
                                        {breakHours.map((breakHour, index) =>
                                            <span key={index}>{index === breakHours.length - 1 ? breakHour : `${breakHour}, `}</span>
                                        )}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Typography variant="body2">의무근로시간</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" sx={{ marginLeft: "10px" }}>
                                        {compulsoryHours.map((compulsoryHour, index) =>
                                            <span key={index}>{index === compulsoryHours.length - 1 ? compulsoryHour : `${compulsoryHour}, `}</span>
                                        )}
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
                                        {approvedHour}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ display: "flex", justifyContent: "end" }}>
                                    <Typography>
                                        <SwitchWrapped
                                            isOn={workGroupResponseDto.isOn}
                                            numOfMembers={workGroupResponseDto.numOfMembers}
                                            handleClickSnackbar={handleClickSnackbar}
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
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                key={vertical + horizontal}
                autoHideDuration={1000}
            >
                <Alert onClose={handleCloseSnackbar} severity={state.severity} sx={{ width: '100%' }}>
                    {state.message}
                </Alert>
            </Snackbar>
        </Box>);
}

export default WorkGroupCardList;