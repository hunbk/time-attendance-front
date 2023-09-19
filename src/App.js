import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './App.css';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
// mui
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// 스낵바
import { SnackbarProvider, MaterialDesignContent, closeSnackbar } from 'notistack';
// 로그인 인증 컨텍스트
import { AuthProvider } from './context/AuthProvider';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';

// 스낵바 디자인
const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-default': {
    backgroundColor: '#212B36',
    fontWeight: 'bold',
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: '#1890FF',
    fontWeight: 'bold',
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: '#229A16',
    fontWeight: 'bold',
  },
  '&.notistack-MuiContent-warning': {
    backgroundColor: '#ff9800',
    fontWeight: 'bold',
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: '#FF4842',
    fontWeight: 'bold',
  },
}));

// 스낵바 닫기 버튼
const action = (key) => (
  <IconButton size="small" aria-label="close" color="inherit" onClick={() => closeSnackbar(key)}>
    <CloseIcon fontSize="small" />
  </IconButton>
);

// ----------------------------------------------------------------------

export default function App() {
  dayjs.locale('ko');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <HelmetProvider>
        <SnackbarProvider
          Components={{
            default: StyledMaterialDesignContent,
            info: StyledMaterialDesignContent,
            success: StyledMaterialDesignContent,
            warning: StyledMaterialDesignContent,
            error: StyledMaterialDesignContent,
          }}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          preventDuplicate
          action={action}
        >
          <AuthProvider>
            <BrowserRouter>
              <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <Router />
              </ThemeProvider>
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </HelmetProvider>
    </LocalizationProvider>
  );
}
