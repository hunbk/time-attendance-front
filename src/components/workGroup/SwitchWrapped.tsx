import { Box, Switch } from "@mui/material";
import { useState } from "react";
import * as React from 'react'

const SwitchWrapped = ({ isOn, numOfMembers }) => {
    const [checked, setChecked] = useState<boolean>(isOn);

    const handleChange = () => {
        if (checked && numOfMembers > 0) {
            alert("배포된 근로자 해제 후 비활성화 가능합니다.")
        } else {
            setChecked(!checked)
        }
    }

    return (
        <Box>
            <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </Box>
    );
};

export default SwitchWrapped;



