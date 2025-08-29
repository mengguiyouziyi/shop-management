import { describe, it, expect, beforeEach } from 'vitest'
import { products } from '../../services/product'
import type { Product } from '../../types/shop'

describe('商品服务', () => {
  const testProduct: Product = {
    id: 'p001',
    name: '测试商品',
    price: 100,
    stock: 10
  } as any

  beforeEach(() => {
    // Clear products
    Object.keys(products).forEach(key => {
      delete products[key]
    })
    products[testProduct.id] = { ...testProduct }
  })

  it('应正确存储商品', () => {
    expect(products[testProduct.id]).toEqual(testProduct)
  })

  it('应能通过ID访问商品', () => {
    const product = products[testProduct.id]
    expect(product).toBeDefined()
    expect(product?.id).toBe(testProduct.id)
  })
})