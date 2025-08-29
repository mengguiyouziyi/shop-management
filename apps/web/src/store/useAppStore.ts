import { create } from 'zustand';
import { Product, Member, Order } from '../types';
import { StorageService } from '../services/storage';
import { Store } from '../types/store';
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
      }
    }
  }
}));