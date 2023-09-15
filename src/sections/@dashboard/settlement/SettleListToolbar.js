import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Typography, OutlinedInput, InputAdornment, Button, Box } from '@mui/material';
// component
import Iconify from '../../../components/iconify';
import Calendar from '../../../pages/schedule/Calendar';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

SettleListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onSearch: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
};

export default function SettleListToolbar({
  numSelected,
  onFilterName,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) {
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);
  const [searchUser, setSearchUser] = useState('');

  const handleInputChange = (event) => {
    setSearchUser(event.target.value);
  }

  const handleSearch = () => {
    onFilterName(searchUser);
  }

  const handleApplyDate = () => {
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
    // 추가적인 로직이 필요하다면 여기에 추가할 수 있습니다.
  };

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} 명이 선택되었습니다.
        </Typography>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Calendar
              startDate={selectedStartDate} // 수정된 부분
              endDate={selectedEndDate} // 수정된 부분
              setStartDate={setSelectedStartDate} // 수정된 부분
              setEndDate={setSelectedEndDate} // 수정된 부분
            />

            <Button onClick={handleApplyDate} variant="contained" sx={{ height: 40, width: 70, marginLeft: 2 }}>
              적용
            </Button>
          </div>
        <Box sx={{display:'flex', alignItems:'center'}}>
          <StyledSearch
            value={searchUser}
            onChange={handleInputChange}
            placeholder="사원의 이름을 적어주세요."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
            size='small'
          />
          <Button variant="contained" sx={{ height: 40, width: 70, marginLeft: 2 }} onClick={handleSearch}>검색</Button>
          </Box>
        </>
      )}
    </StyledRoot>
  );
}
