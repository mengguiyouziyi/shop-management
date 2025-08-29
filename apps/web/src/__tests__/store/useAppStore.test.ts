import { act, renderHook } from '@testing-library/react';
import { useAppStore } from '../../store/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.products = [];
      result.current.members = [];
      result.current.orders = [];
      result.current.stores = [];
      result.current.staff = [];
      result.current.currentStore = null;
      result.current.currentStaff = null;
      result.current.currentOrder = null;
      result.current.suspendedOrders = [];
    });
  });

  it('should initialize with empty arrays and null values', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.products).toEqual([]);
    expect(result.current.members).toEqual([]);
    expect(result.current.orders).toEqual([]);
    expect(result.current.stores).toEqual([]);
    expect(result.current.staff).toEqual([]);
    expect(result.current.currentStore).toBeNull();
    expect(result.current.currentStaff).toBeNull();
    expect(result.current.currentOrder).toBeNull();
    expect(result.current.suspendedOrders).toEqual([]);
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
    expect(product.createdAt).toBeDefined();
    expect(product.updatedAt).toBeDefined();
  });

  it('should update a product', () => {
    const { result } = renderHook(() => useAppStore());
    
    // First add a product
    act(() => {
      result.current.addProduct({
        name: 'Test Product',
        category: 'Test Category',
        barcode: '123456789',
        unit: 'piece',
        price: 100,
        cost: 50,
        stock: 10,
        minStock: 2,
        isActive: true,
      });
    });
    
    const productId = result.current.products[0].id;
    
    // Update the product
    act(() => {
      result.current.updateProduct(productId, { name: 'Updated Product', price: 150 });
    });
    
    const updatedProduct = result.current.products[0];
    expect(updatedProduct.name).toBe('Updated Product');
    expect(updatedProduct.price).toBe(150);
  });

  it('should delete a product', () => {
    const { result } = renderHook(() => useAppStore());
    
    // Add products
    act(() => {
      result.current.addProduct({
        name: 'Product 1',
        category: 'Category 1',
        barcode: '111',
        unit: 'piece',
        price: 100,
        cost: 50,
        stock: 10,
        minStock: 2,
        isActive: true,
      });
      
      result.current.addProduct({
        name: 'Product 2',
        category: 'Category 2',
        barcode: '222',
        unit: 'piece',
        price: 200,
        cost: 100,
        stock: 5,
        minStock: 1,
        isActive: true,
      });
    });
    
    expect(result.current.products).toHaveLength(2);
    
    const productIdToDelete = result.current.products[0].id;
    
    // Delete one product
    act(() => {
      result.current.deleteProduct(productIdToDelete);
    });
    
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].name).toBe('Product 2');
  });

  it('should manage current order', () => {
    const { result } = renderHook(() => useAppStore());
    
    const mockOrder = {
      id: 'order1',
      orderNumber: 'ORD-001',
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      paymentMethod: 'cash',
      status: 'pending',
      staffId: 'staff1',
      createdAt: new Date().toISOString(),
    } as any;
    
    // Set current order
    act(() => {
      result.current.setCurrentOrder(mockOrder);
    });
    
    expect(result.current.currentOrder).toEqual(mockOrder);
    
    // Clear current order
    act(() => {
      result.current.setCurrentOrder(null);
    });
    
    expect(result.current.currentOrder).toBeNull();
  });
});