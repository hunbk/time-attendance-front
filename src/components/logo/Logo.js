import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

const url = `${process.env.PUBLIC_URL}/assets/logo2.svg`;

const Logo = ({ imageUrl = url, sx, ...other }) => (
  <Link to="/" sx={{ display: 'contents' }}>
    <Box
      component="img"
      src={imageUrl} // 이미지 URL을 src 속성으로 사용
      sx={{
        width: 160,
        height: 40,
        ...sx,
      }}
      {...other}
    />
  </Link>
);

Logo.propTypes = {
  imageUrl: PropTypes.string, // 이미지 URL을 prop으로 받음
  sx: PropTypes.object,
};

export default Logo;
