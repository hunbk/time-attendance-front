import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
// 로그인 인증 컨텍스트
import { AuthProvider } from './context/AuthProvider';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { koKR } from '@mui/x-date-pickers/locales';
// ----------------------------------------------------------------------

export default function App() {
  dayjs.locale('ko');

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={koKR.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <HelmetProvider>
        <AuthProvider>
          <BrowserRouter>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <Router />
            </ThemeProvider>
          </BrowserRouter>
        </AuthProvider>
      </HelmetProvider>
    </LocalizationProvider>
  );
}
