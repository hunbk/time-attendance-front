import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import { useAuthDispatch, useAuthState } from '../../../context/AuthProvider';
import NavWork from '../../../components/nav-work/NavWork';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = () => {
    // Local Storage에서 토큰 제거
    localStorage.removeItem('accessToken');
    // 상태 업데이트
    authDispatch({ type: 'LOGOUT' });
    // 로그인 페이지로 리다이렉트
    navigate('/login');
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        {/* 회사 로고 설정 */}
        {user.companyLogoUrl ? <Logo imageUrl={`http://localhost:8080/images/${user.companyLogoUrl}`} /> : <Logo />}
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {/* 사용자 이름 */}
                {user.name}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {/* 사용자 권한 */}
                {user.role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button size="small" variant="text" onClick={handleLogout}>
            로그아웃
          </Button>
        </Box>

        {/* 출퇴근 버튼 */}
        {user.role !== 'SUPERADMIN' ? <NavWork /> : null}
      </Box>

      {/* 페이지 목록 */}
      <NavSection data={navConfig} userRole={user.role} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
