import { describe, it, expect } from 'vitest'
import { createOrder } from '../../services/order'

describe('订单集成测试', () => {
  it('应正确创建订单', async () => {
    const items = [{ productId: 'p1', quantity: 2 }]
    const order: any = await createOrder(items)
    
    expect(order.id).toBeDefined()
    expect(order.status).toBe('pending')
  })

  it('应处理订单项目', async () => {
    const items = [{ productId: 'p1', quantity: 1 }]
    const order: any = await createOrder(items)
    
    expect(order.items).toBeDefined()
    expect(order.total).toBeDefined()
  })
})