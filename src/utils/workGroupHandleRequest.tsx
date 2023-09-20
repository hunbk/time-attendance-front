import { DataToBeModifiedType, DataType } from 'src/pages/workgroup/WorkGroupIndexPage';
import loginAxios from '../api/loginAxios';
import { enqueueSnackbar } from 'notistack';

export type FetchResultType = {
    status: number;
    data: any;
}

const handleRequest = async (method: "get" | "post" | "put" | "delete", url: string, dataToBeSent?: any): Promise<FetchResultType> => {
    try {
        const { status, data }: FetchResultType = await loginAxios[method](url, dataToBeSent);
        return { status, data };
    } catch (error) {
        const { status } = error;
        const data = error.message;
        return { status, data };
    }
};

export const handleDataModification = async (dataToBeSent: DataType, dataToBeModifiedId?: number) => {
    const method = dataToBeModifiedId ? 'put' : 'post';
    const url = dataToBeModifiedId ? `/api/workgroups/${dataToBeModifiedId}` : '/api/workgroups';

    const { status }: FetchResultType = await handleRequest(method, url, dataToBeSent);

    if (status === 200) {
        const message = method === 'put' ? '수정되었습니다.' : '저장되었습니다.';
        window.location.href = `http://localhost:3000/dashboard/workgroups?enrollmentSuccess=true&message=${message}`;
    } else {
        enqueueSnackbar("서버통신에러", { variant: "error" });
    }
};

export default handleRequest;