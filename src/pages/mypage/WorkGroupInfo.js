import PropTypes from 'prop-types';

import { Card, CardContent, Grid, Typography } from '@mui/material';
import Label from '../../components/label/Label';
import { fTime } from '../../utils/formatTime';

WorkGroupInfo.propTypes = {
  data: PropTypes.object,
};

export default function WorkGroupInfo({ data }) {
  // ===========================================================
  // 미배포 사용자
  if (data.workGroupId === null) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            나의 근로그룹
          </Typography>
          <Typography variant="body1" color="text.secondary">
            현재 소속된 근로그룹이 없습니다.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // ===========================================================
  // 배포 사용자
  const timeRangeByType = {};
  data.timeRangeList.forEach((item) => {
    if (!timeRangeByType[item.type]) {
      timeRangeByType[item.type] = [];
    }
    timeRangeByType[item.type].push({
      range: `${fTime(item.start)} ~ ${fTime(item.end)}`,
      start: item.start,
    });
  });

  // 시간으로 정렬
  Object.keys(timeRangeByType).forEach((key) => {
    timeRangeByType[key].sort((a, b) => a.start.localeCompare(b.start));
  });

  return (
    <Card>
      {/* <CardHeader title="나의 근로그룹" /> */}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          나의 근로그룹
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              근로그룹명
            </Typography>
            <Label variant="soft" color="default">
              {data.name}
            </Label>
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              근로제 종류
            </Typography>
            <Label variant="soft" color={data.type === '일반' ? 'default' : 'info'}>
              {data.type}근로제
            </Label>
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              근로시간
            </Typography>
            {timeRangeByType['근무'] ? (
              timeRangeByType['근무'].map((item, index) => (
                <Label key={index} variant="outlined" color="default">
                  {item.range}
                </Label>
              ))
            ) : (
              <Label variant="outlined" color="default">
                없음
              </Label>
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              휴식시간
            </Typography>
            {timeRangeByType['휴게'] ? (
              timeRangeByType['휴게'].map((item, index) => (
                <Label key={index} variant="outlined" color="default">
                  {item.range}
                </Label>
              ))
            ) : (
              <Label variant="outlined" color="default">
                없음
              </Label>
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              의무근로시간
            </Typography>
            {timeRangeByType['의무'] ? (
              timeRangeByType['의무'].map((item, index) => (
                <Label key={index} variant="outlined" color="default">
                  {item.range}
                </Label>
              ))
            ) : (
              <Label variant="outlined" color="default">
                없음
              </Label>
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              승인근로시간
            </Typography>
            {timeRangeByType['승인'] ? (
              timeRangeByType['승인'].map((item, index) => (
                <Label key={index} variant="outlined" color="default">
                  {item.range}
                </Label>
              ))
            ) : (
              <Label variant="outlined" color="default">
                없음
              </Label>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
