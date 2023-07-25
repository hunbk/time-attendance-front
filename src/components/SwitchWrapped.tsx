import { Box, Switch } from "@mui/material";
import { useState } from "react";

const SwitchWrapped = ({ isOn }) => {
    const [checked, setChecked] = useState<boolean>(isOn);

    const handleChange = () => {
        if (checked) {
            console.log("(DB QUERY로 workGroup, emp table 조인하여 해당 근무그룹내에 인원수 확인. 0명이면 스위치 off, 1명이상이면 경고 팝업)")
        } 

        setChecked(!checked)
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



