export interface Store {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  manager: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  parentId?: string; // 父级店铺ID，用于支持店铺层级结构
  level: number; // 店铺层级，0表示总部，1表示一级分店，以此类推
}

export interface StoreSettings {
  id: string;
  storeId: string;
  currency: string;
  taxRate: number;
  timezone: string;
  receiptTemplate: string;
  printerSettings: any;
}

// 店铺权限类型
export interface StorePermission {
  id: string;
  storeId: string;
  userId: string;
  role: 'admin' | 'manager' | 'staff'; // 店铺内角色：管理员、经理、员工
  permissions: string[]; // 具体权限列表
  createdAt: string;
  updatedAt: string;
}