import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';

// 사용자 페이지
import MyPage from './pages/mypage/MyPage';
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
// import Page403 from './pages/Page403';
import Page500 from './pages/Page500';

// context
import { useAuthState } from './context/AuthProvider';

// util
import { checkPermission } from './utils/checkPermission';
import PrivilegeAdd from './pages/privilege/PrivilegeAdd';
import CompanySettingPage from './pages/company/CompanySettingPage';

// ----------------------------------------------------------------------

export default function Router() {
  // 로그인 여부
  const { authenticated, user } = useAuthState();
  const userRole = authenticated ? user.role : undefined; // user 객체에서 권한을 가져옴

  const routes = useRoutes([
    {
      path: '/',
      element: userRole === 'SUPERADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />,
    },
    {
      path: '/dashboard', // 메인 페이지 및 하위 경로. 특정 경로는 회사 관리자(ADMIN)만 접근 가능
      element: authenticated ? <DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/dashboard/mypage" />, index: true },
        // { path: 'app', element: <DashboardAppPage /> },
        // {
        //   path: 'holiday',
        //   element: checkPermission(userRole, ['HR', 'ADMIN']) ? <HolidayPage /> : <Navigate to="/403" />,
        // },
        {
          path: 'mypage',
          element: checkPermission(userRole, ['USER', 'HR', 'FO', 'MNG', 'ADMIN']) ? <MyPage /> : <Navigate to="/" />,
        },
        {
          path: 'workgroups',
          element: checkPermission(userRole, ['HR', 'MNG', 'ADMIN']) ? <WorkGroupIndexPage /> : <Navigate to="/404" />,
        },
        {
          path: 'privilege',
          element: checkPermission(userRole, ['HR', 'MNG', 'ADMIN']) ? <PrivilegePage /> : <Navigate to="/404" />,
        },
        {
          path: 'privilegeAdd',
          element: checkPermission(userRole, ['ADMIN']) ? <PrivilegeAdd /> : <Navigate to="/404" />,
        },
        {
          path: 'company',
          element: checkPermission(userRole, ['ADMIN']) ? <CompanySettingPage /> : <Navigate to="/404" />,
        },
        {
          path: 'schedule',
          element: checkPermission(userRole, ['FO', 'MNG', 'ADMIN']) ? <SchedulePage /> : <Navigate to="/404" />,
        },
      ],
    },
    {
      path: '/admin', // 서비스 관리자 페이지. 서비스 관리자(SUPERADMIN)만 접근 가능한 경로
      element: checkPermission(userRole, ['SUPERADMIN']) ? <DashboardLayout /> : <Navigate to="/404" />,
      children: [
        { path: '', element: <AdminPage /> },
        {
          path: 'company',
          element: checkPermission(userRole, ['SUPERADMIN']) ? <CompanyPage /> : <Navigate to="/404" />,
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
        // { element: <Navigate to="/dashboard/app" />, index: true }, // 버그발생
        { path: '404', element: <Page404 /> },
        { path: '500', element: <Page500 /> },
        // { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    // {
    //   path: '403',
    //   element: <Navigate to="/403" replace />,
    // },
  ]);

  return routes;
}
