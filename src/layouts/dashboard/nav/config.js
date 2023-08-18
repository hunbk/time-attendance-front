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
    roles: ['USER', 'HR', 'FO', 'ADMIN'],
  },
  {
    title: 'privilege',
    path: '/dashboard/privilege',
    icon: icon('ic_admin'),
    roles: ['HR', 'ADMIN'],
  },
  {
    title: 'schedule',
    path: '/dashboard/schedule',
    roles: ['FO', 'ADMIN'],
  },
  {
    title: 'workgroup',
    path: '/dashboard/workgroups',
    icon: icon('ic_workgroup'),
    roles: ['HR', 'ADMIN'],
  },
  {
    title: '휴일 관리',
    path: '/dashboard/holiday',
    icon: icon('ic_blog'),
    roles: ['HR', 'ADMIN'],
  },
  {
    title: '서비스 관리자 설정',
    path: '/admin',
    icon: icon('ic_setting'),
    roles: ['SUPERADMIN'],
  },
];

export default navConfig;
