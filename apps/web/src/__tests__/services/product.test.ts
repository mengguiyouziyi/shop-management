import { describe, it, expect } from 'vitest'
import { updateStock, Product } from '../../services/product'

describe('商品服务', () => {
  const testProduct: Product = {
    id: 'p001',
    name: '测试商品',
    price: 100,
    stock: 10
  }

  it('应正确减少库存', () => {
    const result = updateStock(testProduct, -2)
    expect(result.stock).toBe(8)
  })

  it('应正确增加库存', () => {
    const result = updateStock(testProduct, 5)
    expect(result.stock).toBe(15)
  })

  it('应拒绝负库存', () => {
    expect(() => updateStock(testProduct, -20)).toThrowError('库存不足')
  })
})