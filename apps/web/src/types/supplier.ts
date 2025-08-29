export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  rating: number; // 评分 1-5
  category: string; // 分类
  status: 'active' | 'inactive' | 'suspended'; // 状态
  contractStartDate?: string; // 合同开始日期
  contractEndDate?: string; // 合同结束日期
  paymentTerms: string; // 付款条件
  notes?: string; // 备注
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}