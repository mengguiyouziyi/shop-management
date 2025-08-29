import { describe, it, expect, vi } from 'vitest';
import { ProductAPI } from './api';
import { ProductService } from './service';

describe('ProductAPI', () => {
  it('should fetch products list', async () => {
    const productService = new ProductService();
    const api = new ProductAPI(productService);
    
    // Create some test products
    const spu1 = productService.createSPU({
      tenantId: 't1',
      spuId: 'p1',
      name: 'Product 1'
    });
    
    const spu2 = productService.createSPU({
      tenantId: 't1',
      spuId: 'p2',
      name: 'Product 2'
    });
    
    productService.createSKU({
      spuId: spu1.id,
      price: 100,
      barcode: '123'
    });
    
    productService.createSKU({
      spuId: spu2.id,
      price: 200,
      barcode: '456'
    });
    
    const products = await api.getProducts('t1');
    
    expect(products).toHaveLength(2);
    expect(products[0].name).toBe('Product 1');
    expect(products[1].name).toBe('Product 2');
  });

  it('should handle empty products list', async () => {
    const productService = new ProductService();
    const api = new ProductAPI(productService);
    
    const products = await api.getProducts('t1');
    
    expect(products).toHaveLength(0);
  });

  it('should create a new product', async () => {
    const productService = new ProductService();
    const api = new ProductAPI(productService);
    
    const productData = {
      tenantId: 't1',
      spuId: 'p1',
      name: 'New Product',
      price: 150,
      barcode: '789'
    };
    
    const result = await api.createProduct(productData);
    
    expect(result.spu.name).toBe('New Product');
    expect(result.skus).toHaveLength(1);
    expect(result.skus[0].price).toBe(150);
    expect(result.skus[0].barcode).toBe('789');
  });

  it('should handle product creation with missing data', async () => {
    const productService = new ProductService();
    const api = new ProductAPI(productService);
    
    const productData = {
      tenantId: 't1',
      spuId: 'p1',
      name: 'New Product'
      // Missing price and barcode
    };
    
    await expect(api.createProduct(productData as any))
      .rejects
      .toThrow();
  });
});