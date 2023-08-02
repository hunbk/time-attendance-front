// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'privilege',
    path: '/dashboard/privilege',
    icon: icon('ic_admin'),
  },
  {
    title: 'schedule',
    path: '/dashboard/schedule'
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'workgroup',
    path: '/dashboard/workgroups',
    icon: icon('ic_workgroup'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
  {
    title: '휴일 관리',
    path: '/dashboard/holiday',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
