// 统一的数据模型定义

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  barcode?: string;
  unit: 'piece' | 'kg' | 'liter' | 'meter';
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSKU {
  id: string;
  productId: string;
  barcode: string;
  specs: Record<string, string>;
  price: number;
  stock: number;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  level: MemberLevel;
  points: number;
  balance: number;
  totalSpent: number;
  joinDate: string;
  lastVisit: string;
  isActive: boolean;
}

export enum MemberLevel {
  BRONZE = 'bronze',
  SILVER = 'silver', 
  GOLD = 'gold',
  DIAMOND = 'diamond'
}

export interface Order {
  id: string;
  orderNumber: string;
  memberId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  staffId: string;
  createdAt: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productSKUId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  MOBILE = 'mobile',
  MEMBER_BALANCE = 'member_balance'
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  isActive: boolean;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: StaffRole;
  storeId: string;
  isActive: boolean;
}

export enum StaffRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier'
}

// 财务相关类型
export interface DailyFinance {
  id: string;
  date: string;
  storeId: string;
  revenue: number;
  expenses: number;
  profit: number;
  orderCount: number;
  memberCount: number;
}

// 会员规则配置
export interface MemberRules {
  pointsPerYuan: number;
  levelThresholds: Record<MemberLevel, number>;
  levelDiscounts: Record<MemberLevel, number>;
  rechargeBonus: {
    amount: number;
    bonus: number;
  }[];
}