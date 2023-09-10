import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Typography, OutlinedInput, InputAdornment, Button } from '@mui/material';
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
  filterName,
  onFilterName,
  onSearch,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) {
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);

  const handleApplyDate = () => {
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
    // 추가적인 로직이 필요하다면 여기에 추가할 수 있습니다.
  };

  // 엔터 키를 눌렀을 때 검색을 처리하는 함수
  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      // 엔터 키를 누르면, onSearch 함수를 호출하여 현재 검색어 값을 전달합니다.
      if (filterName.trim() !== '') {
        onSearch(filterName);
      }
    }
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

            <Button onClick={handleApplyDate} variant="outlined" sx={{ height: 40, width: 70, marginLeft: 2 }}>
              적용
            </Button>
          </div>

          <StyledSearch
            value={filterName}
            onChange={onFilterName}
            onKeyDown={handleSearchKeyPress}
            placeholder="사원의 이름을 적어주세요."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        </>
      )}
    </StyledRoot>
  );
}
