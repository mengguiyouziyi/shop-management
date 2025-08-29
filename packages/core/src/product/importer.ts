import { ProductService } from './service';
import { ProductSPU, ProductSKU } from './types';

export class ProductImporter {
  constructor(private service: ProductService) {}

  async importFromCSV(csvData: string): Promise<{
    spus: ProductSPU[];
    skus: ProductSKU[];
  }> {
    const lines = csvData.split('\n');
    const spus: ProductSPU[] = [];
    const skus: ProductSKU[] = [];
    
    for (const line of lines.slice(1)) { // Skip header
      const [name, category, barcode, price] = line.split(',');
      
      const spu = this.service.createSPU({
        tenantId: 'default',
        spuId: `spu_${Date.now()}`,
        name,
        categoryId: category
      });
      
      const sku = this.service.createSKU({
        spuId: spu.id,
        barcode,
        price: Number(price),
        unit: '个'
      });
      
      spus.push(spu);
      skus.push(sku);
    }
    
    return { spus, skus };
  }
}