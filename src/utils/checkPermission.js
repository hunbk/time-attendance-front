// 권한 확인 함수
export function checkPermission(userRole, requiredRoles) {
  if (requiredRoles.includes(userRole)) return true;
  return false;
}
