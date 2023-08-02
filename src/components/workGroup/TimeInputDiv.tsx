import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Dayjs } from 'dayjs';
import * as React from 'react'

type TimeInputDivProps = {
    handleTempHour: (startOrEnd: string, timeType: string, value: Dayjs | null) => void;
    startOrEnd: "start" | "end";
    timeType: "work" | "break" | "compulsory" | "approved";
}

const TimeInputDiv: React.FC<TimeInputDivProps> = ({ handleTempHour, startOrEnd, timeType }) => {
    const [value, setValue] = React.useState<Dayjs | null>(null);

    return (
        <DemoContainer components={['TimePicker']}>
            <TimePicker label="Basic time picker" value={value} onChange={(newValue) => {
                setValue(newValue);
                handleTempHour(startOrEnd, timeType, newValue);
            }} />
        </DemoContainer>
    );
}

export default TimeInputDiv;