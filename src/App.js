import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
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
// ----------------------------------------------------------------------

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
