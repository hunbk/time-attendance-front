import { useState } from "react";
import * as React from 'react'
import { Box, Button, Modal } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Calendar from "./Calendar";


const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CalendarModal = ({ groupName, workHourPerDay, convertedWorkDays }) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button onClick={handleOpen}>
        <CalendarMonthIcon />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Calendar
            groupName={groupName}
            workHourPerDay={workHourPerDay}
            convertedWorkDays={convertedWorkDays}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default CalendarModal;
