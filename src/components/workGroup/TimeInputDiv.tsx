import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Dayjs } from 'dayjs';
import { FC, useState } from 'react';

type TimeInputDivProps = {
    index: number,
    handleTempHour: (index: number, startOrEnd: string, timeType: string, value: Dayjs | null) => void;
    startOrEnd: "start" | "end";
    timeType: string;
    defaultValue: Dayjs;
}

const TimeInputDiv: FC<TimeInputDivProps> = ({ index, handleTempHour, startOrEnd, timeType, defaultValue }) => {
    const [value, setValue] = useState<Dayjs | null>(defaultValue);

    return (
        <DemoContainer components={['TimePicker']}>
            <TimePicker value={value} onAccept={(newValue) => {
                setValue(newValue);
                handleTempHour(index, startOrEnd, timeType, newValue);
            }}
                slotProps={{
                    textField: {
                        required: timeType === "근무" && true,
                    },
                }}
                ampm={false}
                timeSteps={{ minutes: 15 }}
            />
        </DemoContainer>
    );
}

export default TimeInputDiv;