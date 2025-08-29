import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../../store/useAppStore'
import { act, renderHook } from '@testing-library/react'

describe('完整订单流程集成测试', () => {
  beforeEach(() => {
    // Reset store to initial state
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.products = []
      result.current.members = []
      result.current.orders = []
      result.current.currentOrder = null
    })
  })

  it('应完成从创建商品到下单的流程', () => {
    const { result } = renderHook(() => useAppStore())
    
    // 1. 创建商品
    act(() => {
      result.current.addProduct({
        name: '测试商品',
        category: '测试分类',
        barcode: '123456',
        unit: 'piece',
        price: 100,
        cost: 50,
        stock: 10,
        minStock: 2,
        isActive: true,
      })
    })
    
    expect(result.current.products).toHaveLength(1)
    const product = result.current.products[0]
    expect(product.name).toBe('测试商品')
    expect(product.stock).toBe(10)
    
    // 2. 创建订单项目
    const orderItem = {
      id: 'item1',
      productId: product.id,
      quantity: 2,
      unitPrice: product.price,
      totalPrice: product.price * 2,
    }
    
    // 3. 创建订单
    const mockOrder = {
      items: [orderItem],
      subtotal: 200,
      discount: 0,
      tax: 0,
      total: 200,
      paymentMethod: 'cash',
      status: 'pending',
      staffId: 'staff1',
    } as any
    
    act(() => {
      result.current.createOrder(mockOrder)
    })
    
    expect(result.current.orders).toHaveLength(1)
    const order = result.current.orders[0]
    expect(order.total).toBe(200)
    expect(order.status).toBe('pending')
  })

  it('应处理商品库存', () => {
    const { result } = renderHook(() => useAppStore())
    
    // 1. 创建库存较少的商品
    act(() => {
      result.current.addProduct({
        name: '限量商品',
        category: '测试分类',
        barcode: '789012',
        unit: 'piece',
        price: 50,
        cost: 25,
        stock: 1,
        minStock: 0,
        isActive: true,
      })
    })
    
    expect(result.current.products).toHaveLength(1)
    const product = result.current.products[0]
    expect(product.stock).toBe(1)
  })
})