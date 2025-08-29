import { create } from 'zustand';
import { Product, Member, Order } from '../types';
import { StorageService } from '../services/storage';

interface AppState {
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
  initializeStore: () => void;
}

const storageService = StorageService.getInstance();

const defaultState = {
  products: [],
  members: [],
  orders: []
};

export const useAppStore = create<AppState>((set, get) => ({
  ...defaultState,
  
  addProduct: (product) => {
    const newProduct = { ...product, id: `prod_${Date.now()}` };
    set((state) => {
      const newState = { ...state, products: [...state.products, newProduct] };
      storageService.set('app_state', newState);
      return newState;
    });
  },
  
  updateProduct: (id, product) => {
    set((state) => {
      const newState = {
        ...state,
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...product } : p
        )
      };
      storageService.set('app_state', newState);
      return newState;
    });
  },
  
  deleteProduct: (id) => {
    set((state) => {
      const newState = {
        ...state,
        products: state.products.filter((p) => p.id !== id)
      };
      storageService.set('app_state', newState);
      return newState;
    });
  },
  
  addMember: (member) => {
    const newMember = { ...member, id: `member_${Date.now()}` };
    set((state) => {
      const newState = { ...state, members: [...state.members, newMember] };
      storageService.set('app_state', newState);
      return newState;
    });
  },
  
  updateMember: (id, member) => {
    set((state) => {
      const newState = {
        ...state,
        members: state.members.map((m) =>
          m.id === id ? { ...m, ...member } : m
        )
      };
      storageService.set('app_state', newState);
      return newState;
    });
  },
  
  deleteMember: (id) => {
    set((state) => {
      const newState = {
        ...state,
        members: state.members.filter((m) => m.id !== id)
      };
      storageService.set('app_state', newState);
      return newState;
    });
  },
  
  addOrder: (order) => {
    const newOrder = { ...order, id: `order_${Date.now()}`, createdAt: new Date().toISOString() };
    set((state) => {
      const newState = { ...state, orders: [...state.orders, newOrder] };
      storageService.set('app_state', newState);
      return newState;
    });
  },
  
  initializeStore: () => {
    const savedState = storageService.get<any>('app_state');
    if (savedState) {
      set({
        products: savedState.products || [],
        members: savedState.members || [],
        orders: savedState.orders || []
      });
    }
  }
}));
