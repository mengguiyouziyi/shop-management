/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../../store/useAppStore'
import { act, renderHook } from '@testing-library/react'

describe('完整订单流程集成测试', () => {
  const mockStore = {
    id: 'test-store',
    name: 'Test Store',
    address: 'Test Address'
  };

  beforeEach(() => {
    // Reset store to initial state
    const { result } = renderHook(() => useAppStore())
    act(() => {
      // 重置所有状态到初始值
      result.current.setCurrentStore(null);
      // 设置mock store
      result.current.setCurrentStore(mockStore);
      // 清空数据
      result.current.products = [];
      result.current.orders = [];
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
      totalAmount: orderItem.totalPrice,
      status: 'completed' as const,
      paymentStatus: 'paid' as const,
    }
    
    act(() => {
      result.current.addOrder(mockOrder)
    })
    
    expect(result.current.orders).toHaveLength(1)
    expect(result.current.orders[0].items).toHaveLength(1)
    expect(result.current.orders[0].totalAmount).toBe(200)
  })

  it('应处理商品库存', () => {
    const { result } = renderHook(() => useAppStore())
    
    // 清空产品列表确保没有遗留数据
    act(() => {
      result.current.products = [];
    });
    
    // 创建商品，初始库存为10
    act(() => {
      result.current.addProduct({
        name: '库存商品',
        category: '测试分类',
        barcode: '654321',
        unit: 'piece',
        price: 50,
        cost: 25,
        stock: 10,
        minStock: 2,
        isActive: true,
      })
    })
    
    expect(result.current.products).toHaveLength(1)
    const product = result.current.products[0]
    expect(product.stock).toBe(10)
    
    // 模拟销售减少库存
    act(() => {
      result.current.updateProduct(product.id, {
        ...product,
        stock: product.stock - 3, // 减少3个库存
      })
    })
    
    const updatedProduct = result.current.products[0]
    expect(updatedProduct.stock).toBe(7)
  })
})