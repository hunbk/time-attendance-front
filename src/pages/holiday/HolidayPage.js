import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  TableBody,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';

const SERVER_URL = 'http://localhost:8080';

export default function HolidayPage() {
  // 기본 연도를 현재 연도로 설정
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [holidays, setHolidays] = useState({});
  const [open, setOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ date: '', name: '', payType: '유급' });

  const getHolidayData = async () => {
    const response = await axios.get(`${SERVER_URL}/api/holiday`);
    const processedHolidays = {};

    response.data.forEach((holiday) => {
      const year = new Date(holiday.date).getFullYear();
      if (!processedHolidays[year]) {
        processedHolidays[year] = [];
      }
      processedHolidays[year].push(holiday);
    });

    setHolidays(processedHolidays);
  };

  useEffect(() => {
    getHolidayData();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNewHolidayChange = (event) => {
    setNewHoliday({
      ...newHoliday,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddHoliday = () => {
    setHolidays({
      ...holidays,
      [year]: [...holidays[year], newHoliday],
    });
    setNewHoliday({ date: '', name: '', payType: '유급' });
    handleClose();
  };

  const handleDeleteHoliday = (holidayToDelete) => {
    setHolidays({
      ...holidays,
      [year]: holidays[year].filter((holiday) => holiday !== holidayToDelete),
    });
  };

  const moveYear = (direction) => {
    const years = Object.keys(holidays);
    const currentIndex = years.indexOf(year);
    if (direction === 'prev' && currentIndex > 0) {
      setYear(years[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < years.length - 1) {
      setYear(years[currentIndex + 1]);
    }
  };

  return (
    <>
      <Helmet>
        <title>휴일 관리</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            휴일 관리
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            휴일 추가
          </Button>
        </Stack>

        <Card>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {Object.keys(holidays).length > 0 ? (
                      <>
                        <Select value={year} onChange={(e) => setYear(e.target.value)}>
                          {Object.keys(holidays).map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}년
                            </MenuItem>
                          ))}
                        </Select>

                        <IconButton onClick={() => moveYear('prev')}>
                          <ArrowBackIosNewIcon />
                        </IconButton>
                        <IconButton onClick={() => moveYear('next')}>
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </>
                    ) : (
                      <CircularProgress />
                    )}
                  </TableCell>
                </TableRow>
                {holidays[year]?.map((holiday, index) => (
                  <TableRow key={index}>
                    <TableCell>{holiday.name}</TableCell>
                    <TableCell>{holiday.date}</TableCell>
                    <TableCell>{holiday.payType}</TableCell>
                    <TableCell align="right">
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteHoliday(holiday)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>새 휴일 추가</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="date"
                name="date"
                label="날짜"
                type="date"
                fullWidth
                value={newHoliday.date}
                onChange={handleNewHolidayChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                id="name"
                name="name"
                label="휴일 이름"
                type="text"
                fullWidth
                value={newHoliday.name}
                onChange={handleNewHolidayChange}
              />
              <Select
                margin="dense"
                id="payType"
                name="payType"
                label="급여 구분"
                fullWidth
                value={newHoliday.payType}
                onChange={handleNewHolidayChange}
              >
                <MenuItem value={'유급'}>유급</MenuItem>
                <MenuItem value={'무급'}>무급</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>취소</Button>
              <Button onClick={handleAddHoliday}>추가</Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Container>
    </>
  );
}
