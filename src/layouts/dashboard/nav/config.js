// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

// title: 사이드바에 보여줄 이름
// path: 이동할 경로
// icon: 표시할 아이콘
// roles: 어떤 권한에게 표시할 것인지 정보
const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: icon('ic_analytics'),
  //   roles: ['USER', 'HR', 'FO', 'MNG', 'ADMIN'],
  // },
  {
    title: '마이페이지',
    path: '/dashboard/mypage',
    icon: icon('ic_user'),
    roles: ['USER', 'HR', 'FO', 'MNG', 'ADMIN'],
  },
  // {
  //   title: '권한 목록',
  //   path: '/dashboard/privilege',
  //   icon: icon('ic_admin'),
  //   roles: ['HR', 'MNG', 'ADMIN'],
  // },
  {
    title: '권한설정',
    path: '/dashboard/privilegeAdd',
    icon: icon('ic_lock'),
    roles: ['ADMIN'],
  },
  {
    title: '근로그룹설정',
    path: '/dashboard/workgroups',
    icon: icon('ic_workgroup'),
    roles: ['HR', 'MNG', 'ADMIN'],
  },
  {
    title: '정산목록',
    path: '/dashboard/schedule',
    icon: icon('ic_invoice'),
    roles: ['FO', 'MNG', 'ADMIN'],
  },
  {
    title: '회사설정',
    path: '/dashboard/company',
    icon: icon('ic_setting'),
    roles: ['ADMIN'],
  },
  // {
  //   title: '휴일 관리',
  //   path: '/dashboard/holiday',
  //   icon: icon('ic_blog'),
  //   roles: ['HR', 'ADMIN'],
  // },
  {
    title: '서비스 관리자 설정',
    path: '/admin',
    icon: icon('ic_setting'),
    roles: ['SUPERADMIN'],
  },
];

export default navConfig;
