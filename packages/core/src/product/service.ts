import { ProductSPU, ProductSKU } from './types';

export class ProductService {
  private spuMap = new Map<string, ProductSPU>();
  private skuMap = new Map<string, ProductSKU>();
  private spuToSkus = new Map<string, ProductSKU[]>();

  createSPU(spu: Omit<ProductSPU, 'id'>): ProductSPU {
    const id = crypto.randomUUID();
    const newSPU = { ...spu, id };
    this.spuMap.set(id, newSPU);
    this.spuToSkus.set(id, []);
    return newSPU;
  }

  createSKU(sku: Omit<ProductSKU, 'id'>): ProductSKU {
    const id = crypto.randomUUID();
    const newSKU = { ...sku, id };
    this.skuMap.set(id, newSKU);
    
    // Add SKU to SPU's SKU list
    const spuSkus = this.spuToSkus.get(sku.spuId) || [];
    spuSkus.push(newSKU);
    this.spuToSkus.set(sku.spuId, spuSkus);
    
    return newSKU;
  }

  getSPU(id: string): ProductSPU | undefined {
    return this.spuMap.get(id);
  }

  getSKU(id: string): ProductSKU | undefined {
    return this.skuMap.get(id);
  }

  getSkusBySpu(spuId: string): ProductSKU[] {
    return this.spuToSkus.get(spuId) || [];
  }
}