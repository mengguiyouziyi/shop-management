import { describe, it, expect } from 'vitest'
import { createPayment, processPayment } from '../../services/payment'
import type { Order } from '../../services/order'

describe('支付服务', () => {
  const testOrder = {
    id: 'order_123',
    total: 100,
    items: []
  }

  it('应成功创建支付记录', () => {
    const payment = createPayment(testOrder)
    expect(payment.amount).toBe(100)
    expect(payment.status).toBe('pending')
  })

  it('应成功处理支付', async () => {
    const payment = createPayment(testOrder)
    const result = await processPayment(payment.id)
    expect(result.status).toBe('completed')
  })
})