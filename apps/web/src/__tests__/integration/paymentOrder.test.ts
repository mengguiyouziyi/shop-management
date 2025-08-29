import { describe, it, expect } from 'vitest'
import { createOrder } from '../../services/order'
import { createPayment, processPayment } from '../../services/payment'

describe('支付+订单集成测试', () => {
  it('应正确创建支付记录', async () => {
    const orderItems = [{ productId: 'p1', quantity: 2 }]
    const order: any = await createOrder(orderItems)
    const payment = createPayment(order)
    
    expect(payment.id).toBeDefined()
    expect(payment.orderId).toBe(order.id)
    expect(payment.amount).toBe(order.total)
    expect(payment.status).toBe('pending')
  })

  it('应正确处理支付', async () => {
    const orderItems = [{ productId: 'p1', quantity: 1 }]
    const order: any = await createOrder(orderItems)
    const payment = createPayment(order)
    
    const processedPayment = await processPayment(payment.id)
    
    expect(processedPayment.status).toBe('completed')
  })
})