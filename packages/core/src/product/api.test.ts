import { describe, it, expect } from 'vitest';
import { ProductAPI } from './api';

describe('ProductAPI', () => {
  it('should create SPU with valid data', async () => {
    const api = new ProductAPI();
    await api.createSPU({
      tenantId: 'test',
      spuId: 'spu1',
      name: 'Test Product',
      categoryId: 'cat1'
    });
    
    const products = await api.list();
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Test Product');
  });

  it('should throw error for empty product name', async () => {
    const api = new ProductAPI();
    await expect(api.createSPU({
      tenantId: 'test',
      spuId: 'spu1',
      name: '',
      categoryId: 'cat1'
    })).rejects.toThrow('商品名称不能为空');
  });

  it('should throw error for name exceeding 50 characters', async () => {
    const api = new ProductAPI();
    const longName = 'a'.repeat(51);
    await expect(api.createSPU({
      tenantId: 'test',
      spuId: 'spu1',
      name: longName,
      categoryId: 'cat1'
    })).rejects.toThrow('商品名称不能超过50个字符');
  });

  it('should throw error for category exceeding 30 characters', async () => {
    const api = new ProductAPI();
    const longCategory = 'a'.repeat(31);
    await expect(api.createSPU({
      tenantId: 'test',
      spuId: 'spu1',
      name: 'Test Product',
      categoryId: longCategory
    })).rejects.toThrow('商品分类不能超过30个字符');
  });

  it('should throw error for negative stock', async () => {
    const api = new ProductAPI();
    await expect(
      api.createSPU({
        tenantId: 'test',
        spuId: 'spu1',
        name: 'Test Product',
        categoryId: 'cat1',
        stock: -1
      })
    ).rejects.toThrow('商品库存不能为负数');
  });

  it('should throw error for zero or negative price', async () => {
    const api = new ProductAPI();
    await expect(
      api.createSPU({
        tenantId: 'test',
        spuId: 'spu1',
        name: 'Test Product',
        categoryId: 'cat1',
        price: 0
      })
    ).rejects.toThrow('商品价格必须大于0');
  });
});