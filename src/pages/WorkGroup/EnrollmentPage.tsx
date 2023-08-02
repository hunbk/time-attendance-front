import { Dayjs } from 'dayjs';
import {
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
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
import { useImmer } from "use-immer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TimeInputDiv from "../../components/workGroup/TimeInputDiv";
import HolidayPayLeave from "../../components/workGroup/HolidayPayLeave";

type WorkDayTypeType = {
  mon: "근무" | "유급" | "무급";
  tue: "근무" | "유급" | "무급";
  wed: "근무" | "유급" | "무급";
  thu: "근무" | "유급" | "무급";
  fri: "근무" | "유급" | "무급";
  sat: "근무" | "유급" | "무급";
  sun: "근무" | "유급" | "무급";
}

type DataType = {
  name: string;
  type: 'n' | 'f';
  workDayType: WorkDayTypeType,
  timeRangeType: ("work" | "break" | "approved" | "compulsory")[],
  start: [],
  end: [],
}

const EnrollmentPage = ({ setIsWorkGroupListHidden }) => {
  const [hours, setHours] = useImmer({
    work: {
      start: '',
      end: '',
    },
    break: {
      start: '',
      end: '',
    },
    compulsory: {
      start: '',
      end: '',
    },
    approved: {
      start: '',
      end: '',
    }
  })

  const handleHour = (startOrEnd: string, timeType: string, value: Dayjs | null) => {
    setHours((draft) => {
      draft[timeType][startOrEnd] = value?.format('HH:mm:ss');
    })
  }

  const [timeInputDivsBreak, setTimeInputDivsBreak] = useState([
    <>
      <TimeInputDiv
        handleTempHour={handleHour}
        startOrEnd="start"
        timeType="break"
      />
      <TimeInputDiv
        handleTempHour={handleHour}
        startOrEnd="end"
        timeType="break"
      />
    </>,
  ]);
  const [timeInputDivsCompulsory, setTimeInputDivsCompulsory] = useState([
    <>
      <TimeInputDiv
        handleTempHour={handleHour}
        startOrEnd="start"
        timeType="compulsory"
      />
      <TimeInputDiv
        handleTempHour={handleHour}
        startOrEnd="end"
        timeType="compulsory"
      />
    </>,
  ]);

  const addTimeInputDiv = (divKind: "break" | "compulsory") => {
    setData((draft) => {
      draft.timeRangeType.push(divKind);
      draft.start.push(hours[divKind].start);
      draft.end.push(hours[divKind].end);
    })

    if (divKind === "break") {
      setTimeInputDivsBreak([...timeInputDivsBreak, <>
        <TimeInputDiv
          handleTempHour={handleHour}
          startOrEnd="start"
          timeType="break"
        />
        <TimeInputDiv
          handleTempHour={handleHour}
          startOrEnd="end"
          timeType="break"
        />
      </>]);
    } else {
      setTimeInputDivsCompulsory([...timeInputDivsCompulsory, <>
        <TimeInputDiv
          handleTempHour={handleHour}
          startOrEnd="start"
          timeType="compulsory"
        />
        <TimeInputDiv
          handleTempHour={handleHour}
          startOrEnd="end"
          timeType="compulsory"
        />
      </>]);
    }
  };



  let [data, setData] = useImmer({
    name: "",
    type: "general",
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
  });


  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const [alignments, setAlignments] = useState<string[]>([]);
  const [dayHolidays, setDayHolidays] = useState<string[]>([]);
  const [hasHoliday, setHasHoliday] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useImmer({
    break: true,
    compulsory: true,
    approved: true,
  });
  const handleCheckboxChange = (type) => {
    setIsChecked((draft) => { draft[type] = !draft[type] });
  };

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string[]
  ) => {
    setAlignments(newAlignment);
    setDayHolidays(days.filter(day => !newAlignment.includes(day)));

    for (let i = 0; i < newAlignment.length; i += 1) {
      setData((draft) => {
        draft.workDayType[newAlignment[i]] = "근무";
      })
    }
  };

  const updateDayHoliday = (dayHoliday, isPayLeave) => {
    setData((draft) => {
      if (isPayLeave) {
        draft.workDayType[dayHoliday] = "유급";
      } else {
        draft.workDayType[dayHoliday] = "무급";
      }
    })
  }

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  const submitForm = (event) => {
    event.preventDefault();

    data = { ...data, timeRangeType: [...data.timeRangeType, "work"] };
    data = { ...data, start: [...data.start, hours.work.start] };
    data = { ...data, end: [...data.end, hours.work.end] };

    data = { ...data, timeRangeType: [...data.timeRangeType, "break"] };
    data = { ...data, start: [...data.start, hours.break.start] };
    data = { ...data, end: [...data.end, hours.break.end] };

    data = { ...data, timeRangeType: [...data.timeRangeType, "compulsory"] };
    data = { ...data, start: [...data.start, hours.compulsory.start] };
    data = { ...data, end: [...data.end, hours.compulsory.end] };

    data = { ...data, timeRangeType: [...data.timeRangeType, "approved"] };
    data = { ...data, start: [...data.start, hours.approved.start] };
    data = { ...data, end: [...data.end, hours.approved.end] };

    console.log(data);

    fetch('/api/newGroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
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
              <FormLabel id="demo-radio-buttons-group-label">
                근무일 선택
              </FormLabel>
            </FormControl>
            <ToggleButtonGroup
              color="primary"
              value={alignments}
              onChange={handleToggle}
              aria-label="Platform"
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
                    setHasHoliday(true);
                  } else {
                    setHasHoliday(false);

                    for (let i = 0; i < days.length; i += 1) {
                      if (data.workDayType[days[i]] === "유급") {
                        setData((draft) => {
                          draft.workDayType[days[i]] = "무급";
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
            {hasHoliday && dayHolidays.map((dayHoliday, index) => {
              return <HolidayPayLeave key={dayHoliday + index} dayHoliday={dayHoliday} defaultPayLeave={false} updateDayHoliday={updateDayHoliday} />
            })}
          </Grid>
          {/* <Grid xs={3}> </Grid>
          <Grid xs={9}>
            <Box display={"flex"}>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={`출근시간 ??:??`}
                  onDelete={handleDelete}
                />
                <Chip label="Deletable" variant="outlined" onDelete={handleDelete} />
              </Stack>
              <AddCircleOutlineIcon />
            </Box>
          </Grid> */}
          {/* <Grid xs={3}>
            <span>근무테이블</span>
          </Grid>
          <Grid xs={9}>
            ResponsiveBar
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
          </Grid> */}
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
                  <div>
                    <TimeInputDiv
                      handleTempHour={handleHour}
                      timeType="work"
                      startOrEnd="start"
                    />
                    <TimeInputDiv
                      handleTempHour={handleHour}
                      timeType="work"
                      startOrEnd="end"
                    />
                  </div>
                </Grid>
                <Grid xs={3}>
                  <span>휴게시간</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox defaultChecked onChange={() => handleCheckboxChange("break")} />
                </Grid>
                {isChecked.break ? <Grid xs={8}>
                  <div>휴게시간 설정을 사용합니다.</div>
                  <div>휴게시간 시작시간과 종료시간을 입력합니다.</div>
                  {timeInputDivsBreak.map((div, index) => {
                    return <div key={`${div}${index}`}>{div}</div>;
                  })}
                  <Button
                    onClick={() => {
                      addTimeInputDiv("break");
                    }}
                  >
                    <AddIcon sx={{ border: "1px solid" }} />
                  </Button>
                </Grid> : <Grid xs={8}> </Grid>}
                <Grid xs={3}>
                  <span>의무근로시간대</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox defaultChecked onChange={() => handleCheckboxChange("compulsory")} />
                </Grid>
                {isChecked.compulsory ? <Grid xs={8}>
                  <div>의무근로시간대 설정을 사용합니다.</div>
                  <div>
                    업무협조 및 업무특성을 감안하여 반드시 근무해야하는 시간을
                    입력할 수 있는 시간대를 설정합니다.
                  </div>
                  {timeInputDivsCompulsory.map((div, index) => {
                    return <div key={`${div}${index}`}>{div}</div>;
                  })}
                  <Button
                    onClick={() => {
                      addTimeInputDiv("compulsory");
                    }}
                  >
                    <AddIcon sx={{ border: "1px solid" }} />
                  </Button>
                </Grid> : <Grid xs={8}> </Grid>}
                <Grid xs={3}>
                  <span>승인근로시간대</span>
                </Grid>
                <Grid xs={1}>
                  <Checkbox defaultChecked onChange={() => handleCheckboxChange("approved")} />
                </Grid>
                {isChecked.approved ? <Grid xs={8}>
                  <div>승인근로시간대 설정을 사용합니다.</div>
                  <div>
                    사전에 승인을 받은 경우에만 근로시간으로 인정하는 시간을
                    입력할 수 있는 시간대를 설정합니다.
                  </div>
                  <div>
                    <TimeInputDiv
                      handleTempHour={handleHour}
                      startOrEnd="start"
                      timeType="approved"
                    />
                    <TimeInputDiv
                      handleTempHour={handleHour}
                      startOrEnd="end"
                      timeType="approved"
                    />
                  </div>
                </Grid> : <Grid xs={8}> </Grid>}
              </Grid>
            </Card>
          </Grid>
        </Grid>
        <Typography sx={{alignSelf: "center", margin: "10px"}} component={"div"}>
          <Button variant="outlined" onClick={() => setIsWorkGroupListHidden(false)} sx={{marginRight: "10px"}}>취소</Button>
          <Button type="submit" variant="contained">
            저장
          </Button>
        </Typography>
      </Box>
    </form>
  );
};

export default EnrollmentPage;
