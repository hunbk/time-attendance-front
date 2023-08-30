import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

type TimeInputDivProps = {
    handleTempHour: (startOrEnd: string, timeType: string, value: Dayjs | null) => void;
    startOrEnd: "start" | "end";
    timeType: string;
    defaultValue: Dayjs;
}

const TimeInputDiv: React.FC<TimeInputDivProps> = ({ handleTempHour, startOrEnd, timeType, defaultValue }) => {
    const [value, setValue] = useState<Dayjs | null>(defaultValue);

    return (
        <DemoContainer components={['TimePicker']}>
            <TimePicker value={value} onChange={(newValue) => {
                setValue(newValue);
                handleTempHour(startOrEnd, timeType, newValue);
            }}
                slotProps={{
                    textField: {
                        required: timeType === "근무" && true,
                    },
                }} />
        </DemoContainer>
    );
}

export default TimeInputDiv;