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
import produce from 'immer';
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
  const [hours, setHours] = useImmer({
    "근무": [{ start: '', end: '' }],
    "휴게": [{ start: '', end: '' }],
    "의무": [{ start: '', end: '' }],
    "승인": [{ start: '', end: '' }],
  });
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const handleHour = (index: number, startOrEnd: string, timeType: string, value: Dayjs | null) => {
    setHours((draft) => {
      draft[timeType][index][startOrEnd] = value?.format('HH:mm:ss');
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
  // eslint-disable-next-line prefer-const
  let [isChecked, setIsChecked] = useImmer({
    근무: true,
    휴게: true,
    의무: true,
    승인: true,
  });
  // eslint-disable-next-line prefer-const
  let [statusReset, setStatusReset] = useImmer({
    근무: false,
    휴게: false,
    의무: false,
    승인: false,
  });
  const [currentTimeInputDivIndex, setCurrentTimeInputDivIndex] = useImmer({
    휴게: 0,
    의무: 0,
  });
  const timeInputDivSet = (timeType: string, index: number, isFromAdd?: boolean) => {
    if (dataToBeModified && !statusReset[timeType] && !isFromAdd) {
      const timeRangeByType = getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, timeType);

      return <>{
        timeRangeByType.map((matchedRange, mapIndex) =>
          <Fragment key={mapIndex}>
            <TimeInputDiv
              index={mapIndex}
              handleTempHour={handleHour}
              startOrEnd="start"
              timeType={timeType}
              defaultValue={dayjs(matchedRange.start, 'HH:mm:ss')}
            />
            <TimeInputDiv
              index={mapIndex}
              handleTempHour={handleHour}
              startOrEnd="end"
              timeType={timeType}
              defaultValue={dayjs(matchedRange.end, 'HH:mm:ss')}
            />
          </Fragment>
        )
      }</>
    }

    return <>
      <TimeInputDiv
        index={index}
        handleTempHour={handleHour}
        startOrEnd="start"
        timeType={timeType}
        defaultValue={null}
      />
      <TimeInputDiv
        index={index}
        handleTempHour={handleHour}
        startOrEnd="end"
        timeType={timeType}
        defaultValue={null}
      />
    </>
  };

  // eslint-disable-next-line prefer-const
  let [timeInputDivsBreak, setTimeInputDivsBreak] = useState([
    timeInputDivSet("휴게", 0)
  ]);
  // eslint-disable-next-line prefer-const
  let [timeInputDivsCompulsory, setTimeInputDivsCompulsory] = useState([
    timeInputDivSet("의무", 0)
  ]);
  // eslint-disable-next-line prefer-const
  let [timeInputDivWork, setTimeInputDivWork] = useState(
    timeInputDivSet("근무", 0)
  );
  // eslint-disable-next-line prefer-const
  let [timeInputDivApproved, setTimeInputDivApproved] = useState(
    timeInputDivSet("승인", 0)
  );
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
  useEffect(() => {
    if (dataToBeModified) {
      setData(dataToBeModified.contents);

      const tempHours = {
        "근무": [{ start: '', end: '' }],
        "휴게": [{ start: '', end: '' }],
        "의무": [{ start: '', end: '' }],
        "승인": [{ start: '', end: '' }],
      };

      tempHours["근무"] = getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, "근무").length === 0 ? [{ start: '', end: '' }] : getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, "근무");
      tempHours["휴게"] = getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, "휴게").length === 0 ? [{ start: '', end: '' }] : getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, "휴게");
      tempHours["의무"] = getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, "의무").length === 0 ? [{ start: '', end: '' }] : getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, "의무");
      tempHours["승인"] = getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, "승인").length === 0 ? [{ start: '', end: '' }] : getTimeRangeByType(dataToBeModified.contents.timeRangeType, dataToBeModified.contents.start, dataToBeModified.contents.end, "승인");

      setHours(tempHours);
      setCurrentTimeInputDivIndex((draft) => {
        draft["휴게"] = tempHours["휴게"].length - 1;
        draft["의무"] = tempHours["의무"].length - 1;
      });

      setIsChecked({
        근무: true,
        휴게: tempHours["휴게"][0].start.length !== 0,
        의무: tempHours["의무"][0].start.length !== 0,
        승인: tempHours["승인"][0].start.length !== 0,
      })


      const keys = Object.keys(tempHours);
      keys.forEach(key => {
        if (tempHours[key][0].start.length === 0) {
          statusReset = { ...statusReset, [key]: true };
          setStatusReset((draft) => { draft[key] = true });

          switch (key) {
            case "휴게":
              setTimeInputDivsBreak([timeInputDivSet("휴게", 0)]);
              break;
            case "승인":
              setTimeInputDivApproved(timeInputDivSet("승인", 0));
              break;
            case "의무":
              setTimeInputDivsCompulsory([timeInputDivSet("의무", 0)]);
              break;
            default:
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addTimeInputDiv = (divKind: "휴게" | "의무") => {
    setCurrentTimeInputDivIndex((draft) => {
      draft[divKind] += 1;
    })
    setHours((draft) => {
      draft[divKind].push({ start: '', end: '' });
    })

    if (divKind === "휴게") {
      setTimeInputDivsBreak([...timeInputDivsBreak, timeInputDivSet("휴게", currentTimeInputDivIndex["휴게"] + 1, true)]);
    } else {
      setTimeInputDivsCompulsory([...timeInputDivsCompulsory, timeInputDivSet("의무", currentTimeInputDivIndex["의무"] + 1, true)]);
    }
  };
  const handleCheckboxChange = (type: "휴게" | "승인" | "의무") => {
    if (isChecked[type]) {
      setHours((draft) => {
        draft[type] = [{ start: '', end: '' }];
      });
      // setData((draft) => {
      //   if (draft.timeRangeType.includes(type)) {
      //     const indexArr: number[] = [];

      //     for (let i = 0; i < draft.timeRangeType.length; i += 1) {
      //       if (draft.timeRangeType[i] === type) {
      //         indexArr.push(i);
      //       }
      //     }

      //     for (let i = indexArr.length - 1; i >= 0; i -= 1) {
      //       draft.timeRangeType.splice(indexArr[i], 1);
      //       draft.start.splice(indexArr[i], 1);
      //       draft.end.splice(indexArr[i], 1);
      //     }
      //   }
      // })

      if (type === "휴게" || type === "의무") {
        setCurrentTimeInputDivIndex((draft) => {
          draft[type] = 0;
        })
      }

      isChecked = { ...isChecked, [type]: false };

      statusReset = { ...statusReset, [type]: true };
      setStatusReset((draft) => { draft[type] = true });

      switch (type) {
        case "휴게":
          setTimeInputDivsBreak([timeInputDivSet("휴게", 0)]);
          break;
        case "승인":
          setTimeInputDivApproved(timeInputDivSet("승인", 0));
          break;
        case "의무":
          setTimeInputDivsCompulsory([timeInputDivSet("의무", 0)]);
          break;
        default:
      }
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
  const handleCancel = () => {
    setIsWorkGroupListHidden(false);
    setDataToBeModified(null);
  }

  let dataToBeSent: DataType

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    dataToBeSent = data;

    // if (hours["근무"][0].start !== '' && hours["근무"][0].end === '') {
    //   const index = dataToBeSent.timeRangeType.indexOf("근무");
    //   const arrayToBeUpdated = [...dataToBeSent.start];
    //   arrayToBeUpdated[index] = hours["근무"][0].start;
    //   dataToBeSent = { ...dataToBeSent, start: arrayToBeUpdated };
    // } else if (hours["근무"][0].start === '' && hours["근무"][0].end !== '') {
    //   const index = dataToBeSent.timeRangeType.indexOf("근무");
    //   const arrayToBeUpdated = [...dataToBeSent.end];
    //   arrayToBeUpdated[index] = hours["근무"][0].end;
    //   dataToBeSent = { ...dataToBeSent, end: arrayToBeUpdated };
    // } else if (hours["근무"][0].start !== '' && hours["근무"][0].end !== '') {
    //   const index = dataToBeSent.timeRangeType.indexOf("근무");
    //   const arrayToBeUpdatedStart = [...dataToBeSent.start];
    //   const arrayToBeUpdatedEnd = [...dataToBeSent.end];
    //   arrayToBeUpdatedStart[index] = hours["근무"][0].start;
    //   arrayToBeUpdatedEnd[index] = hours["근무"][0].end;
    //   dataToBeSent = { ...dataToBeSent, start: arrayToBeUpdatedStart };
    //   dataToBeSent = { ...dataToBeSent, end: arrayToBeUpdatedEnd };
    // }




    // if (hours.휴게.start !== '') {
    //   dataToBeSent = { ...dataToBeSent, timeRangeType: [...dataToBeSent.timeRangeType, "휴게"] };
    //   dataToBeSent = { ...dataToBeSent, start: [...dataToBeSent.start, hours.휴게.start] };
    //   dataToBeSent = { ...dataToBeSent, end: [...dataToBeSent.end, hours.휴게.end] };
    // }

    // if (hours.의무.start !== '') {
    //   dataToBeSent = { ...dataToBeSent, timeRangeType: [...dataToBeSent.timeRangeType, "의무"] };
    //   dataToBeSent = { ...dataToBeSent, start: [...dataToBeSent.start, hours.의무.start] };
    //   dataToBeSent = { ...dataToBeSent, end: [...dataToBeSent.end, hours.의무.end] };

    // }


    // if (hours.승인.start !== '' || hours.승인.end !== '') {
    //   dataToBeSent = { ...dataToBeSent, timeRangeType: [...dataToBeSent.timeRangeType, "승인"] };
    //   dataToBeSent = { ...dataToBeSent, start: [...dataToBeSent.start, hours.승인.start] };
    //   dataToBeSent = { ...dataToBeSent, end: [...dataToBeSent.end, hours.승인.end] };
    // }



    const tempTimeRangeType = [];
    const tempStart = [];
    const tempEnd = [];

    // Delete all timeRangeType, start, end arrays in dataToBeSent
    dataToBeSent = { ...dataToBeSent, timeRangeType: [] };
    dataToBeSent = { ...dataToBeSent, start: [] };
    dataToBeSent = { ...dataToBeSent, end: [] };

    // Convert hours array into timeRangeType, start, end arrays
    if (hours["근무"][0].start.length !== 0) {
      for (let i = 0; i < hours["근무"].length; i += 1) {
        tempTimeRangeType.push("근무");
        tempStart.push(hours["근무"][i].start);
        tempEnd.push(hours["근무"][i].end);
      }
    }
    if (hours["휴게"][0].start.length !== 0) {
      for (let i = 0; i < hours["휴게"].length; i += 1) {
        tempTimeRangeType.push("휴게");
        tempStart.push(hours["휴게"][i].start);
        tempEnd.push(hours["휴게"][i].end);
      }
    }
    if (hours["의무"][0].start.length !== 0) {
      for (let i = 0; i < hours["의무"].length; i += 1) {
        tempTimeRangeType.push("의무");
        tempStart.push(hours["의무"][i].start);
        tempEnd.push(hours["의무"][i].end);
      }
    }
    if (hours["승인"][0].start.length !== 0) {
      for (let i = 0; i < hours["승인"].length; i += 1) {
        tempTimeRangeType.push("승인");
        tempStart.push(hours["승인"][i].start);
        tempEnd.push(hours["승인"][i].end);
      }
    }


    // Save that in dataToBeSent object
    dataToBeSent = { ...dataToBeSent, timeRangeType: tempTimeRangeType };
    dataToBeSent = { ...dataToBeSent, start: tempStart };
    dataToBeSent = { ...dataToBeSent, end: tempEnd };



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
                  {timeInputDivWork}
                </Grid>
                <Grid xs={3}>
                  <span>휴게시간</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox onChange={() => handleCheckboxChange("휴게")} checked={isChecked.휴게} />
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
                  <Checkbox onChange={() => handleCheckboxChange("의무")} checked={isChecked.의무} />
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
                  <Checkbox onChange={() => handleCheckboxChange("승인")} checked={isChecked.승인} />
                </Grid>
                {isChecked.승인 ? <Grid xs={8}>
                  <div>승인근로시간대 설정을 사용합니다.</div>
                  <div>
                    사전에 승인을 받은 경우에만 근로시간으로 인정하는 시간을
                    입력할 수 있는 시간대를 설정합니다.
                  </div>
                  {timeInputDivApproved}
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

