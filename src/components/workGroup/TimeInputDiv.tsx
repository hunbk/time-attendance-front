import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

type TimeInputDivProps = {
    handleTempHour: (startOrEnd: string, timeType: string, value: Dayjs | null) => void;
    startOrEnd: "start" | "end";
    timeType: "work" | "break" | "compulsory" | "approved";
    defaultValue: Dayjs;
}

const TimeInputDiv: React.FC<TimeInputDivProps> = ({ handleTempHour, startOrEnd, timeType, defaultValue }) => {
    const [value, setValue] = useState<Dayjs | null>(defaultValue);

    return (
        <DemoContainer components={['TimePicker']}>
            <TimePicker value={value} onChange={(newValue) => {
                setValue(newValue);
                handleTempHour(startOrEnd, timeType, newValue);
            }} />
        </DemoContainer>
    );
}

export default TimeInputDiv;