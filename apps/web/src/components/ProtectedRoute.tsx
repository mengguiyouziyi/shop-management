import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PermissionService } from '../services/permission';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredPermission 
}: ProtectedRouteProps) {
  const location = useLocation();
  const permissionService = PermissionService.getInstance();
  const currentUser = permissionService.getCurrentUser();

  // 检查用户是否已登录
  if (!currentUser) {
    // 重定向到登录页面，但保存当前路径以便登录后返回
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 检查角色权限
  if (requiredRole && !permissionService.hasRole(requiredRole as any)) {
    // 用户没有必要的角色权限
    return <Navigate to="/" replace />;
  }

  // 检查具体权限
  if (requiredPermission && !permissionService.hasPermission(requiredPermission)) {
    // 用户没有必要的操作权限
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}