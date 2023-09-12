import { Box, Switch } from "@mui/material";
import { useState } from "react";
import loginAxios from '../../api/loginAxios';

const SwitchWrapped = ({ id, isOn, numOfMembers, handleClickSnackbar }) => {
    const [checked, setChecked] = useState<boolean>(isOn);
    const handleActivation = async (workgroupId: number, checked: boolean) => {
        try {
            const response = await loginAxios.put(`/api/workgroups/activation/${workgroupId}`);

            if (response.status === 200) {
                if (checked) {
                    handleClickSnackbar({ vertical: 'top', horizontal: 'center' }, "success", "비활성화되었습니다.");
                } else {
                    handleClickSnackbar({ vertical: 'top', horizontal: 'center' }, "success", "활성화되었습니다.");
                }

            } else {
                // Handle other status codes
            }
        } catch (error) {
            // Handle errors
            console.error('An error occurred:', error);
        }
    }

    const handleChange = () => {
        if (checked && numOfMembers > 0) {
            handleClickSnackbar({ vertical: 'top', horizontal: 'center' }, "error", "배포된 근로자 해제 후 비활성화 가능합니다.");
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



