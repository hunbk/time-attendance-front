import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, CardContent, Typography, Grid, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// components
import { useChart } from '../../components/chart';
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

WeeklyWorkChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  workData: PropTypes.array,
  selectedWeek: PropTypes.object,
  updateWeek: PropTypes.func,
};

// "HH:MM:SS" 형태의 시간을 숫자 형태의 문자열로 변환
const convertToHours = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours + minutes / 60 + seconds / 3600;
};

// 숫자 형태의 시간을 "HH:MM" 형태의 문자열로 변환
const convertToTimeString = (hoursDecimal) => {
  const totalMinutes = Math.floor(hoursDecimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// 라벨에 요일을 표시하기 위한 함수
const days = ['일', '월', '화', '수', '목', '금', '토'];
const formatDateWithDay = (dateString) => {
  const date = new Date(dateString);
  const day = days[date.getDay()];
  return `${dateString}(${day})`;
};

export default function WeeklyWorkChart({ title, subheader, workData, selectedWeek, updateWeek, ...other }) {
  const chartLabels = Array.isArray(workData) ? workData.map((i) => formatDateWithDay(i.date)) : [];
  const chartData = Array.isArray(workData)
    ? [
        {
          name: '근무시간',
          data: workData.map((item) => convertToHours(item.workingTime)),
        },
        {
          name: '연장근무',
          data: workData.map((item) => convertToHours(item.overTime)),
        },
      ]
    : [];

  const chartOptions = useChart({
    chart: {
      type: 'bar',
      // stacked: true, // Stacked 설정 추가
    },
    // plotOptions: { bar: { columnWidth: '20%' } },
    fill: { type: 'solid' },
    labels: chartLabels,
    xaxis: {
      type: 'category',
      // labels: {
      //   datetimeFormatter: {
      //     year: 'yyyy',
      //     month: "MMM 'yy",
      //     day: 'dd MMM',
      //     hour: 'HH:mm',
      //   },
      // },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return convertToTimeString(y);
          }
          return y;
        },
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
  });

  return (
    <Card {...other}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="grey.600">
              {subheader}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="grey.600">
              <IconButton onClick={() => updateWeek('prev')}>
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              {`${fDate(selectedWeek.start, 'yyyy.MM.dd')} ~ ${fDate(selectedWeek.end, 'yyyy.MM.dd')}`}
              <IconButton onClick={() => updateWeek('next')}>
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="bar" series={chartData} options={chartOptions} height={250} />
      </Box>
    </Card>
  );
}
