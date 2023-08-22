// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

// title: 사이드바에 보여줄 이름
// path: 이동할 경로
// icon: 표시할 아이콘
// roles: 어떤 권한에게 표시할 것인지 정보(SUPERADMIN 권한자는 포함하지 않아도 모두 표시됨)
const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    roles: ['USER', 'ADMIN'],
  },
  {
    title: '권한 목록',
    path: '/dashboard/privilege',
    icon: icon('ic_admin'),
    roles: ['ADMIN'],
  },
  {
    title: '관리자 추가',
    path: '/dashboard/privilegeAdd',
    icon: icon('ic_cart'),
    roles: ['ADMIN'],
  },
  {
    title: 'schedule',
    path: '/dashboard/schedule',
    roles: ['ADMIN'],
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'workgroup',
    path: '/dashboard/workgroups',
    icon: icon('ic_workgroup'),
    roles: ['ADMIN'],
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
    roles: ['USER', 'ADMIN'],
  },
  {
    title: '휴일 관리',
    path: '/dashboard/holiday',
    icon: icon('ic_blog'),
    roles: ['ADMIN'],
  },
  {
    title: '관리자 페이지',
    path: '/admin/company',
    icon: icon('ic_blog'),
    roles: ['SUPERADMIN'],
  },
];

export default navConfig;
