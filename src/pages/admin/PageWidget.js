// @mui
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
// utils
// components
import Iconify from '../../components/iconify/Iconify';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  // borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

PageWidget.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  sx: PropTypes.object,
};

export default function PageWidget({ title, icon, color = 'primary', to, sx, ...other }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        ...sx,
      }}
      {...other}
    >
      <CardActionArea>
        <CardContent sx={{ py: 6 }}>
          <StyledIcon
            sx={{
              color: (theme) => theme.palette[color].main,
            }}
          >
            <Iconify icon={icon} width={70} height={70} />
          </StyledIcon>

          <Typography variant="h5" sx={{ color: '#000', opacity: 0.72 }}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
