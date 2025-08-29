import { describe, it, expect } from 'vitest';
import { ProductService } from './service';

describe('ProductService', () => {
  it('should create SPU with valid data', async () => {
    const service = new ProductService();
    const spu = await service.createSPU('Test Product', 'cat1');
    
    expect(spu.name).toBe('Test Product');
    expect(spu.categoryId).toBe('cat1');
    expect(spu.spuId).toBeDefined();
  });

  it('should throw error for empty product name', async () => {
    const service = new ProductService();
    await expect(service.createSPU('', 'cat1')).rejects.toThrow('商品名称不能为空');
  });

  it('should throw error for name exceeding 50 characters', async () => {
    const service = new ProductService();
    const longName = 'a'.repeat(51);
    await expect(service.createSPU(longName, 'cat1')).rejects.toThrow('商品名称不能超过50个字符');
  });

  it('should throw error for category exceeding 30 characters', async () => {
    const service = new ProductService();
    const longCategory = 'a'.repeat(31);
    await expect(service.createSPU('Test Product', longCategory)).rejects.toThrow('商品分类不能超过30个字符');
  });

  it('should create SKU with valid data', async () => {
    const service = new ProductService();
    const sku = await service.createSKU('spu1', { color: 'red' }, 100, 10);
    
    expect(sku.spuId).toBe('spu1');
    expect(sku.price).toBe(100);
    expect(sku.stock).toBe(10);
  });

  it('should throw error for empty SPU ID', async () => {
    const service = new ProductService();
    await expect(service.createSKU('', { color: 'red' }, 100, 10)).rejects.toThrow('SPU ID不能为空');
  });

  it('should throw error for zero or negative price', async () => {
    const service = new ProductService();
    await expect(service.createSKU('spu1', { color: 'red' }, 0, 10)).rejects.toThrow('价格必须大于0');
  });

  it('should throw error for negative stock', async () => {
    const service = new ProductService();
    await expect(service.createSKU('spu1', { color: 'red' }, 100, -1)).rejects.toThrow('库存不能为负数');
  });
});