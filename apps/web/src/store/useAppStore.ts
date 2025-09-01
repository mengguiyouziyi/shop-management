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
            name: 'iPhone 15 Pro',
            description: '苹果最新款智能手机，配备A17 Pro芯片',
            category: '电子产品',
            barcode: '1234567890123',
            unit: 'piece' as const,
            price: 8999.00,
            cost: 7200.00,
            stock: 25,
            minStock: 5,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: `prod_${currentStore.id}_2`,
            name: '小米电视 65寸',
            description: '4K超高清智能电视，支持HDR',
            category: '家电',
            barcode: '2345678901234',
            unit: 'piece' as const,
            price: 3299.00,
            cost: 2600.00,
            stock: 12,
            minStock: 3,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: `prod_${currentStore.id}_3`,
            name: '可口可乐 330ml',
            description: '经典碳酸饮料',
            category: '食品饮料',
            barcode: '3456789012345',
            unit: 'piece' as const,
            price: 3.50,
            cost: 2.00,
            stock: 200,
            minStock: 50,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: `prod_${currentStore.id}_4`,
            name: '耐克运动鞋',
            description: '透气舒适运动鞋，适合跑步健身',
            category: '服装鞋帽',
            barcode: '4567890123456',
            unit: 'piece' as const,
            price: 599.00,
            cost: 380.00,
            stock: 45,
            minStock: 10,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: `prod_${currentStore.id}_5`,
            name: '兰蔻小黑瓶精华',
            description: '抗衰老精华液，修复肌肤',
            category: '美妆护肤',
            barcode: '5678901234567',
            unit: 'piece' as const,
            price: 1280.00,
            cost: 890.00,
            stock: 18,
            minStock: 5,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: `prod_${currentStore.id}_6`,
            name: '乐高积木城市系列',
            description: '儿童益智积木玩具',
            category: '玩具文具',
            barcode: '6789012345678',
            unit: 'piece' as const,
            price: 299.00,
            cost: 180.00,
            stock: 32,
            minStock: 8,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: `prod_${currentStore.id}_7`,
            name: '戴森吸尘器V15',
            description: '无绳吸尘器，强劲吸力',
            category: '家居用品',
            barcode: '7890123456789',
            unit: 'piece' as const,
            price: 4590.00,
            cost: 3200.00,
            stock: 8,
            minStock: 2,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: `prod_${currentStore.id}_8`,
            name: '三只松鼠坚果礼盒',
            description: '混合坚果礼盒，营养健康',
            category: '食品饮料',
            barcode: '8901234567890',
            unit: 'piece' as const,
            price: 89.90,
            cost: 55.00,
            stock: 65,
            minStock: 15,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        const sampleMembers = [
          {
            id: `member_${currentStore.id}_1`,
            name: '王晓明',
            phone: '13800138001',
            email: 'wangxiaoming@example.com',
            level: 'gold' as const,
            points: 2580,
            balance: 580.00,
            totalSpent: 15800.00,
            joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          },
          {
            id: `member_${currentStore.id}_2`,
            name: '李美丽',
            phone: '13800138002',
            email: 'limeili@example.com',
            level: 'diamond' as const,
            points: 5600,
            balance: 1200.00,
            totalSpent: 32600.00,
            joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          },
          {
            id: `member_${currentStore.id}_3`,
            name: '张志强',
            phone: '13800138003',
            email: 'zhangzhiqiang@example.com',
            level: 'silver' as const,
            points: 980,
            balance: 320.00,
            totalSpent: 6800.00,
            joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          },
          {
            id: `member_${currentStore.id}_4`,
            name: '刘小芳',
            phone: '13800138004',
            email: 'liuxiaofang@example.com',
            level: 'bronze' as const,
            points: 280,
            balance: 85.00,
            totalSpent: 1200.00,
            joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastVisit: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          },
          {
            id: `member_${currentStore.id}_5`,
            name: '陈大华',
            phone: '13800138005',
            email: 'chendahua@example.com',
            level: 'silver' as const,
            points: 1200,
            balance: 450.00,
            totalSpent: 8900.00,
            joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          },
          {
            id: `member_${currentStore.id}_6`,
            name: '赵雅婷',
            phone: '13800138006',
            email: 'zhaoyating@example.com',
            level: 'gold' as const,
            points: 3200,
            balance: 780.00,
            totalSpent: 18900.00,
            joinDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
            lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          }
        ];
        
        const sampleOrders = [
          {
            id: `order_${currentStore.id}_1`,
            orderNumber: `ORD${Date.now() - 5 * 24 * 60 * 60 * 1000}001`,
            memberId: `member_${currentStore.id}_2`,
            items: [
              {
                id: `item_${currentStore.id}_1_1`,
                productId: `prod_${currentStore.id}_1`,
                quantity: 1,
                unitPrice: 8999.00,
                totalPrice: 8999.00
              },
              {
                id: `item_${currentStore.id}_1_2`,
                productId: `prod_${currentStore.id}_5`,
                quantity: 2,
                unitPrice: 1280.00,
                totalPrice: 2560.00
              }
            ],
            subtotal: 11559.00,
            discount: 500.00,
            tax: 0.00,
            total: 11059.00,
            paymentMethod: 'card' as const,
            status: 'completed' as const,
            staffId: 'staff_001',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `order_${currentStore.id}_2`,
            orderNumber: `ORD${Date.now() - 3 * 24 * 60 * 60 * 1000}002`,
            memberId: `member_${currentStore.id}_1`,
            items: [
              {
                id: `item_${currentStore.id}_2_1`,
                productId: `prod_${currentStore.id}_2`,
                quantity: 1,
                unitPrice: 3299.00,
                totalPrice: 3299.00
              }
            ],
            subtotal: 3299.00,
            discount: 200.00,
            tax: 0.00,
            total: 3099.00,
            paymentMethod: 'card' as const,
            status: 'completed' as const,
            staffId: 'staff_002',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `order_${currentStore.id}_3`,
            orderNumber: `ORD${Date.now() - 2 * 24 * 60 * 60 * 1000}003`,
            memberId: `member_${currentStore.id}_6`,
            items: [
              {
                id: `item_${currentStore.id}_3_1`,
                productId: `prod_${currentStore.id}_4`,
                quantity: 2,
                unitPrice: 599.00,
                totalPrice: 1198.00
              },
              {
                id: `item_${currentStore.id}_3_2`,
                productId: `prod_${currentStore.id}_8`,
                quantity: 3,
                unitPrice: 89.90,
                totalPrice: 269.70
              }
            ],
            subtotal: 1467.70,
            discount: 67.70,
            tax: 0.00,
            total: 1400.00,
            paymentMethod: 'cash' as const,
            status: 'completed' as const,
            staffId: 'staff_001',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `order_${currentStore.id}_4`,
            orderNumber: `ORD${Date.now() - 1 * 24 * 60 * 60 * 1000}004`,
            memberId: `member_${currentStore.id}_3`,
            items: [
              {
                id: `item_${currentStore.id}_4_1`,
                productId: `prod_${currentStore.id}_7`,
                quantity: 1,
                unitPrice: 4590.00,
                totalPrice: 4590.00
              }
            ],
            subtotal: 4590.00,
            discount: 300.00,
            tax: 0.00,
            total: 4290.00,
            paymentMethod: 'card' as const,
            status: 'completed' as const,
            staffId: 'staff_002',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `order_${currentStore.id}_5`,
            orderNumber: `ORD${Date.now() - 6 * 60 * 60 * 1000}005`,
            memberId: `member_${currentStore.id}_5`,
            items: [
              {
                id: `item_${currentStore.id}_5_1`,
                productId: `prod_${currentStore.id}_3`,
                quantity: 24,
                unitPrice: 3.50,
                totalPrice: 84.00
              },
              {
                id: `item_${currentStore.id}_5_2`,
                productId: `prod_${currentStore.id}_6`,
                quantity: 1,
                unitPrice: 299.00,
                totalPrice: 299.00
              }
            ],
            subtotal: 383.00,
            discount: 12.00,
            tax: 0.00,
            total: 371.00,
            paymentMethod: 'member_balance' as const,
            status: 'completed' as const,
            staffId: 'staff_001',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `order_${currentStore.id}_6`,
            orderNumber: `ORD${Date.now() - 2 * 60 * 60 * 1000}006`,
            memberId: `member_${currentStore.id}_2`,
            items: [
              {
                id: `item_${currentStore.id}_6_1`,
                productId: `prod_${currentStore.id}_5`,
                quantity: 1,
                unitPrice: 1280.00,
                totalPrice: 1280.00
              }
            ],
            subtotal: 1280.00,
            discount: 80.00,
            tax: 0.00,
            total: 1200.00,
            paymentMethod: 'cash' as const,
            status: 'completed' as const,
            staffId: 'staff_002',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `order_${currentStore.id}_7`,
            orderNumber: `ORD${Date.now() - 30 * 60 * 1000}007`,
            memberId: undefined,
            items: [
              {
                id: `item_${currentStore.id}_7_1`,
                productId: `prod_${currentStore.id}_3`,
                quantity: 6,
                unitPrice: 3.50,
                totalPrice: 21.00
              }
            ],
            subtotal: 21.00,
            discount: 0.00,
            tax: 0.00,
            total: 21.00,
            paymentMethod: 'cash' as const,
            status: 'completed' as const,
            staffId: 'staff_001',
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
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