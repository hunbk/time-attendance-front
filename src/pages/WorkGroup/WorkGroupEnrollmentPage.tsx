import type { Dayjs } from 'dayjs';
import dayjs from "dayjs";
import {
  Button,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Dispatch, FC, FormEvent, SetStateAction, useState, MouseEvent, useEffect, Fragment, useCallback } from "react";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import { useImmer } from "use-immer";
import TimeInputDiv from "../../components/workGroup/TimeInputDiv";
import HolidayPayLeave from "../../components/workGroup/HolidayPayLeave";
import { useAuthState } from '../../context/AuthProvider';
import { handleDataModification } from 'src/utils/workGroupHandleRequest';
import { DataType, DataToBeModifiedType } from './WorkGroupIndexPage';
import Swal from 'sweetalert2'

type WorkGroupEnrollmentPageProps = {
  setIsWorkGroupListHidden: Dispatch<SetStateAction<boolean>>;
  dataToBeModified: DataToBeModifiedType;
  setDataToBeModified: Dispatch<SetStateAction<DataToBeModifiedType>>;
}

type DefaultHour = { start: string, end: string };

const WorkGroupEnrollmentPage: FC<WorkGroupEnrollmentPageProps> = ({ setIsWorkGroupListHidden, dataToBeModified, setDataToBeModified }) => {
  const { user } = useAuthState();
  const [hours, setHours] = useImmer({
    "근무": [{ start: '', end: '' }],
    "휴게": [{ start: '', end: '' }],
    "의무": [{ start: '', end: '' }],
    "승인": [{ start: '', end: '' }],
  });
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  // eslint-disable-next-line prefer-const
  let [isChecked, setIsChecked] = useImmer({
    근무: true,
    휴게: true,
    의무: true,
    승인: true,
  });
  const [currentTimeInputDivIndex, setCurrentTimeInputDivIndex] = useImmer({
    근무: 0,
    휴게: 0,
    의무: 0,
  });
  const timeInputDivSet = useCallback(
    (timeType: string, index: number, timeRangeByType?: DefaultHour[], isFromAdd?: boolean) => {
      const handleHour = (index: number, startOrEnd: string, timeType: string, value: Dayjs | null) => {
        setHours((draft) => {
          // Capture the current start time from the draft state
          const currentStartTime = draft[timeType][index].start;

          // Check the condition using the captured start time
          if (startOrEnd === "end" && value.isBefore(dayjs(currentStartTime, 'HH:mm:ss'))) {
            Swal.fire({
              title: '시작시간보다 종료시간이 \n빠를 수 없습니다.',
              icon: 'error',
              confirmButtonText: '확인',
              confirmButtonColor: "#2065D1"
            })
          }

          draft[timeType][index][startOrEnd] = value?.format('HH:mm:ss');
        });
      }
      const renderTimeInputDivs = (timeType: string, index: number, defaultValueStart: Dayjs, defaultValueEnd: Dayjs, key?: string) => (
        <Box sx={{ display: "inline-flex" }} key={key}>
          <TimeInputDiv
            index={index}
            handleTempHour={handleHour}
            startOrEnd="start"
            timeType={timeType}
            defaultValue={defaultValueStart}
          />
          <TimeInputDiv
            index={index}
            handleTempHour={handleHour}
            startOrEnd="end"
            timeType={timeType}
            defaultValue={defaultValueEnd}
          />
        </Box>
      );

      if (timeRangeByType && !isFromAdd) {
        return (
          timeRangeByType.map((matchedRange, mapIndex) =>
            <Fragment key={mapIndex}>
              {renderTimeInputDivs(timeType, mapIndex, dayjs(matchedRange.start, 'HH:mm:ss'), dayjs(matchedRange.end, 'HH:mm:ss'))}
            </Fragment>
          ));
      }

      return [renderTimeInputDivs(timeType, index, null, null, timeType)];

    },
    [setHours]
  );

  const [timeInputDivsBreak, setTimeInputDivsBreak] = useState(
    timeInputDivSet("휴게", 0)
  );
  const [timeInputDivsCompulsory, setTimeInputDivsCompulsory] = useState(
    timeInputDivSet("의무", 0)
  );
  const [timeInputDivsWork, setTimeInputDivsWork] = useState(
    timeInputDivSet("근무", 0)
  );
  const [timeInputDivApproved, setTimeInputDivApproved] = useState(
    timeInputDivSet("승인", 0)
  );
  const [alignments, setAlignments] = useState<string[]>(dataToBeModified ? dataToBeModified.alignments.work : ["mon", "tue", "wed", "thu", "fri"]);
  const [dayHolidays, setDayHolidays] = useState<string[]>(dataToBeModified ? DAYS.filter(day => !dataToBeModified.alignments.work.includes(day)) : ["sat", "sun"]);
  const [holidayOnOff, setHolidayOnOff] = useState<"on" | "off">("on");
  const [data, setData] = useImmer<DataType>(dataToBeModified ? dataToBeModified.contents : {
    id: 0,
    name: "",
    type: "일반",
    workDayType: {
      mon: '근무',
      tue: '근무',
      wed: '근무',
      thu: '근무',
      fri: '근무',
      sat: '무급',
      sun: '무급',
    },
    timeRangeType: [],
    start: [],
    end: [],
    companyId: user.companyId
  });
  const [isTextFieldError, setIsTextFieldError] = useState<boolean>(false);

  useEffect(() => {
    if (dataToBeModified) {
      const getTimeRangeByType = (timeRangeType: string[], start: string[], end: string[], targetType: string) => {
        const matchedRanges = [];

        for (let i = 0; i < timeRangeType.length; i += 1) {
          if (timeRangeType[i] === targetType) {
            matchedRanges.push({ start: start[i], end: end[i] });
          }
        }

        return matchedRanges;
      }

      const types = ["근무", "휴게", "의무", "승인"];
      const tempHours: Record<"근무" | "휴게" | "의무" | "승인", DefaultHour[]> = {
        "근무": [{ start: '', end: '' }],
        "휴게": [{ start: '', end: '' }],
        "의무": [{ start: '', end: '' }],
        "승인": [{ start: '', end: '' }],
      };

      types.forEach(type => {
        const matchedRanges = getTimeRangeByType(
          dataToBeModified.contents.timeRangeType,
          dataToBeModified.contents.start,
          dataToBeModified.contents.end,
          type
        );

        if (matchedRanges.length !== 0) {
          tempHours[type] = matchedRanges;
        }
      });

      setHours(tempHours);
      setCurrentTimeInputDivIndex((draft) => {
        draft["근무"] = tempHours["근무"].length - 1;
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
        if (tempHours[key][0].start.length !== 0) {
          switch (key) {
            case "근무":
              setTimeInputDivsWork(timeInputDivSet("근무", 0, tempHours["근무"]));
              break;
            case "휴게":
              setTimeInputDivsBreak(timeInputDivSet("휴게", 0, tempHours["휴게"]));
              break;
            case "승인":
              setTimeInputDivApproved(timeInputDivSet("승인", 0, tempHours["승인"]));
              break;
            case "의무":
              setTimeInputDivsCompulsory(timeInputDivSet("의무", 0, tempHours["의무"]));
              break;
            default:
          }
        }
      });
    }
  }, [dataToBeModified, setCurrentTimeInputDivIndex, setHours, setIsChecked, timeInputDivSet]);

  const addTimeInputDiv = (divKind: "근무" | "휴게" | "의무") => {
    setCurrentTimeInputDivIndex((draft) => {
      draft[divKind] += 1;
    })
    setHours((draft) => {
      draft[divKind].push({ start: '', end: '' });
    })

    if (divKind === "휴게") {
      setTimeInputDivsBreak([...timeInputDivsBreak, ...timeInputDivSet("휴게", currentTimeInputDivIndex["휴게"] + 1)]);
    } else if (divKind === "의무") {
      setTimeInputDivsCompulsory([...timeInputDivsCompulsory, ...timeInputDivSet("의무", currentTimeInputDivIndex["의무"] + 1)]);
    } else {
      setTimeInputDivsWork([...timeInputDivsWork, ...timeInputDivSet("근무", currentTimeInputDivIndex["근무"] + 1)]);
    }
  };
  const removeTimeInputDiv = (divKind: "근무" | "휴게" | "의무") => {
    setCurrentTimeInputDivIndex((draft) => {
      draft[divKind] -= 1;
    })

    // Remove the last element from the array(hours) with the matched divKind
    setHours((draft) => {
      draft[divKind].pop();
    });

    // setTimeInputDivs except the last element with the matched divKind
    if (divKind === "휴게") {
      setTimeInputDivsBreak(timeInputDivsBreak.slice(0, -1));
    }
    else if (divKind === "의무") {
      setTimeInputDivsCompulsory(timeInputDivsCompulsory.slice(0, -1));
    } else {
      setTimeInputDivsWork(timeInputDivsWork.slice(0, -1));
    }
  }
  const handleCheckboxChange = (type: "근무" | "휴게" | "승인" | "의무") => {
    if (isChecked[type]) {
      setHours((draft) => {
        draft[type] = [{ start: '', end: '' }];
      });
      if (type === "근무" || type === "휴게" || type === "의무") {
        setCurrentTimeInputDivIndex((draft) => {
          draft[type] = 0;
        })
      }

      isChecked = { ...isChecked, [type]: false };

      switch (type) {
        case "근무":
          setTimeInputDivsWork(timeInputDivSet("근무", 0));
          break;
        case "휴게":
          setTimeInputDivsBreak(timeInputDivSet("휴게", 0));
          break;
        case "승인":
          setTimeInputDivApproved(timeInputDivSet("승인", 0));
          break;
        case "의무":
          setTimeInputDivsCompulsory(timeInputDivSet("의무", 0));
          break;
        default:
      }
    }

    setIsChecked((draft) => { draft[type] = !draft[type] });
  };

  const handleToggle = (_event: MouseEvent<HTMLElement>, newAlignment: string[]) => {
    if (newAlignment.length !== 0) {
      setAlignments(newAlignment);
      setDayHolidays(DAYS.filter(day => !newAlignment.includes(day)));

      for (let i = 0; i < newAlignment.length; i += 1) {
        setData((draft) => {
          draft.workDayType[newAlignment[i]] = "근무";
        })
      }
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

    let isReturn = false;
    dataToBeSent = data;

    if (data.name.length === 0) {
      setIsTextFieldError(true);
      return;
    }

    if (alignments.length === 0) {
      Swal.fire({
        title: '근무일은 최소 1일 이상이어야합니다.',
        icon: 'error',
        confirmButtonText: '확인',
        confirmButtonColor: "#2065D1"
      })

      return;
    }

    if (hours["근무"][0].start.length === 0 || hours["근무"][0].end.length === 0) {
      Swal.fire({
        title: '근무시간 입력은 필수입니다.',
        icon: 'error',
        confirmButtonText: '확인',
        confirmButtonColor: "#2065D1"
      })

      return;
    }

    const keys = ["근무", "휴게", "의무", "승인"];

    // iterate through start and end arrays and check if the time in end array is before the time in start array at each index
    keys.forEach(key => {
      if (hours[key][0].start.length !== 0) {
        for (let i = 0; i < hours[key].length; i += 1) {
          if (dayjs(hours[key][i].end, 'HH:mm:ss').isBefore(dayjs(hours[key][i].start, 'HH:mm:ss'))) {
            Swal.fire({
              title: `${key}시작시간보다 종료시간이 빠를 수 없습니다.`,
              icon: 'error',
              confirmButtonText: '확인',
              confirmButtonColor: "#2065D1"
            })

            isReturn = true;
          }
        }
      }
    });

    if (!isReturn) {
      const tempTimeRangeType = [];
      const tempStart = [];
      const tempEnd = [];

      // Delete all timeRangeType, start, end arrays in dataToBeSent
      dataToBeSent = { ...dataToBeSent, timeRangeType: [] };
      dataToBeSent = { ...dataToBeSent, start: [] };
      dataToBeSent = { ...dataToBeSent, end: [] };

      // Convert hours array into timeRangeType, start, end arrays
      keys.forEach(key => {
        if (hours[key][0].start.length !== 0) {
          for (let i = 0; i < hours[key].length; i += 1) {
            tempTimeRangeType.push(key);
            tempStart.push(hours[key][i].start);
            tempEnd.push(hours[key][i].end);
          }
        }
      });

      // Save that in dataToBeSent object
      dataToBeSent = { ...dataToBeSent, timeRangeType: tempTimeRangeType };
      dataToBeSent = { ...dataToBeSent, start: tempStart };
      dataToBeSent = { ...dataToBeSent, end: tempEnd };

      handleDataModification(dataToBeSent, dataToBeModified && dataToBeModified.id);
    }
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <form onSubmit={submitForm}>
        <Box m="20px" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Card sx={{ height: "240px", minWidth: "450px", padding: "10px" }}>
              <Box>
                <TextField
                  sx={{
                    margin: "10px",
                  }}
                  variant="outlined"
                  value={data.name}
                  size="small"
                  placeholder="그룹명을 입력하세요"
                  onChange={(e) => {
                    setData({ ...data, name: e.target.value });
                  }}
                  onClick={() => setIsTextFieldError(false)}
                  error={isTextFieldError}
                  helperText={isTextFieldError ? "그룹명이 공백일 수 없습니다." : ""}
                />
                <FormControl sx={{ margin: "10px" }}>
                  <RadioGroup
                    value={data.type}
                    defaultValue={'일반'}
                    row
                    onChange={(e) => {
                      setData({ ...data, type: e.target.value as "일반" | "시차" });

                      if (e.target.value === "일반") {
                        setTimeInputDivsWork(timeInputDivSet("근무", 0));
                      }
                    }
                    }
                  >
                    <FormControlLabel
                      value="일반"
                      control={<Radio />}
                      label="일반"
                    />
                    <FormControlLabel
                      value="시차"
                      control={<Radio />}
                      label="시차"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box sx={{ margin: "10px", display: "flex", flexDirection: "column" }}>
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
              </Box>
              <Box sx={{ margin: "10px", height: "230px" }}>
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
              </Box>
            </Card>
            <Box sx={{ marginLeft: "10px", marginTop: "10px", display: "flex", flexWrap: "wrap", maxWidth: "450px" }}>
              {holidayOnOff === "on" ? dayHolidays.map((dayHoliday, index) =>
                <Box key={dayHoliday + index} sx={{ display: "inline-flex", marginLeft: "10px", marginBottom: "10px" }}>
                  <Card sx={{ maxHeight: "100px" }}>
                    <HolidayPayLeave dayHoliday={dayHoliday} defaultPayLeave={dataToBeModified ? dataToBeModified.alignments.payLeave.includes(dayHoliday) : false} updateDayHoliday={updateDayHoliday} />
                  </Card>
                </Box>
              ) : <></>}
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "start" }}>
            <Card sx={{ marginTop: "10px", marginRight: "10px", backgroundColor: "#fefefe", height: data.type === "일반" ? "150px" : "", width: "450px", padding: "10px" }}>
              <Box sx={{ margin: "10px" }}>
                <Typography variant='subtitle1' sx={{ padding: "9px 0" }} component={'span'}>근무시간</Typography>
                <Checkbox onChange={() => handleCheckboxChange("근무")} checked={isChecked.근무} disabled={data.type === "일반"} />
                {isChecked.근무 ? <>
                  {timeInputDivsWork.map((div, index) =>
                    <div key={`${index}`}>{div}</div>
                  )}
                  {data.type === "시차" && <>
                    <IconButton
                      onClick={() => {
                        addTimeInputDiv("근무");
                      }}
                      color="primary"
                    >
                      <AddIcon sx={{ border: "1px solid" }} />
                    </IconButton>
                    {currentTimeInputDivIndex.근무 >= 1 && <IconButton
                      onClick={() => {
                        removeTimeInputDiv("근무");
                      }}
                    >
                      <RemoveIcon sx={{ border: "1px solid" }} />
                    </IconButton>}</>}
                </> : <></>}

              </Box>
            </Card>
            <Card sx={{ marginTop: "10px", marginRight: "10px", backgroundColor: "#fefefe", height: data.type === "일반" ? "150px" : "", width: "450px", padding: "10px" }}>
              <Box sx={{ margin: "10px" }}>
                <Typography variant='subtitle1' component={'span'}>승인근로시간</Typography>
                <Checkbox onChange={() => handleCheckboxChange("승인")} checked={isChecked.승인} />
                {isChecked.승인 ? <>
                  {timeInputDivApproved}
                </> : <></>}
              </Box>
            </Card>
          </Box>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "start" }}>
            <Card sx={{ marginTop: "10px", marginRight: "10px", backgroundColor: "#fefefe", width: "450px", padding: "10px" }}>
              <Box sx={{ margin: "10px" }}>
                <Typography variant='subtitle1' component={'span'}>휴게시간</Typography>
                <Checkbox onChange={() => handleCheckboxChange("휴게")} checked={isChecked.휴게} />
                {isChecked.휴게 ? <>
                  {timeInputDivsBreak.map((div, index) =>
                    <div key={`${index}`}>{div}</div>
                  )}
                  <>
                    <IconButton
                      onClick={() => {
                        addTimeInputDiv("휴게");
                      }}
                      color="primary"
                    >
                      <AddIcon sx={{ border: "1px solid" }} />
                    </IconButton>
                    {currentTimeInputDivIndex.휴게 >= 1 && <IconButton
                      onClick={() => {
                        removeTimeInputDiv("휴게");
                      }}
                    >
                      <RemoveIcon sx={{ border: "1px solid" }} />
                    </IconButton>}
                  </>
                </> : <> </>}
              </Box>
            </Card>
            <Card sx={{ marginTop: "10px", marginRight: "10px", backgroundColor: "#fefefe", width: "450px", padding: "10px" }}>
              <Box sx={{ margin: "10px" }}>
                <Typography variant='subtitle1' component={'span'}>의무근로시간</Typography>
                <Checkbox onChange={() => handleCheckboxChange("의무")} checked={isChecked.의무} />
                {isChecked.의무 ? <>
                  {timeInputDivsCompulsory.map((div, index) =>
                    <div key={`${index}`}>{div}</div>
                  )}
                  <>
                    <IconButton
                      onClick={() => {
                        addTimeInputDiv("의무");
                      }}
                      color="primary"
                    >
                      <AddIcon sx={{ border: "1px solid" }} />
                    </IconButton>
                    {currentTimeInputDivIndex.의무 >= 1 && <IconButton
                      onClick={() => {
                        removeTimeInputDiv("의무");
                      }}
                    >
                      <RemoveIcon sx={{ border: "1px solid" }} />
                    </IconButton>}
                  </>
                </> : <></>}
              </Box>
            </Card>
          </Box>
          <Typography sx={{ alignSelf: "center", margin: "10px" }} component={"div"}>
            <Button variant="outlined" onClick={handleCancel} sx={{ marginRight: "10px" }}>취소</Button>
            <Button type="submit" variant="contained">
              {dataToBeModified === null ? "저장" : "수정"}
            </Button>
          </Typography>
        </Box >
      </form >
    </Box>
  );
};

export default WorkGroupEnrollmentPage;