import { Box, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import * as React from 'react'

type HolidayPayLeaveProps = {
    dayHoliday: string;
    defaultPayLeave: boolean;
    updateDayHoliday: (dayHoliday, isPayLeave) => void;
}

const dayHolidayConverter = (dayHoliday) => {
    switch (dayHoliday) {
        case 'mon':
            return "월";
        case 'tue':
            return "화";
        case 'wed':
            return "수";
        case 'thu':
            return "목";
        case 'fri':
            return "금";
        case 'sat':
            return "토";
        case 'sun':
            return "일";
        default:
            return "잘못된 입력";
    }
};

const HolidayPayLeave: React.FC<HolidayPayLeaveProps> = ({ dayHoliday, defaultPayLeave, updateDayHoliday }) => {
    const [isPayLeave, setIsPayLeave] = useState<boolean>(defaultPayLeave);

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <FormLabel>
                    {dayHolidayConverter(dayHoliday)}
                </FormLabel>
                <Select
                    value={isPayLeave === true ? "payLeave" : "nonPayLeave"}
                    // label="payLeaveSelect1"
                    onChange={(e) => {
                        if (e.target.value === "payLeave") {
                            setIsPayLeave(true);
                            updateDayHoliday(dayHoliday, true);
                        } else {
                            setIsPayLeave(false);
                            updateDayHoliday(dayHoliday, false);
                        }
                    }}
                >
                    <MenuItem value="payLeave">유급휴일</MenuItem>
                    <MenuItem value="nonPayLeave">무급휴무일</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default HolidayPayLeave;