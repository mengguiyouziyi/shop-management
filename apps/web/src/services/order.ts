export interface OrderItem {
  productId: string
  price: number
  quantity: number
}

import { getProduct, updateStock } from './product'

export interface Order {
  id: string
  productId: string
  quantity: number
  total: number
  status?: string
}

export async function createOrder(orderData: {
  productId: string
  quantity: number
}) {
  const product = await getProduct(orderData.productId)
  
  if (product.stock < orderData.quantity) {
    throw new Error('库存不足')
  }

  try {
    await updateStock(product, -orderData.quantity)
    
    const newOrder = {
      id: `order_${Date.now()}`,
      productId: product.id,
      quantity: orderData.quantity,
      total: product.price * orderData.quantity,
      status: 'completed'
    }
    
    return newOrder
  } catch (error) {
    await updateStock(product, orderData.quantity)
    throw error
  }
}

export function calculateOrderTotal(order: {
  items: OrderItem[]
  discount?: number
}) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  )
  const discount = order.discount || 0
  const total = subtotal * (1 - discount)

  return {
    subtotal,
    discount: discount * 100,
    total
  }
}
