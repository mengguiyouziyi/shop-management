import { ProductSPU, ProductSKU } from '@/types'

const generateId = () => Math.random().toString(36).slice(2, 10)

export class ProductManager {
  private spuList: ProductSPU[] = []
  
  createSPU(spu: Omit<ProductSPU, 'id'>) {
    const newSPU = { ...spu, id: generateId() }
    this.spuList.push(newSPU)
    return newSPU
  }

  getSPUById(id: string) {
    return this.spuList.find(spu => spu.id === id)
  }

  createSKU(spuId: string, sku: Omit<ProductSKU, 'id'>) {
    const spu = this.getSPUById(spuId)
    if (!spu) throw new Error('SPU不存在')
    
    const newSKU = { ...sku, id: generateId(), spuId }
    spu.skus = [...(spu.skus || []), newSKU]
    return newSKU
  }
}