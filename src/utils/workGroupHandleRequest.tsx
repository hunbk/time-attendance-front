import { DataToBeModifiedType } from 'src/pages/workgroup/WorkGroupIndexPage';
import loginAxios from '../api/loginAxios';

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

const redirectAndAlert = (message: string) => {
    alert(message);
    window.location.href = "http://localhost:3000/dashboard/workgroups";
};

export const handleDataModification = async (dataToBeModified: null | DataToBeModifiedType) => {
    const method = dataToBeModified ? 'put' : 'post';
    const url = dataToBeModified ? `/api/workgroups/${dataToBeModified.id}` : '/api/workgroups';

    const { status, data }: FetchResultType = await handleRequest(method, url, dataToBeModified);

    if (status === 200) {
        const message = method === 'put' ? '수정되었습니다.' : '저장되었습니다.';
        redirectAndAlert(message);
    } else {
        console.error(data);
    }
};

export default handleRequest;