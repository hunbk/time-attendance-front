import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';

import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import HolidayPage from './pages/holiday/HolidayPage';
import IndexPage from './pages/WorkGroup/IndexPage';
import PrivilegePage from './pages/privilege/PrivilegePage';
import SchedulePage from './pages/schedule/SchedulePage';
import SignupPage from './pages/signup/SignupPage';
import LoginPage from './pages/login/LoginPage';
import { useAuthState } from './context/AuthProvider';

// ----------------------------------------------------------------------

export default function Router() {
  // 로그인 여부
  const { authenticated } = useAuthState();

  const routes = useRoutes([
    {
      path: '/',
      element: authenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" replace />,
    },
    {
      path: '/dashboard',
      element: authenticated ? <DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'holiday', element: <HolidayPage /> },
        { path: 'workgroups', element: <IndexPage /> },
        { path: 'privilege', element: <PrivilegePage /> },
        { path: 'schedule', element: <SchedulePage /> },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignupPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
