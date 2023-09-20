import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Box } from "@mui/material";
import Button from '@mui/material/Button';
import { DataToBeModifiedType, DataType } from "./WorkGroupIndexPage";
import WorkGroupCardList from "src/components/workGroup/WorkGroupCardList";
import Grid from '@mui/material/Grid';
import type { WorkGroupSimpleType } from "./WorkGroupIndexPage";
import { useAuthState } from '../../context/AuthProvider';
import handleRequest, { FetchResultType } from "src/utils/workGroupHandleRequest";
import { enqueueSnackbar } from "notistack";

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
  const { user } = useAuthState();
  const [workGroupResponseDtoList, setWorkGroupResponseDtoList] = useState<WorkGroupResponseDtoType[]>([]);

  useEffect(() => {
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
    const fetchWorkGroups = async () => {
      const { status, data }: FetchResultType = await handleRequest('get', `/api/workgroups?companyId=${user.companyId}`);

      if (status === 200) {
        const dataFiltered = data.filter((item: WorkGroupResponseDtoType) => item.name !== "미배포" && item);
        convertDtoToSimple(dataFiltered);
        setWorkGroupResponseDtoList(dataFiltered);
      }
    }

    fetchWorkGroups();

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const enrollmentSuccessValue = params.get('enrollmentSuccess');
    const messageValue = params.get('message');

    if (enrollmentSuccessValue) {
      enqueueSnackbar(`${messageValue}`, { variant: "success" });
      params.delete('enrollmentSuccess');
      params.delete('message');
      url.search = params.toString();
      window.history.replaceState({}, '', url.toString());
    }
  }, [setWorkGroupResponseDtoList, setWorkGroupSimple, user.companyId]);

  const alignments: string[] = [];
  const payLeaves: string[] = [];
  const nonPayLeaves: string[] = [];
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const handleDelete = async (workGroupId: number) => {
    const { status }: FetchResultType = await handleRequest('delete', `/api/workgroups/${workGroupId}`);

    if (status === 200) {
      setWorkGroupResponseDtoList(prevList => prevList.filter((workGroupResponseDto) => workGroupResponseDto.id !== workGroupId))
    }
  }

  const responseDtoToDataType = (workGroupId: number) => {
    const defaultData: DataType = {
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
      companyId: user.companyId
    };

    const workGroup = workGroupResponseDtoList.find(dto => dto.id === workGroupId);

    if (!workGroup) return defaultData;

    const {
      timeRangeType,
      start,
      end,
      name,
      type,
      workDays
    } = workGroup;

    const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const workDaysArr = workDays.split(", ") as ("근무" | "유급" | "무급")[];

    daysOfWeek.forEach((day, index) => {
      defaultData.workDayType[day] = workDaysArr[index] as "근무" | "유급" | "무급";
    });

    defaultData.timeRangeType = timeRangeType.split(", ");
    defaultData.start = start.split(", ");
    defaultData.end = end.split(", ");
    defaultData.name = name;
    defaultData.type = type as "일반" | "시차";

    generateAlignments(workDaysArr);

    return defaultData;
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