import { create } from 'zustand';
import { Product, Member, Order } from '../types';
import { StorageService } from '../services/storage';
import type { Store } from '../types/store';
import { StoreService } from '../services/store';

interface AppState {
  currentStore: Store | null;
  products: Product[];
  members: Member[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  setCurrentStore: (store: Store | null) => void;
  initializeStore: () => void;
}

const storageService = StorageService.getInstance();

const defaultState = {
  currentStore: null,
  products: [],
  members: [],
  orders: []
};

export const useAppStore = create<AppState>((set, get) => ({
  ...defaultState,
  
  addProduct: (product) => {
    const currentStore = get().currentStore;
    if (!currentStore) return;
    
    const newProduct = { 
      ...product, 
      id: `prod_${currentStore.id}_${Date.now()}`,
      storeId: currentStore.id
    };
    
    set((state) => {
      const newState = { ...state, products: [...state.products, newProduct] };
      storageService.set(`app_state_${currentStore.id}`, newState);
      return newState;
    });
  },
  
  updateProduct: (id, product) => {
    const currentStore = get().currentStore;
    if (!currentStore) return;
    
    set((state) => {
      const newState = {
        ...state,
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...product } : p
        )
      };
      storageService.set(`app_state_${currentStore.id}`, newState);
      return newState;
    });
  },
  
  deleteProduct: (id) => {
    const currentStore = get().currentStore;
    if (!currentStore) return;
    
    set((state) => {
      const newState = {
        ...state,
        products: state.products.filter((p) => p.id !== id)
      };
      storageService.set(`app_state_${currentStore.id}`, newState);
      return newState;
    });
  },
  
  addMember: (member) => {
    const currentStore = get().currentStore;
    if (!currentStore) return;
    
    const newMember = { 
      ...member, 
      id: `member_${currentStore.id}_${Date.now()}`,
      storeId: currentStore.id
    };
    
    set((state) => {
      const newState = { ...state, members: [...state.members, newMember] };
      storageService.set(`app_state_${currentStore.id}`, newState);
      return newState;
    });
  },
  
  updateMember: (id, member) => {
    const currentStore = get().currentStore;
    if (!currentStore) return;
    
    set((state) => {
      const newState = {
        ...state,
        members: state.members.map((m) =>
          m.id === id ? { ...m, ...member } : m
        )
      };
      storageService.set(`app_state_${currentStore.id}`, newState);
      return newState;
    });
  },
  
  deleteMember: (id) => {
    const currentStore = get().currentStore;
    if (!currentStore) return;
    
    set((state) => {
      const newState = {
        ...state,
        members: state.members.filter((m) => m.id !== id)
      };
      storageService.set(`app_state_${currentStore.id}`, newState);
      return newState;
    });
  },
  
  addOrder: (order) => {
    const currentStore = get().currentStore;
    if (!currentStore) return;
    
    const newOrder = { 
      ...order, 
      id: `order_${currentStore.id}_${Date.now()}`, 
      createdAt: new Date().toISOString(),
      storeId: currentStore.id
    };
    
    set((state) => {
      const newState = { ...state, orders: [...state.orders, newOrder] };
      storageService.set(`app_state_${currentStore.id}`, newState);
      return newState;
    });
  },
  
  setCurrentStore: (store) => {
    set({ currentStore: store });
    
    // 如果设置了店铺，加载该店铺的数据
    if (store) {
      const savedState = storageService.get<any>(`app_state_${store.id}`);
      if (savedState) {
        set({
          products: savedState.products || [],
          members: savedState.members || [],
          orders: savedState.orders || []
        });
      } else {
        // 如果没有保存的数据，初始化为空
        set({
          products: [],
          members: [],
          orders: []
        });
      }
    }
  },
  
  initializeStore: () => {
    // 初始化时尝试获取当前店铺
    const storeService = StoreService.getInstance();
    const currentStore = storeService.getCurrentStore();
    
    if (currentStore) {
      set({ currentStore });
      const savedState = storageService.get<any>(`app_state_${currentStore.id}`);
      if (savedState) {
        set({
          products: savedState.products || [],
          members: savedState.members || [],
          orders: savedState.orders || []
        });
      } else {
        // 如果没有保存的数据，创建示例数据
        const sampleProducts = [
          {
            id: `prod_${currentStore.id}_1`,
            name: '示例商品1',
            description: '这是一个示例商品',
            category: '电子产品',
            barcode: '1234567890123',
            unit: 'piece' as const,
            price: 99.99,
            cost: 50.00,
            stock: 100,
            minStock: 10,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: `prod_${currentStore.id}_2`,
            name: '示例商品2',
            description: '这是另一个示例商品',
            category: '日用品',
            barcode: '2345678901234',
            unit: 'piece' as const,
            price: 29.99,
            cost: 15.00,
            stock: 200,
            minStock: 20,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: `prod_${currentStore.id}_3`,
            name: '示例商品3',
            description: '这是第三个示例商品',
            category: '食品',
            barcode: '3456789012345',
            unit: 'piece' as const,
            price: 15.99,
            cost: 8.00,
            stock: 150,
            minStock: 30,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        const sampleMembers = [
          {
            id: `member_${currentStore.id}_1`,
            name: '张三',
            phone: '13800138001',
            email: 'zhangsan@example.com',
            level: 'bronze' as const,
            points: 100,
            balance: 50.00,
            totalSpent: 500.00,
            joinDate: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            isActive: true
          },
          {
            id: `member_${currentStore.id}_2`,
            name: '李四',
            phone: '13800138002',
            email: 'lisi@example.com',
            level: 'silver' as const,
            points: 500,
            balance: 200.00,
            totalSpent: 2000.00,
            joinDate: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            isActive: true
          }
        ];
        
        const sampleOrders = [
          {
            id: `order_${currentStore.id}_1`,
            orderNumber: `ORD${Date.now()}001`,
            memberId: `member_${currentStore.id}_1`,
            items: [
              {
                id: `item_${currentStore.id}_1_1`,
                productId: `prod_${currentStore.id}_1`,
                quantity: 2,
                unitPrice: 99.99,
                totalPrice: 199.98
              },
              {
                id: `item_${currentStore.id}_1_2`,
                productId: `prod_${currentStore.id}_2`,
                quantity: 1,
                unitPrice: 29.99,
                totalPrice: 29.99
              }
            ],
            subtotal: 229.97,
            discount: 10.00,
            tax: 0.00,
            total: 219.97,
            paymentMethod: 'cash' as const,
            status: 'completed' as const,
            staffId: 'staff_001',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `order_${currentStore.id}_2`,
            orderNumber: `ORD${Date.now()}002`,
            memberId: `member_${currentStore.id}_2`,
            items: [
              {
                id: `item_${currentStore.id}_2_1`,
                productId: `prod_${currentStore.id}_3`,
                quantity: 3,
                unitPrice: 15.99,
                totalPrice: 47.97
              }
            ],
            subtotal: 47.97,
            discount: 0.00,
            tax: 0.00,
            total: 47.97,
            paymentMethod: 'card' as const,
            status: 'completed' as const,
            staffId: 'staff_001',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        const newState = {
          products: sampleProducts,
          members: sampleMembers,
          orders: sampleOrders
        };
        
        set(newState);
        storageService.set(`app_state_${currentStore.id}`, newState);
      }
    }
  }
}));