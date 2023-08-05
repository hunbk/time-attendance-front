import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { ko } from 'date-fns/esm/locale';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';

const DateBox1 = styled.div`
  display: flex;
  align-items: center;
`;

const DateBox2 = styled.div`
  display: flex;
  align-items: center;
`;

const Blank = styled.div`
  margin: 3px;
  display: flex;
  align-items: center;
`;

const Dash = styled.div`
  margin: 8px;
  font-size: 25px;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 10px;
  border-radius: 8px;
  font-weight: 400;
  font-size: 15px;
  line-height: 100%;
  padding: 5px;
  background-color: transparent;
  color: #707070;
  top: -28px;
  text-align: center;
`;

const modal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '250px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  padding: '16px',
};

const BasicModal = ({ onClose }) => {
  const handleOk = () => {
    onClose(); // 모달을 닫는 함수를 호출하여 모달을 닫습니다.
  };

  return (
    <div>
      <Modal
        open // 모달을 열기 위해 open prop을 true로 설정합니다.
        onClose={onClose} // 배경 클릭 시 모달을 닫는 함수를 호출합니다.
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            sx={{ marginBottom: '16px', textAlign: 'center' }}
          >
            경고
          </Typography>
          <Typography id="modal-modal-description" sx={{ marginBottom: '16px', textAlign: 'center' }}>
            해당 날짜로 설정할 수 없습니다!
          </Typography>
          <Button onClick={handleOk}>확인</Button>
        </Box>
      </Modal>
    </div>
  );
};

const Calendar = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStartDateChange = (date) => {
    if (date <= endDate) {
      setStartDate(date);
    } else {
      setShowModal(true);
    }
  };

  const handleEndDateChange = (date) => {
    if (date >= startDate) {
      setEndDate(date);
    } else {
      setShowModal(true);
    }
  };


  return (
    <div style={{ display: 'flex' }}>
      <DateBox1>
        <DatePicker
          locale={ko}
          shouldCloseOnSelect
          dateFormat="yyyy.MM.dd"
          selectedDate={startDate}
          closeOnScroll
          onChange={handleStartDateChange}
        />
      </DateBox1>
      <Dash> ~ </Dash>
      <DateBox2>
        <DatePicker
          locale={ko}
          shouldCloseOnSelect
          dateFormat="yyyy.MM.dd"
          selectedDate={endDate}
          closeOnScroll
          onChange={handleEndDateChange}
        />
      </DateBox2>
      {showModal && <BasicModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Calendar;
