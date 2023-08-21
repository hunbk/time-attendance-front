import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';

// 사용자 페이지
import DashboardAppPage from './pages/DashboardAppPage';
import HolidayPage from './pages/holiday/HolidayPage';
import WorkGroupIndexPage from './pages/workgroup/WorkGroupIndexPage';
import PrivilegePage from './pages/privilege/PrivilegePage';
import SchedulePage from './pages/schedule/SchedulePage';
import SignupPage from './pages/signup/SignupPage';
import LoginPage from './pages/login/LoginPage';

// 서비스 관리자 페이지
import AdminPage from './pages/admin/AdminPage';
import CompanyPage from './pages/admin/company/CompanyPage';

// 에러 페이지
import Page404 from './pages/Page404';
import Page403 from './pages/Page403';

// context
import { useAuthState } from './context/AuthProvider';

// util
import { checkPermission } from './utils/checkPermission';

// ----------------------------------------------------------------------

export default function Router() {
  // 로그인 여부
  const { authenticated, user } = useAuthState();
  const userRole = authenticated ? user.role : undefined; // user 객체에서 권한을 가져옴

  const routes = useRoutes([
    {
      path: '/', // 루트 경로 접속 시 메인 페이지(dashboard)로 이동
      element: authenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" replace />,
    },
    {
      path: '/dashboard', // 메인 페이지 및 하위 경로. 특정 경로는 회사 관리자(ADMIN)만 접근 가능
      element: authenticated ? <DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        // 메인 페이지
        { path: 'app', element: <DashboardAppPage /> },
        // HR 권한 페이지
        {
          path: 'holiday',
          element: checkPermission(userRole, ['HR', 'ADMIN']) ? <HolidayPage /> : <Navigate to="/403" />,
        },
        {
          path: 'workgroups',
          element: checkPermission(userRole, ['HR', 'ADMIN']) ? <WorkGroupIndexPage /> : <Navigate to="/403" />,
        },
        {
          path: 'privilege',
          element: checkPermission(userRole, ['HR', 'ADMIN']) ? <PrivilegePage /> : <Navigate to="/403" />,
        },
        // FO 권한 페이지
        {
          path: 'schedule',
          element: checkPermission(userRole, ['FO', 'ADMIN']) ? <SchedulePage /> : <Navigate to="/403" />,
        },
      ],
    },
    {
      path: '/admin', // 서비스 관리자 페이지. 서비스 관리자(SUPERADMIN)만 접근 가능한 경로
      element: checkPermission(userRole, ['SUPERADMIN']) ? <DashboardLayout /> : <Navigate to="/403" />,
      children: [
        { path: '/admin', element: <AdminPage /> },
        {
          path: 'company',
          element: checkPermission(userRole, ['SUPERADMIN']) ? <CompanyPage /> : <Navigate to="/403" />,
        },
      ],
    },
    {
      path: '/login', // 로그인 경로. 인증된 사용자는 접속할 수 없음
      element: authenticated ? <Navigate to="/404" replace /> : <LoginPage />,
    },
    {
      path: '/signup', // 회원가입 경로. 인증된 사용자는 접속할 수 없음
      element: authenticated ? <Navigate to="/404" replace /> : <SignupPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '403',
      element: <Navigate to="/403" replace />,
    },
  ]);

  return routes;
}
