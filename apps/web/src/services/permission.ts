export type UserRole = 'admin' | 'cashier' | 'inventory' | 'finance';

export interface UserPermission {
  role: UserRole;
  permissions: string[];
}

export class PermissionService {
  private static instance: PermissionService;
  private currentUser: UserPermission | null = null;

  private constructor() {}

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  setCurrentUser(user: UserPermission): void {
    this.currentUser = user;
  }

  getCurrentUser(): UserPermission | null {
    return this.currentUser;
  }

  hasPermission(permission: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    // 管理员拥有所有权限
    if (this.currentUser.role === 'admin') {
      return true;
    }

    return this.currentUser.permissions.includes(permission);
  }

  hasRole(role: UserRole): boolean {
    if (!this.currentUser) {
      return false;
    }

    return this.currentUser.role === role;
  }

  canAccessPage(page: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    // 管理员可以访问所有页面
    if (this.currentUser.role === 'admin') {
      return true;
    }

    // 根据角色定义页面访问权限
    const pagePermissions: Record<string, UserRole[]> = {
      '/products': ['admin', 'inventory'],
      '/orders/pos': ['admin', 'cashier'],
      '/members': ['admin', 'cashier'],
      '/finance/daily': ['admin', 'finance']
    };

    const allowedRoles = pagePermissions[page];
    if (!allowedRoles) {
      // 默认只有管理员可以访问
      return this.currentUser.role === 'admin';
    }

    return allowedRoles.includes(this.currentUser.role);
  }
}