import { describe, it, expect, beforeEach } from 'vitest';
import { ProductService } from './service';
import { ProductSPU, ProductSKU } from './types';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
  });

  it('should create SPU', () => {
    const spu = service.createSPU({
      tenantId: 't1',
      spuId: 'p1',
      name: '测试商品'
    });
    
    expect(spu.id).toBeDefined();
    expect(spu.name).toBe('测试商品');
  });

  it('should create SKU', () => {
    const spu = service.createSPU({
      tenantId: 't1',
      spuId: 'p1',
      name: '测试商品'
    });
    
    const sku = service.createSKU({
      spuId: spu.id,
      price: 100,
      barcode: '123456'
    });
    
    expect(sku.id).toBeDefined();
    expect(sku.price).toBe(100);
    expect(sku.barcode).toBe('123456');
  });

  it('should get SKUs by SPU', () => {
    const spu = service.createSPU({
      tenantId: 't1',
      spuId: 'p1',
      name: '测试商品'
    });
    
    service.createSKU({spuId: spu.id, price: 100, barcode: '123'});
    service.createSKU({spuId: spu.id, price: 200, barcode: '456'});
    
    const skus = service.getSkusBySpu(spu.id);
    expect(skus).toHaveLength(2);
    expect(skus[0].price).toBe(100);
    expect(skus[1].price).toBe(200);
  });

  it('should get SPU by id', () => {
    const spu = service.createSPU({
      tenantId: 't1',
      spuId: 'p1',
      name: '测试商品'
    });
    
    const retrievedSPU = service.getSPU(spu.id);
    expect(retrievedSPU).toEqual(spu);
  });

  it('should get SKU by id', () => {
    const spu = service.createSPU({
      tenantId: 't1',
      spuId: 'p1',
      name: '测试商品'
    });
    
    const sku = service.createSKU({
      spuId: spu.id,
      price: 100,
      barcode: '123456'
    });
    
    const retrievedSKU = service.getSKU(sku.id);
    expect(retrievedSKU).toEqual(sku);
  });

  it('should return undefined for non-existent SPU', () => {
    const spu = service.getSPU('non-existent-id');
    expect(spu).toBeUndefined();
  });

  it('should return undefined for non-existent SKU', () => {
    const sku = service.getSKU('non-existent-id');
    expect(sku).toBeUndefined();
  });

  it('should handle multiple SKUs for one SPU', () => {
    const spu = service.createSPU({
      tenantId: 't1',
      spuId: 'p1',
      name: '测试商品'
    });
    
    // Create multiple SKUs
    const sku1 = service.createSKU({spuId: spu.id, price: 100, barcode: '001'});
    const sku2 = service.createSKU({spuId: spu.id, price: 150, barcode: '002'});
    const sku3 = service.createSKU({spuId: spu.id, price: 200, barcode: '003'});
    
    const skus = service.getSkusBySpu(spu.id);
    expect(skus).toHaveLength(3);
    expect(skus.map(s => s.id)).toContain(sku1.id);
    expect(skus.map(s => s.id)).toContain(sku2.id);
    expect(skus.map(s => s.id)).toContain(sku3.id);
  });
});