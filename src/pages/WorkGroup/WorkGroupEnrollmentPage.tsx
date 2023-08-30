import type { Dayjs } from 'dayjs';
import dayjs from "dayjs";
import {
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Dispatch, FC, FormEvent, SetStateAction, useState, MouseEvent, useEffect, Fragment } from "react";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import { useImmer } from "use-immer";
import TimeInputDiv from "../../components/workGroup/TimeInputDiv";
import HolidayPayLeave from "../../components/workGroup/HolidayPayLeave";
import { DataToBeModifiedType } from './WorkGroupIndexPage';
import { useAuthState } from '../../context/AuthProvider';
import loginAxios from '../../api/loginAxios';

type WorkGroupEnrollmentPageProps = {
  setIsWorkGroupListHidden: Dispatch<SetStateAction<boolean>>;
  dataToBeModified: DataToBeModifiedType;
  setDataToBeModified: Dispatch<SetStateAction<DataToBeModifiedType>>;
}

type WorkDayTypeType = {
  mon: "근무" | "유급" | "무급";
  tue: "근무" | "유급" | "무급";
  wed: "근무" | "유급" | "무급";
  thu: "근무" | "유급" | "무급";
  fri: "근무" | "유급" | "무급";
  sat: "근무" | "유급" | "무급";
  sun: "근무" | "유급" | "무급";
}

export type DataType = {
  id: number,
  name: string;
  type: "일반" | "시차";
  workDayType: WorkDayTypeType,
  timeRangeType: string[],
  start: string[],
  end: string[],
  companyId: number
}

