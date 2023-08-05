import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

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

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onSearch: PropTypes.func,
};

export default function UserListToolbar({ numSelected, filterName, onFilterName, onSearch }) {
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
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          onKeyDown={handleSearchKeyPress}
          placeholder="사원 ID를 적어주세요."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

    
    </StyledRoot>
  );
}
