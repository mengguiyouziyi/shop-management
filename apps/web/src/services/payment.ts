import { Order } from './order'
import { products } from './product'

export interface Payment {
  id: string
  orderId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}

const payments: Record<string, Payment> = {}

export function createPayment(order: Order): Payment {
  const payment = {
    id: `pay_${Date.now()}`,
    orderId: order.id,
    amount: order.total,
    status: 'pending',
    createdAt: new Date()
  }
  payments[payment.id] = payment
  return payment
}

export function processPayment(paymentId: string): Promise<Payment> {
  const payment = payments[paymentId]
  if (!payment) {
    throw new Error('支付记录不存在')
  }
  payment.status = 'completed'
  return Promise.resolve(payment)
}
