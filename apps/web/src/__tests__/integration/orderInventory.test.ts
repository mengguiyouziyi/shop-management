import { describe, it, expect, beforeAll } from 'vitest'
import { createOrder } from '../../services/order'
import { getProduct, updateStock, resetProductStore, products } from '../../services/product'

describe('订单+库存集成测试', () => {
  const testProduct = {
    id: 'p1001',
    name: '集成测试商品',
    price: 200,
    stock: 10
  }

  beforeAll(async () => {
    await resetProductStore()
    // 直接初始化商品数据
    products[testProduct.id] = { ...testProduct, stock: 10 }
    console.log('Initialized stock:', (await getProduct(testProduct.id)).stock)
  })

  it('创建订单应自动扣减库存', async () => {
    const order = await createOrder({
      productId: testProduct.id,
      quantity: 2
    })
    
    const product = await getProduct(testProduct.id)
    expect(product.stock).toBe(8)
    expect(order.total).toBe(400)
  })

  it('库存不足时应拒绝订单', async () => {
    await expect(
      createOrder({
        productId: testProduct.id,
        quantity: 20
      })
    ).rejects.toThrow('库存不足')
  })
})