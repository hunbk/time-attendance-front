type TimeInputDivProps = {
  handleTempHour: (startOrEnd: string, timeType: string, value: string) => void;
  startOrEnd: "start" | "end";
  timeType: "work" | "break" | "compulsory" | "overTime";
};

const TimeInputDiv: React.FC<TimeInputDivProps> = ({
  handleTempHour,
  startOrEnd,
  timeType,
}) => {
  return (
    <span>
      <input
        type="time"
        min="09:00"
        max="18:00"
        step="1800"
        onChange={(e) => {
          handleTempHour(startOrEnd, timeType, e.target.value);
        }}
      />
    </span>
  );
};

export default TimeInputDiv;
