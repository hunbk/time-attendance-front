import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Box } from "@mui/material";
import Button from '@mui/material/Button';
import { DataType } from "./WorkGroupEnrollmentPage";
import { DataToBeModifiedType } from "./WorkGroupIndexPage";
import WorkGroupCardList from "src/components/workGroup/WorkGroupCardList";
import Grid from '@mui/material/Grid';
import type { WorkGroupSimpleType } from "./WorkGroupIndexPage";
// import { useAuthState } from '../../context/AuthProvider';

type WorkGroupListPageProps = {
  setIsWorkGroupListHidden: Dispatch<SetStateAction<boolean>>;
  setDataToBeModified: Dispatch<SetStateAction<DataToBeModifiedType>>;
  setWorkGroupSimple: Dispatch<SetStateAction<WorkGroupSimpleType[]>>;
}

export type WorkGroupResponseDtoType = {
  id: number;
  name: string;
  type: string;
  timeRangeType: string;
  start: string;
  end: string;
  numOfMembers: number;
  workDays: string;
  isOn: boolean;
  dateUpdated: string;
};

const WorkGroupListPage: FC<WorkGroupListPageProps> = ({ setIsWorkGroupListHidden, setDataToBeModified, setWorkGroupSimple }) => {
  // const { user } = useAuthState();
  const [workGroupResponseDtoList, setWorkGroupResponseDtoList] = useState<WorkGroupResponseDtoType[]>([]);
  const getData = async () => {
    // const url = `http://localhost:8080/api/workgroups/${user.companyId}`;
    const url = `http://localhost:8080/api/workgroups?companyId=1`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
    });

    response.json().then((data) => {
      const dataFiltered = data.filter((item) => item.name !== "미배포" && item);
      convertDtoToSimple(dataFiltered);
      setWorkGroupResponseDtoList(dataFiltered);
    });
  }

  const convertDtoToSimple = (data: WorkGroupResponseDtoType[]) => {
    const tempSimpleArray: WorkGroupSimpleType[] = [];

    data.forEach((dto) => {
      const tempSimple: WorkGroupSimpleType = {
        id: dto.id,
        name: dto.name,
        type: dto.type,
        numOfMembers: dto.numOfMembers
      };

      tempSimpleArray.push(tempSimple);
    })

    setWorkGroupSimple(tempSimpleArray);
  }

  useEffect(() => {
    getData();
  }, []);

  const alignments: string[] = [];
  const payLeaves: string[] = [];
  const nonPayLeaves: string[] = [];
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const handleDelete = async (workGroupId: number) => {
    // 수정중

    // fetch(`http://localhost:8080/api/workgroups/${workGroupId}`, {
    //   method: 'DELETE',
    // })
    //   .then((response) => response.text())
    //   .then((data) => {
    //     alert(data);
    //     window.location.href = "http://localhost:3000/dashboard/workgroups";
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

  }

  const responseDtoToDataType = (workGroupId: number) => {
    const tempData: DataType = {
      id: workGroupId,
      name: "",
      type: "일반",
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
      companyId: 1
    };

    for (let i = 0; i < workGroupResponseDtoList.length; i += 1) {
      if (workGroupResponseDtoList[i].id === workGroupId) {
        tempData.timeRangeType = workGroupResponseDtoList[i].timeRangeType.split(", ");
        tempData.start = workGroupResponseDtoList[i].start.split(", ");
        tempData.end = workGroupResponseDtoList[i].end.split(", ");
        tempData.name = workGroupResponseDtoList[i].name;
        tempData.type = workGroupResponseDtoList[i].type as "일반" | "시차";
        const workDaysArr = workGroupResponseDtoList[i].workDays.split(", ") as ("근무" | "유급" | "무급")[];
        tempData.workDayType.mon = workDaysArr[0] as "근무" | "유급" | "무급";
        tempData.workDayType.tue = workDaysArr[1] as "근무" | "유급" | "무급";
        tempData.workDayType.wed = workDaysArr[2] as "근무" | "유급" | "무급";
        tempData.workDayType.thu = workDaysArr[3] as "근무" | "유급" | "무급";
        tempData.workDayType.fri = workDaysArr[4] as "근무" | "유급" | "무급";
        tempData.workDayType.sat = workDaysArr[5] as "근무" | "유급" | "무급";
        tempData.workDayType.sun = workDaysArr[6] as "근무" | "유급" | "무급";
        generateAlignments(workDaysArr);
      }
    }
    return tempData;
  }

  const generateAlignments = (workDaysArr: ("근무" | "유급" | "무급")[]) => {
    for (let i = 0; i < workDaysArr.length; i += 1) {
      if (workDaysArr[i] === "근무") {
        alignments.push(DAYS[i]);
      } else if (workDaysArr[i] === "유급") {
        payLeaves.push(DAYS[i]);
      } else {
        nonPayLeaves.push(DAYS[i]);
      }
    }
  };

  const handleModify = (workGroupId: number) => {
    setDataToBeModified({
      id: workGroupId,
      contents: responseDtoToDataType(workGroupId),
      alignments: {
        work: alignments,
        payLeave: payLeaves,
        nonPayLeave: nonPayLeaves
      }
    });
    setIsWorkGroupListHidden(true);
  }

  return (
    <Box m="20px" sx={{ display: "flex", flexDirection: "column" }}>
      {workGroupResponseDtoList.length !== 0 && <Grid container spacing={2}>
        {workGroupResponseDtoList.map((workGroupResponseDto, index) =>
          <Grid item xs={6} key={index}>
            <WorkGroupCardList
              workGroupResponseDto={workGroupResponseDto}
              handleModify={handleModify}
              handleDelete={handleDelete}
            />
          </Grid>)}
      </Grid>
      }
      <Button sx={{ alignSelf: 'flex-end', marginTop: '10px' }} variant="outlined" onClick={() => {
        setIsWorkGroupListHidden(true);
      }}>근로그룹 추가하기</Button>
    </Box>
  );
};

export default WorkGroupListPage;