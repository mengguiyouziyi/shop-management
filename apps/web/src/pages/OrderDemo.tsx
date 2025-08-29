import { useState } from 'react'
import { createOrder, processPayment } from '../services/order'

export default function OrderDemo() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const createTestOrder = () => {
    setLoading(true)
    const newOrder = createOrder([{productId: 'p001', quantity: 2}])
    setOrder(newOrder)
    setLoading(false)
  }

  const handlePayment = async () => {
    setLoading(true)
    await processPayment(order.id)
    setOrder({...order, status: 'paid'})
    setLoading(false)
  }

  return (
    <div style={{padding: '20px'}}>
      <h2>订单功能演示</h2>
      
      {!order ? (
        <button onClick={createTestOrder} disabled={loading}>
          {loading ? '创建中...' : '创建测试订单'}
        </button>
      ) : (
        <div>
          <p>订单ID: {order.id}</p>
          <p>状态: 
            <span style={{color: order.status === 'paid' ? 'green' : 'orange'}}>
              {order.status === 'paid' ? '已支付' : '待支付'}
            </span>
          </p>
          <p>金额: ¥350</p>
          
          {order.status !== 'paid' && (
            <button onClick={handlePayment} disabled={loading}>
              {loading ? '支付中...' : '模拟支付'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}