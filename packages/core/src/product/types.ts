export interface ProductSPU {
  id: string;
  tenantId: string;
  spuId: string;
  name: string;
  categoryId?: string;
  attrs?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductSKU {
  id: string;
  spuId: string;
  barcode?: string;
  unit?: string;
  price: number;
  cost?: number;
  weightable?: boolean;
}