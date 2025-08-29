/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useAppStore } from '../../store/useAppStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useAppStore', () => {
  const mockStore = {
    id: 'test-store',
    name: 'Test Store',
    address: 'Test Address'
  };

  beforeEach(() => {
    // Reset store to initial state
    const { result } = renderHook(() => useAppStore());
    act(() => {
      // 重置所有状态到初始值
      result.current.setCurrentStore(null);
      // 设置mock store
      result.current.setCurrentStore(mockStore);
      // 清空数据
      result.current.products = [];
      result.current.members = [];
      result.current.orders = [];
    });
  });

  it('should initialize with empty arrays and null values', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.products).toEqual([]);
    expect(result.current.members).toEqual([]);
    expect(result.current.orders).toEqual([]);
  });

  it('should add a product', () => {
    const { result } = renderHook(() => useAppStore());
    
    const newProduct = {
      name: 'Test Product',
      category: 'Test Category',
      barcode: '123456789',
      unit: 'piece' as const,
      price: 100,
      cost: 50,
      stock: 10,
      minStock: 2,
      isActive: true,
    };
    
    act(() => {
      result.current.addProduct(newProduct);
    });
    
    expect(result.current.products).toHaveLength(1);
    const product = result.current.products[0];
    expect(product.name).toBe('Test Product');
    expect(product.id).toBeDefined();
    expect(product.storeId).toBe(mockStore.id);
  });

  it('should update a product', () => {
    const { result } = renderHook(() => useAppStore());
    
    // First add a product
    act(() => {
      result.current.addProduct({
        name: 'Test Product',
        category: 'Test Category',
        barcode: '123456789',
        unit: 'piece' as const,
        price: 100,
        cost: 50,
        stock: 10,
        minStock: 2,
        isActive: true,
      });
    });

    const productId = result.current.products[0].id;
    const updatedProduct = { 
      name: 'Updated Product', 
      price: 150,
    };

    act(() => {
      result.current.updateProduct(productId, updatedProduct);
    });

    expect(result.current.products[0].name).toBe('Updated Product');
    expect(result.current.products[0].price).toBe(150);
  });

  it('should delete a product', () => {
    const { result } = renderHook(() => useAppStore());
    
    // Clear products first to ensure clean state
    act(() => {
      result.current.products = [];
    });
    
    // Add a product
    act(() => {
      result.current.addProduct({
        name: 'Test Product',
        category: 'Test Category',
        barcode: '123456789',
        unit: 'piece' as const,
        price: 100,
        cost: 50,
        stock: 10,
        minStock: 2,
        isActive: true,
      });
    });

    expect(result.current.products).toHaveLength(1);

    const productId = result.current.products[0].id;

    act(() => {
      result.current.deleteProduct(productId);
    });

    expect(result.current.products).toHaveLength(0);
  });

  it('should add a member', () => {
    const { result } = renderHook(() => useAppStore());
    
    const newMember = {
      name: 'Test Member',
      phone: '13800138000',
      email: 'member@test.com',
      points: 0,
      level: 'normal' as const,
      totalSpent: 0,
    };

    act(() => {
      result.current.addMember(newMember);
    });

    expect(result.current.members).toHaveLength(1);
    const member = result.current.members[0];
    expect(member.name).toBe('Test Member');
    expect(member.id).toBeDefined();
    expect(member.storeId).toBe(mockStore.id);
  });

  it('should add an order', () => {
    const { result } = renderHook(() => useAppStore());
    
    const newOrder = {
      items: [],
      totalAmount: 100,
      status: 'completed' as const,
      paymentStatus: 'paid' as const,
    };

    act(() => {
      result.current.addOrder(newOrder);
    });

    expect(result.current.orders).toHaveLength(1);
    const order = result.current.orders[0];
    expect(order.id).toBeDefined();
    expect(order.storeId).toBe(mockStore.id);
    expect(order.createdAt).toBeDefined();
    expect(order.totalAmount).toBe(100);
  });
});