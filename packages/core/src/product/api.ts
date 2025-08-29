import { ProductSPU, ProductSKU } from './types';

export class ProductAPI {
  private products: ProductSPU[] = [];

  async list(): Promise<ProductSPU[]> {
    return this.products;
  }

  async createSPU(spu: Omit<ProductSPU, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    // 数据验证
    if (!spu.name || spu.name.trim().length === 0) {
      throw new Error('商品名称不能为空');
    }
    
    if (spu.name.trim().length > 50) {
      throw new Error('商品名称不能超过50个字符');
    }
    
    if (spu.categoryId && spu.categoryId.length > 30) {
      throw new Error('商品分类不能超过30个字符');
    }
    
    if (spu.price !== undefined && spu.price <= 0) {
      throw new Error('商品价格必须大于0');
    }
    
    if (spu.stock !== undefined && spu.stock < 0) {
      throw new Error('商品库存不能为负数');
    }
    
    const newSPU: ProductSPU = {
      ...spu,
      id: `SPU-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // 生成更唯一的ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.products.push(newSPU);
  }

  async updateSPU(spuId: string, updates: Partial<Omit<ProductSPU, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const index = this.products.findIndex(p => p.id === spuId);
    if (index === -1) {
      throw new Error('商品不存在');
    }
    
    // 数据验证
    if (updates.name !== undefined) {
      if (updates.name.trim().length === 0) {
        throw new Error('商品名称不能为空');
      }
      
      if (updates.name.trim().length > 50) {
        throw new Error('商品名称不能超过50个字符');
      }
    }
    
    if (updates.categoryId !== undefined && updates.categoryId.length > 30) {
      throw new Error('商品分类不能超过30个字符');
    }
    
    if (updates.price !== undefined && updates.price <= 0) {
      throw new Error('商品价格必须大于0');
    }
    
    if (updates.stock !== undefined && updates.stock < 0) {
      throw new Error('商品库存不能为负数');
    }
    
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }

  async deleteSPU(spuId: string): Promise<void> {
    const index = this.products.findIndex(p => p.id === spuId);
    if (index === -1) {
      throw new Error('商品不存在');
    }
    
    this.products.splice(index, 1);
  }
}