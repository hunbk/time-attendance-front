import { Box, Switch } from "@mui/material";
import { useState } from "react";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const SwitchWrapped = ({ isOn, numOfMembers, handleClickSnackbar }) => {
    const [checked, setChecked] = useState<boolean>(isOn);

    const handleChange = () => {
        if (checked && numOfMembers > 0) {
            handleClickSnackbar({ vertical: 'top', horizontal: 'center' }, "error", "배포된 근로자 해제 후 비활성화 가능합니다.");
        } else {
            setChecked(!checked)
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



