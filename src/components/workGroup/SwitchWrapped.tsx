import { Switch } from "@mui/material";
import { useState } from "react";
import handleRequest, { FetchResultType } from "src/utils/workGroupHandleRequest";
import { enqueueSnackbar } from 'notistack';

const SwitchWrapped = ({ id, isOn, numOfMembers }) => {
    const [checked, setChecked] = useState<boolean>(isOn);
    const handleActivation = async (workgroupId: number, checked: boolean) => {
        const { status, data }: FetchResultType = await handleRequest('put', `/api/workgroups/activation/${workgroupId}`);
        if (status === 200) {
            if (checked) {
                enqueueSnackbar(`비활성화되었습니다.`, { variant: "success" });
            } else {
                enqueueSnackbar(`활성화되었습니다.`, { variant: "success" });
            }
        } else {
            console.error(data);
        }
    }

    const handleChange = () => {
        if (checked && numOfMembers > 0) {
            enqueueSnackbar(`배포된 근로자 해제 후 비활성화 가능합니다.`, { variant: "error" });
        } else {
            setChecked(!checked);
            handleActivation(id, checked);
        }
    }

    return (
        <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
            size="small"
        />
    );
};

export default SwitchWrapped;



