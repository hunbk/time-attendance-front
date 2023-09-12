import PropTypes from 'prop-types';

import { Card, CardContent, Grid, Typography } from '@mui/material';
import Label from '../../components/label/Label';

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
    timeRangeByType[item.type] = `${item.start} ~ ${item.end}`;
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
            <Label variant="filled" color="default">
              {data.name}
            </Label>
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              근로제 종류
            </Typography>
            <Label variant="filled" color="default">
              {data.type}근로제
            </Label>
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              근로시간
            </Typography>
            <Label variant="outlined" color="default">
              {timeRangeByType['근무']}
            </Label>
          </Grid>

          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              휴식시간
            </Typography>
            <Label variant="outlined" color="default">
              {timeRangeByType['휴게']}
            </Label>
          </Grid>

          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              의무근로시간
            </Typography>
            <Label variant="outlined" color="default">
              {timeRangeByType['의무']}
            </Label>
          </Grid>

          <Grid item xs={12} sm={6} md={12}>
            <Typography variant="body2" color="text.secondary">
              승인근로시간
            </Typography>
            <Label variant="outlined" color="default">
              {timeRangeByType['승인']}
            </Label>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
