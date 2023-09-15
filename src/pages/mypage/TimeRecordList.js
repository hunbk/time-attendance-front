import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// @mui
import {
  Card,
  Box,
  CardContent,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  FormControl,
  Stack,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { fDate, fDateTime, fTime } from '../../utils/formatTime';
import Label from '../../components/label/Label';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: '일자',
  },
  {
    id: 'startWork',
    numeric: false,
    disablePadding: false,
    label: '출근시각',
  },
  {
    id: 'leaveWork',
    numeric: false,
    disablePadding: false,
    label: '퇴근시각',
  },
  {
    id: 'workingTime',
    numeric: false,
    disablePadding: false,
    label: '총 근무시간',
  },
  {
    id: 'overTime',
    numeric: false,
    disablePadding: false,
    label: '연장 근무시간',
  },
  {
    id: 'workState',
    numeric: false,
    disablePadding: false,
    label: '상태',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

// ----------------------------------------------------------------------

export default function TimeRecordList({
  title,
  subheader,
  rows,
  selectedTimeRecordDate,
  updateSelectedTimeRecordDate,
  handleTimeRecordSearch,
  ...other
}) {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rows, rowsPerPage]
  );

  return (
    <Card {...other}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="grey.600">
              {subheader}
            </Typography>
          </Box>
          {/* 상단 검색 필드 */}
          <Stack direction="row">
            <FormControl sx={{ mr: 1 }}>
              <DatePicker
                label="시작 기간"
                value={dayjs(selectedTimeRecordDate.start)}
                maxDate={dayjs(selectedTimeRecordDate.end)}
                onChange={(newDate) => updateSelectedTimeRecordDate(new Date(newDate), selectedTimeRecordDate.end)}
                format="YYYY.MM.DD"
                sx={{ width: '150px' }}
                slotProps={{
                  textField: {
                    size: 'small',
                  },
                }}
              />
            </FormControl>

            <FormControl sx={{ mr: 1 }}>
              <DatePicker
                label="종료 기간"
                value={dayjs(selectedTimeRecordDate.end)}
                minDate={dayjs(selectedTimeRecordDate.start)}
                onChange={(newDate) => updateSelectedTimeRecordDate(selectedTimeRecordDate.start, new Date(newDate))}
                format="YYYY.MM.DD"
                sx={{ width: '150px' }}
                slotProps={{
                  textField: {
                    size: 'small',
                  },
                }}
              />
            </FormControl>
            <Button variant="outlined" onClick={handleTimeRecordSearch}>
              검색
            </Button>
          </Stack>
        </Stack>
      </CardContent>

      {/* 출퇴근기록 테이블 */}
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={false}
                    tabIndex={-1}
                    key={row.timeRecordId}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* 요일 */}
                    <TableCell align="center">{fDate(row.date, 'yyyy.MM.dd')}</TableCell>
                    {/* 출근시각 */}
                    <TableCell align="center">{fDateTime(row.startWork, 'HH:mm')}</TableCell>
                    {/* 퇴근시각 */}
                    <TableCell align="center">{fDateTime(row.leaveWork, 'HH:mm')}</TableCell>
                    {/* 총 근무시간 */}
                    <TableCell align="center">{fTime(row.workingTime)}</TableCell>
                    {/* 연장 근무시간 */}
                    <TableCell align="center">{fTime(row.overTime)}</TableCell>
                    {/* 처리상태 */}
                    <TableCell align="center">
                      {row.workState === '정상처리' ? (
                        <Label color="info">정상처리</Label>
                      ) : row.workState === '근태이상' ? (
                        <Label color="error">근태이상</Label>
                      ) : (
                        <Label color="default">미처리</Label>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Card>
  );
}

TimeRecordList.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  rows: PropTypes.array,
  selectedTimeRecordDate: PropTypes.object,
  updateSelectedTimeRecordDate: PropTypes.func,
  handleTimeRecordSearch: PropTypes.func,
};
