import { ProductService } from './service';
import { ProductSPU, ProductSKU } from './types';

export class ProductAPI {
  constructor(private service: ProductService) {}

  async createSPU(data: Omit<ProductSPU, 'id'>) {
    return this.service.createSPU(data);
  }

  async createSKU(data: Omit<ProductSKU, 'id'>) {
    return this.service.createSKU(data);
  }

  async getSPU(id: string) {
    return this.service.getSPU(id);
  }

  async getSKU(id: string) {
    return this.service.getSKU(id);
  }

  async getSkusBySpu(spuId: string) {
    return this.service.getSkusBySpu(spuId);
  }
}