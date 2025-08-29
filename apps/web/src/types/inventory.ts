export interface InventoryItem {
  id: string;
  productId: string; // 商品ID
  productName: string; // 商品名称
  sku?: string; // SKU
  quantity: number; // 当前库存数量
  reservedQuantity: number; // 预留数量
  availableQuantity: number; // 可用数量
  minStockLevel: number; // 最低库存预警线
  maxStockLevel?: number; // 最高库存预警线
  unit: string; // 单位
  location?: string; // 库存位置
  lastRestockedAt?: string; // 最后补货时间
  lastSoldAt?: string; // 最后销售时间
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string; // 商品ID
  productName: string; // 商品名称
  type: 'in' | 'out' | 'adjustment' | 'transfer'; // 类型：入库、出库、调整、调拨
  quantity: number; // 数量
  fromLocation?: string; // 来源位置（调拨时使用）
  toLocation?: string; // 目标位置（调拨时使用）
  referenceType: 'purchase' | 'sale' | 'adjustment' | 'transfer'; // 关联类型
  referenceId?: string; // 关联ID
  notes?: string; // 备注
  createdAt: string;
  createdBy: string; // 操作人
}