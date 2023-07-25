import {
  Button,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState } from "react";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import TimeInputDiv from "../../components/TimeInputDiv";
import { ResponsiveBar } from "@nivo/bar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useImmer } from "use-immer";

const NewGroup = () => {
  const theme = useTheme();

  const handleTempHour = (
    startOrEnd: string,
    timeType: string,
    value: string
  ) => {
    if (startOrEnd === "start" && value.length !== 0) {
      switch (timeType) {
        case "work":
          setTempHour((draft) => {
            draft.work.startHour = value;
          });
          break;
        case "break":
          setTempHour((draft) => {
            draft.break.startHour = value;
          });
          break;
        case "compulsory":
          setTempHour((draft) => {
            draft.compulsory.startHour = value;
          });
          break;
        case "overTime":
          setTempHour((draft) => {
            draft.overTime.startHour = value;
          });
          break;
      }
    } else if (startOrEnd === "end" && value.length !== 0) {
      switch (timeType) {
        case "work":
          setTempHour((draft) => {
            draft.work.endHour = value;
          });
          break;
        case "break":
          setTempHour((draft) => {
            draft.break.endHour = value;
          });
          break;
        case "compulsory":
          setTempHour((draft) => {
            draft.compulsory.endHour = value;
          });
          break;
        case "overTime":
          setTempHour((draft) => {
            draft.overTime.endHour = value;
          });
          break;
      }
    }
  };

  // const newDivs = (
  //     <>
  //         <TimeInputDiv handleTempHour={handleTempHour} startOrEnd="start" timeType={timeType} />
  //         <TimeInputDiv handleTempHour={handleTempHour} startOrEnd="end" timeType={timeType} />
  //     </>
  // );
  // => remove the duplicate

  const [timeInputDivsBreak, setTimeInputDivsBreak] = useState([
    <>
      <TimeInputDiv
        handleTempHour={handleTempHour}
        startOrEnd="start"
        timeType="break"
      />
      <TimeInputDiv
        handleTempHour={handleTempHour}
        startOrEnd="end"
        timeType="break"
      />
    </>,
  ]);
  const [timeInputDivsCompulsory, setTimeInputDivsCompulsory] = useState([
    <>
      <TimeInputDiv
        handleTempHour={handleTempHour}
        startOrEnd="start"
        timeType="compulsory"
      />
      <TimeInputDiv
        handleTempHour={handleTempHour}
        startOrEnd="end"
        timeType="compulsory"
      />
    </>,
  ]);

  let [tempHour, setTempHour] = useImmer({
    work: {
      startHour: "",
      endHour: "",
    },
    break: {
      startHour: "",
      endHour: "",
    },
    compulsory: {
      startHour: "",
      endHour: "",
    },
    overTime: {
      startHour: "",
      endHour: "",
    },
  });

  const addTimeInputDiv = (divKind: string) => {
    const handleDivs = (dataProp, timeInputDivsProp, timeType) => {
      setData((draft) => {
        draft[dataProp] = [
          ...draft[dataProp],
          tempInputTimeToDB(
            tempHour[timeType].startHour,
            tempHour[timeType].endHour
          ),
        ];
      });

      const newDivs = (
        <>
          <TimeInputDiv
            handleTempHour={handleTempHour}
            startOrEnd="start"
            timeType={timeType}
          />
          <TimeInputDiv
            handleTempHour={handleTempHour}
            startOrEnd="end"
            timeType={timeType}
          />
        </>
      );

      timeInputDivsProp((prevDivs) => [...prevDivs, newDivs]);
    };

    if (divKind === "break") {
      handleDivs("breakTime", setTimeInputDivsBreak, "break");
    } else if (divKind === "compulsory") {
      handleDivs(
        "workHourCompulsory",
        setTimeInputDivsCompulsory,
        "compulsory"
      );
    }
  };

  const colors = tokens(theme.palette.mode);
  let [data, setData] = useImmer({
    name: "",
    type: "general",
    workDay: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    hasHoliday: true,
    payLeaveSat: false,
    payLeaveSun: true,
    workHour: "0900-1800",
    breakTime: [],
    workHourCompulsory: [],
    workHourOvertime: "",
    hasRecordRestriction: false,
    recordRestrictionMethod: "",
    isOn: false,
    additionalWorkStartTime: [],
  });

  //input=> 09:00 //DB=> 0900-1800
  const tempInputTimeToDB = (startTime: string, endTime: string) => {
    let newStartTime = startTime.slice(0, 2) + startTime.slice(3, 5);
    let newEndTime = endTime.slice(0, 2) + endTime.slice(3, 5);

    return newStartTime + "-" + newEndTime;
  };

  const tempDBTimeToInput = (DBTime: string) => {
    let newStartTime = DBTime.slice(0, 4);
    newStartTime = newStartTime.slice(0, 2) + ":" + newStartTime.slice(2, 4);
    let newEndTime = DBTime.slice(5, 9);
    newEndTime = newEndTime.slice(0, 2) + ":" + newEndTime.slice(2, 4);

    return [newStartTime, newEndTime];
  };

  const [workHourStartTime, workHourEndTime] = tempDBTimeToInput(data.workHour);

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string[]
  ) => {
    setData({ ...data, workDay: newAlignment });
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  const submitForm = (event) => {
    event.preventDefault();

    data = {
      ...data,
      breakTime: [
        ...data.breakTime,
        tempInputTimeToDB(tempHour.break.startHour, tempHour.break.endHour),
      ],
    };
    data = {
      ...data,
      workHour: tempInputTimeToDB(
        tempHour.work.startHour,
        tempHour.work.endHour
      ),
    };
    data = {
      ...data,
      workHourCompulsory: [
        ...data.workHourCompulsory,
        tempInputTimeToDB(
          tempHour.compulsory.startHour,
          tempHour.compulsory.endHour
        ),
      ],
    };
    data = {
      ...data,
      workHourOvertime: tempInputTimeToDB(
        tempHour.overTime.startHour,
        tempHour.overTime.endHour
      ),
    };

    console.log(data);

    // const formData = {
    //     groupName: groupName,
    //     // Add more properties with the data from other components
    // };

    // // Send the data using fetch
    // fetch('your-endpoint-url', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
    // })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         // Handle the response data if needed
    //         console.log(data);
    //     })
    //     .catch((error) => {
    //         // Handle any errors
    //         console.error(error);
    //     });
  };

  return (
    <form onSubmit={submitForm}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <span>근로제 그룹명</span>
          </Grid>
          <Grid xs={9}>
            <span>
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={data.name}
                size="small"
                placeholder="그룹명을 입력하세요"
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                }}
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
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="general"
                  name="radio-buttons-group"
                  row
                  onChange={(e) => setData({ ...data, type: e.target.value })}
                >
                  <FormControlLabel
                    value="general"
                    control={<Radio />}
                    label="일반근로제"
                  />
                  <FormControlLabel
                    value="flextime"
                    control={<Radio />}
                    label="시차출퇴근제"
                  />
                  <FormControlLabel
                    value="flextimeDeemed"
                    control={<Radio />}
                    label="선택적근로시간제"
                  />
                </RadioGroup>
              </FormControl>
            </span>
          </Grid>
          <Grid xs={3}>
            <span>근로제 알아보기</span>
          </Grid>
          <Grid xs={9}>
            <div>일반근로제: ~~</div>
            <div>시차출퇴근제: ~~</div>
            <div>간주근로시간제: ~~</div>
          </Grid>
          <Grid xs={3}>
            <div>근무일지정</div>
            <div>소정근무일을 지정합니다</div>
          </Grid>
          <Grid xs={9}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                근무일 선택
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="general"
                name="radio-buttons-group"
                row
              >
                <FormControlLabel
                  value="general"
                  control={<Radio />}
                  label="월요일~금요일"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="직접입력"
                />
              </RadioGroup>
            </FormControl>
            <ToggleButtonGroup
              color="primary"
              value={data.workDay}
              onChange={handleToggle}
              aria-label="Platform"
            >
              <ToggleButton value="Mon">월</ToggleButton>
              <ToggleButton value="Tue">화</ToggleButton>
              <ToggleButton value="Wed">수</ToggleButton>
              <ToggleButton value="Thu">목</ToggleButton>
              <ToggleButton value="Fri">금</ToggleButton>
              <ToggleButton value="Sat">토</ToggleButton>
              <ToggleButton value="Sun">일</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid xs={3}>
            <div>휴일구분</div>
            <div>휴일 구분을 지정합니다</div>
          </Grid>
          <Grid xs={9}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                휴일구분사용
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="on"
                name="radio-buttons-group"
                row
                onChange={(e) => {
                  if (e.target.value === "on") {
                    setData({ ...data, hasHoliday: true });
                  } else {
                    setData({ ...data, hasHoliday: false });
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
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <FormLabel id="demo-radio-buttons-group-label">
                  토요일
                </FormLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select1"
                  value={data.payLeaveSat === true ? "payLeave" : "nonPayLeave"}
                  label="payLeaveSelect1"
                  onChange={(e) => {
                    if (e.target.value === "payLeave") {
                      setData({ ...data, payLeaveSat: true });
                    } else {
                      setData({ ...data, payLeaveSat: false });
                    }
                  }}
                >
                  <MenuItem value="payLeave">유급휴일</MenuItem>
                  <MenuItem value="nonPayLeave">무급휴무일</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <FormLabel id="demo-radio-buttons-group-label">
                  일요일
                </FormLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select2"
                  value={data.payLeaveSun === true ? "payLeave" : "nonPayLeave"}
                  label="payLeaveSelect2"
                  onChange={(e) => {
                    if (e.target.value === "payLeave") {
                      setData({ ...data, payLeaveSun: true });
                    } else {
                      setData({ ...data, payLeaveSun: false });
                    }
                  }}
                >
                  <MenuItem value="payLeave">유급휴일</MenuItem>
                  <MenuItem value="nonPayLeave">무급휴무일</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid xs={3}>
            <span></span>
          </Grid>
          <Grid xs={9}>
            <Box display={"flex"}>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={`출근시간 ${workHourStartTime}`}
                  onDelete={handleDelete}
                />
                {/* <Chip label="Deletable" variant="outlined" onDelete={handleDelete} /> */}
              </Stack>

              <AddCircleOutlineIcon />
            </Box>
          </Grid>
          <Grid xs={3}>
            <span>근무테이블</span>
          </Grid>
          <Grid xs={9}>
            <ResponsiveBar
              data={[
                {
                  work: 8,
                  workColor: "hsl(73, 70%, 50%)",
                  break: 1,
                  breakColor: "hsl(360, 70%, 50%)",
                  compulsory: 8,
                  compulsoryColor: "hsl(136, 70%, 50%)",
                  overTime: 8,
                  overTimeColor: "hsl(43, 70%, 50%)",
                },
              ]}
              keys={["work", "break", "compulsory", "overTime"]}
              padding={0.3}
              layout="horizontal"
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              role="application"
              ariaLabel="Nivo bar chart demo"
              barAriaLabel={(e) =>
                e.id + ": " + e.formattedValue + " in country: " + e.indexValue
              }
            />
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
                <Grid xs={1}></Grid>
                <Grid xs={8}>
                  <div>
                    근무시작 및 종료시각을 근로자의 결정으로 선택할 수 있는
                    시간대를 입력합니다.
                  </div>
                  <div>
                    <TimeInputDiv
                      handleTempHour={handleTempHour}
                      timeType="work"
                      startOrEnd="start"
                    />
                    <TimeInputDiv
                      handleTempHour={handleTempHour}
                      timeType="work"
                      startOrEnd="end"
                    />
                  </div>
                </Grid>
                <Grid xs={3}>
                  <span>휴게시간</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox defaultChecked />
                </Grid>
                <Grid xs={8}>
                  <div>휴게시간 설정을 사용합니다.</div>
                  <div>휴게시간 시작시간과 종료시간을 입력합니다.</div>
                  {timeInputDivsBreak.map((div, index) => {
                    return <div key={"break" + index}>{div}</div>;
                  })}
                  <Button
                    onClick={() => {
                      addTimeInputDiv("break");
                    }}
                  >
                    <AddIcon sx={{ border: "1px solid" }} />
                  </Button>
                </Grid>
                <Grid xs={3}>
                  <span>의무근로시간대</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox defaultChecked />
                </Grid>
                <Grid xs={8}>
                  <div>의무근로시간대 설정을 사용합니다.</div>
                  <div>
                    업무협조 및 업무특성을 감안하여 반드시 근무해야하는 시간을
                    입력할 수 있는 시간대를 설정합니다.
                  </div>
                  {timeInputDivsCompulsory.map((div, index) => {
                    return <div key={"compulsory" + index}>{div}</div>;
                  })}
                  <Button
                    onClick={() => {
                      addTimeInputDiv("compulsory");
                    }}
                  >
                    <AddIcon sx={{ border: "1px solid" }} />
                  </Button>
                </Grid>
                <Grid xs={3}>
                  <span>승인근로시간대</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox defaultChecked />
                </Grid>
                <Grid xs={8}>
                  <div>승인근로시간대 설정을 사용합니다.</div>
                  <div>
                    사전에 승인을 받은 경우에만 근로시간으로 인정하는 시간을
                    입력할 수 있는 시간대를 설정합니다.
                  </div>
                  <div>
                    <TimeInputDiv
                      handleTempHour={handleTempHour}
                      startOrEnd="start"
                      timeType="overTime"
                    />
                    <TimeInputDiv
                      handleTempHour={handleTempHour}
                      startOrEnd="end"
                      timeType="overTime"
                    />
                  </div>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
        <Button variant="outlined">취소</Button>
        <Button type="submit" variant="contained">
          저장
        </Button>
      </Box>
    </form>
  );
};

export default NewGroup;
