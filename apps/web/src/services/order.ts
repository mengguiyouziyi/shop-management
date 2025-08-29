export async function createOrder(items: Array<{productId: string; quantity: number}>) {
  // 这是一个占位函数，实际实现将在后续开发中完成
  return {
    id: 'order_' + Date.now(),
    items: [],
    total: 0,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
}