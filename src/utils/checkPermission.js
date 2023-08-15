// 권한 확인 함수
export function checkPermission(userRole, requiredRoles) {
  if (userRole === 'SUPERADMIN') return true;
  if (requiredRoles.includes(userRole)) return true;
  return false;
}
