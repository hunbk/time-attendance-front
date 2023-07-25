import { useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import Calendar from "./Calendar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CalendarModal = ({ groupName, workHour, breakTime }) => {
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
            workHour={workHour}
            breakTime={breakTime}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default CalendarModal;