const WorkGroupEnrollmentPage: FC<WorkGroupEnrollmentPageProps> = ({ setIsWorkGroupListHidden, dataToBeModified, setDataToBeModified }) => {
  const { user } = useAuthState();
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const handleHour = (startOrEnd: string, timeType: string, value: Dayjs | null) => {
    setHours((draft) => {
      draft[timeType][startOrEnd] = value?.format('HH:mm:ss');
    })
  }
  const getTimeRangeByType = (timeRangeType: string[], start: string[], end: string[], targetType: string) => {
    const matchedRanges = [];

    for (let i = 0; i < timeRangeType.length; i += 1) {
      if (timeRangeType[i] === targetType) {
        matchedRanges.push({ start: start[i], end: end[i] });
      }
    }

    return matchedRanges;

  }
  const timeInputDivSet = (timeType: string) =>
  (dataToBeModified ? <>{getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, timeType).map((matchedRange, index) => <Fragment key={index}>
    <TimeInputDiv
      handleTempHour={handleHour}
      startOrEnd="start"
      timeType={timeType}
      defaultValue={dayjs(matchedRange.start, 'HH:mm:ss')}
    />
    <TimeInputDiv
      handleTempHour={handleHour}
      startOrEnd="end"
      timeType={timeType}
      defaultValue={dayjs(matchedRange.end, 'HH:mm:ss')}
    />
  </Fragment>)}</> : <>
    <TimeInputDiv
      handleTempHour={handleHour}
      startOrEnd="start"
      timeType={timeType}
      defaultValue={null}
    />
    <TimeInputDiv
      handleTempHour={handleHour}
      startOrEnd="end"
      timeType={timeType}
      defaultValue={null}
    />
  </>);

  const [timeInputDivsBreak, setTimeInputDivsBreak] = useState([
    timeInputDivSet("휴게")
  ]);
  const [timeInputDivsCompulsory, setTimeInputDivsCompulsory] = useState([
    timeInputDivSet("의무")
  ]);
  const [alignments, setAlignments] = useState<string[]>(dataToBeModified ? dataToBeModified.alignments.work : []);
  const [dayHolidays, setDayHolidays] = useState<string[]>(dataToBeModified ? DAYS.filter(day => !dataToBeModified.alignments.work.includes(day)) : []);
  const [holidayOnOff, setHolidayOnOff] = useState<"on" | "off">("on");
  const [data, setData] = useImmer<DataType>({
    id: 0,
    name: "",
    type: dataToBeModified ? dataToBeModified.contents.type : "일반",
    workDayType: {
      mon: '무급',
      tue: '무급',
      wed: '무급',
      thu: '무급',
      fri: '무급',
      sat: '무급',
      sun: '무급',
    },
    timeRangeType: [],
    start: [],
    end: [],
    companyId: user.companyId
  });
  const [hours, setHours] = useImmer({
    근무: {
      start: '',
      end: '',
    },
    휴게: {
      start: '',
      end: '',
    },
    의무: {
      start: '',
      end: '',
    },
    승인: {
      start: '',
      end: '',
    }
  })
  const [isChecked, setIsChecked] = useImmer({
    휴게: true,
    의무: true,
    승인: true,
  });
  useEffect(() => {
    if (dataToBeModified) {
      setData(dataToBeModified.contents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const addTimeInputDiv = (divKind: "휴게" | "의무") => {
    setData((draft) => {
      draft.timeRangeType.push(divKind);
      draft.start.push(hours[divKind].start);
      draft.end.push(hours[divKind].end);
    })

    if (divKind === "휴게") {
      setTimeInputDivsBreak([...timeInputDivsBreak, timeInputDivSet("휴게")]);
    } else {
      setTimeInputDivsCompulsory([...timeInputDivsCompulsory, timeInputDivSet("의무")]);
    }
  };
  const handleCheckboxChange = (type: "휴게" | "승인" | "의무") => {
    if (isChecked) {
      setData((draft) => {
        if (draft.timeRangeType.includes(type)) {
          const indexArr: number[] = [];

          for (let i = 0; i < draft.timeRangeType.length; i += 1) {
            if (draft.timeRangeType[i] === type) {
              indexArr.push(i);
            }
          }

          for (let i = indexArr.length - 1; i >= 0; i -= 1) {
            draft.timeRangeType.splice(indexArr[i], 1);
            draft.start.splice(indexArr[i], 1);
            draft.end.splice(indexArr[i], 1);
          }
        }
      })
      setHours((draft) => {
        draft[type].start = '';
        draft[type].end = '';
      })
    } else {
      // 수정중
    }
    setIsChecked((draft) => { draft[type] = !draft[type] });
  };
  const handleToggle = (_event: MouseEvent<HTMLElement>, newAlignment: string[]) => {
    setAlignments(newAlignment);
    setDayHolidays(DAYS.filter(day => !newAlignment.includes(day)));

    for (let i = 0; i < newAlignment.length; i += 1) {
      setData((draft) => {
        draft.workDayType[newAlignment[i]] = "근무";
      })
    }
  };
  const updateDayHoliday = (dayHoliday: string, isPayLeave: boolean) => {
    setData((draft) => {
      if (isPayLeave) {
        draft.workDayType[dayHoliday] = "유급";
      } else {
        draft.workDayType[dayHoliday] = "무급";
      }
    })
  }
  // const handleDelete = () => {
  //   console.info("You clicked the delete icon.");
  // };
  const handleCancel = () => {
    setIsWorkGroupListHidden(false);
    setDataToBeModified(null);
  }

  let dataToBeSent: DataType

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    dataToBeSent = data;

    if (hours.근무.start !== '') {
      dataToBeSent = { ...dataToBeSent, timeRangeType: [...dataToBeSent.timeRangeType, "근무"] };
      dataToBeSent = { ...dataToBeSent, start: [...dataToBeSent.start, hours.근무.start] };
      dataToBeSent = { ...dataToBeSent, end: [...dataToBeSent.end, hours.근무.end] };
    }

    if (hours.휴게.start !== '') {
      dataToBeSent = { ...dataToBeSent, timeRangeType: [...dataToBeSent.timeRangeType, "휴게"] };
      dataToBeSent = { ...dataToBeSent, start: [...dataToBeSent.start, hours.휴게.start] };
      dataToBeSent = { ...dataToBeSent, end: [...dataToBeSent.end, hours.휴게.end] };
    }

    if (hours.의무.start !== '') {
      dataToBeSent = { ...dataToBeSent, timeRangeType: [...dataToBeSent.timeRangeType, "의무"] };
      dataToBeSent = { ...dataToBeSent, start: [...dataToBeSent.start, hours.의무.start] };
      dataToBeSent = { ...dataToBeSent, end: [...dataToBeSent.end, hours.의무.end] };

    }

    if (hours.승인.start !== '') {
      dataToBeSent = { ...dataToBeSent, timeRangeType: [...dataToBeSent.timeRangeType, "승인"] };
      dataToBeSent = { ...dataToBeSent, start: [...dataToBeSent.start, hours.승인.start] };
      dataToBeSent = { ...dataToBeSent, end: [...dataToBeSent.end, hours.승인.end] };
    }

    if (alignments.length === 0) {
      alert("근무일은 최소 1일 이상이어야합니다.")
    } else {
      console.log(dataToBeSent);
    }

    if (dataToBeModified) {
      try {
        const response = await loginAxios.put(`/api/workgroups/${dataToBeModified.id}`, dataToBeSent);

        if (response.status === 200) {
          alert("수정되었습니다.");
          window.location.href = "http://localhost:3000/dashboard/workgroups";
        } else {
          // Handle other status codes
        }
      } catch (error) {
        // Handle errors
        console.error('An error occurred:', error);
      }
    } else {
      try {
        const response = await loginAxios.post('/api/workgroups', dataToBeSent);

        if (response.status === 200) {
          alert("저장되었습니다.");
          window.location.href = "http://localhost:3000/dashboard/workgroups";
        } else {
          // Handle other status codes
        }
      } catch (error) {
        // Handle errors
        console.error('An error occurred:', error);
      }
    }
  };

  return (
    <form onSubmit={submitForm}>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <span>근로제 그룹명</span>
          </Grid>
          <Grid xs={9}>
            <span>
              <TextField
                variant="outlined"
                value={data.name}
                size="small"
                placeholder="그룹명을 입력하세요"
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                }}
                required
              />
            </span>
          </Grid>
          <Grid xs={3}>
            <span>근로제 선택</span>
          </Grid>
          <Grid xs={9}>
            <span>
              <FormControl>
                <RadioGroup
                  value={data.type}
                  defaultValue={'일반'}
                  row
                  onChange={(e) => setData({ ...data, type: e.target.value as "일반" | "시차" })}
                >
                  <FormControlLabel
                    value="일반"
                    control={<Radio />}
                    label="일반근로제"
                  />
                  <FormControlLabel
                    value="시차"
                    control={<Radio />}
                    label="시차출퇴근제"
                  />
                </RadioGroup>
              </FormControl>
            </span>
          </Grid>
          <Grid xs={3}>
            <span>근로제 알아보기</span>
          </Grid>
          <Grid xs={9}>
            <div>일반근로제: 고정된 근로시간과 정액급여로 근로자와 사업주 사이의 노동 계약 형태를 의미</div>
            <div>시차출퇴근제: 근로자가 자유로운 출퇴근 시간을 선택할 수 있는 제도로서, 기본 근무시간을 지키면서 유연한 근무 스케줄을 적용하는 형태의 근로 방식</div>
          </Grid>
          <Grid xs={3}>
            <div>근무일지정</div>
            <div>소정근무일을 지정합니다</div>
          </Grid>
          <Grid xs={9} sx={{ display: "flex", flexDirection: "column" }}>
            <FormControl>
              <FormLabel>
                근무일 선택
              </FormLabel>
            </FormControl>
            <ToggleButtonGroup
              color="primary"
              value={alignments}
              onChange={handleToggle}
            >
              <ToggleButton value="mon">월</ToggleButton>
              <ToggleButton value="tue">화</ToggleButton>
              <ToggleButton value="wed">수</ToggleButton>
              <ToggleButton value="thu">목</ToggleButton>
              <ToggleButton value="fri">금</ToggleButton>
              <ToggleButton value="sat">토</ToggleButton>
              <ToggleButton value="sun">일</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid xs={3}>
            <div>휴일구분</div>
            <div>휴일 구분을 지정합니다</div>
          </Grid>
          <Grid xs={9}>
            <FormControl>
              <FormLabel>
                휴일구분사용
              </FormLabel>
              <RadioGroup
                value={holidayOnOff}
                defaultValue="on"
                row
                onChange={(e) => {
                  if (e.target.value === "on") {
                    setHolidayOnOff("on");
                  } else {
                    setHolidayOnOff("off");

                    for (let i = 0; i < DAYS.length; i += 1) {
                      if (data.workDayType[DAYS[i]] === "유급") {
                        setData((draft) => {
                          draft.workDayType[DAYS[i]] = "무급";
                        })
                      }
                    }
                  }
                }}
              >
                <FormControlLabel value="on" control={<Radio />} label="사용" />
                <FormControlLabel
                  value="off"
                  control={<Radio />}
                  label="미사용"
                />
              </RadioGroup>
            </FormControl>
            {holidayOnOff === "on" ? dayHolidays.map((dayHoliday, index) =>
              <HolidayPayLeave key={dayHoliday + index} dayHoliday={dayHoliday} defaultPayLeave={dataToBeModified ? dataToBeModified.alignments.payLeave.includes(dayHoliday) : false} updateDayHoliday={updateDayHoliday} />
            ) : <></>}
          </Grid>
          <Grid xs={3}>
            <div>시간입력</div>
            <div>선택적근로시간제 상세시간 및 설정값을 입력합니다.</div>
          </Grid>
          <Grid xs={9}>
            <Card sx={{ minWidth: 275 }}>
              <Grid container spacing={2}>
                <Grid xs={3}>
                  <span>근무시간</span>
                </Grid>
                <Grid xs={1}> </Grid>
                <Grid xs={8}>
                  <div>
                    근무시작 및 종료시각을 근로자의 결정으로 선택할 수 있는
                    시간대를 입력합니다.
                  </div>
                  {timeInputDivSet("근무")}
                </Grid>
                <Grid xs={3}>
                  <span>휴게시간</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox defaultChecked onChange={() => handleCheckboxChange("휴게")} />
                </Grid>
                {isChecked.휴게 ? <Grid xs={8}>
                  <div>휴게시간 설정을 사용합니다.</div>
                  <div>휴게시간 시작시간과 종료시간을 입력합니다.</div>
                  {timeInputDivsBreak.map((div, index) =>
                    <div key={`${index}`}>{div}</div>
                  )}
                  <Button
                    onClick={() => {
                      addTimeInputDiv("휴게");
                    }}
                  >
                    <AddIcon sx={{ border: "1px solid" }} />
                  </Button>
                </Grid> : <Grid xs={8}> </Grid>}
                <Grid xs={3}>
                  <span>의무근로시간대</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox defaultChecked onChange={() => handleCheckboxChange("의무")} />
                </Grid>
                {isChecked.의무 ? <Grid xs={8}>
                  <div>의무근로시간대 설정을 사용합니다.</div>
                  <div>
                    업무협조 및 업무특성을 감안하여 반드시 근무해야하는 시간을
                    입력할 수 있는 시간대를 설정합니다.
                  </div>
                  {timeInputDivsCompulsory.map((div, index) =>
                    <div key={`${index}`}>{div}</div>
                  )}
                  <Button
                    onClick={() => {
                      addTimeInputDiv("의무");
                    }}
                  >
                    <AddIcon sx={{ border: "1px solid" }} />
                  </Button>
                </Grid> : <Grid xs={8}> </Grid>}
                <Grid xs={3}>
                  <span>승인근로시간대</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox defaultChecked onChange={() => handleCheckboxChange("승인")} />
                </Grid>
                {isChecked.승인 ? <Grid xs={8}>
                  <div>승인근로시간대 설정을 사용합니다.</div>
                  <div>
                    사전에 승인을 받은 경우에만 근로시간으로 인정하는 시간을
                    입력할 수 있는 시간대를 설정합니다.
                  </div>
                  {timeInputDivSet("승인")}
                </Grid> : <Grid xs={8}> </Grid>}
              </Grid>
            </Card>
          </Grid>
        </Grid>
        <Typography sx={{ alignSelf: "center", margin: "10px" }} component={"div"}>
          <Button variant="outlined" onClick={handleCancel} sx={{ marginRight: "10px" }}>취소</Button>
          <Button type="submit" variant="contained">
            {dataToBeModified === null ? "저장" : "수정"}
          </Button>
        </Typography>
      </Box>
    </form>
  );
};

export default WorkGroupEnrollmentPage;
