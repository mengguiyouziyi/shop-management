import { Supplier } from './supplier';

export interface PurchaseOrder {
  id: string;
  orderNumber: string; // 采购订单号
  supplierId: string; // 供应商ID
  supplier: Supplier; // 供应商信息
  orderDate: string; // 下单日期
  expectedDeliveryDate?: string; // 预计到货日期
  actualDeliveryDate?: string; // 实际到货日期
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled'; // 状态
  totalAmount: number; // 总金额
  currency: string; // 货币
  notes?: string; // 备注
  items: PurchaseOrderItem[]; // 采购项
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string; // 商品ID
  productName: string; // 商品名称
  sku?: string; // SKU
  quantity: number; // 数量
  unitPrice: number; // 单价
  totalPrice: number; // 总价
  receivedQuantity: number; // 已收货数量
  notes?: string; // 备注
}