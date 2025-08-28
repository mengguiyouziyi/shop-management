import { Dexie } from 'dexie';
import { ProductSPU } from '../../../../packages/core/src/product/types';

class ShopDB extends Dexie {
  products: Dexie.Table<ProductSPU, string>;
  orders: Dexie.Table<any, number>;

  constructor() {
    super('ShopDB');
    this.version(1).stores({
      products: 'id,tenantId,spuId',
      orders: '++id,tenantId,storeId'
    });
    
    this.products = this.table('products');
    this.orders = this.table('orders');
  }
}

export const db = new ShopDB();

export const saveProduct = async (product: ProductSPU) => {
  await db.products.put(product);
};

export const getPendingOrders = async (tenantId: string) => {
  return db.orders.where('tenantId').equals(tenantId).toArray();
};
