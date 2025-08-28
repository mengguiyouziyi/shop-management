import { describe, it, expect } from 'vitest'
import { calculateOrderTotal, Order } from '../../services/order'

describe('订单服务', () => {
  const testOrder: Order = {
    id: 'o001',
    items: [
      { productId: 'p001', price: 100, quantity: 2 },
      { productId: 'p002', price: 50, quantity: 3 }
    ]
  }

  it('应正确计算订单总额', () => {
    const result = calculateOrderTotal(testOrder)
    expect(result.total).toBe(350)
  })

  it('应正确处理折扣', () => {
    const discountOrder = {
      ...testOrder,
      discount: 0.1 // 10%折扣
    }
    const result = calculateOrderTotal(discountOrder)
    expect(result.total).toBe(315)
  })
})