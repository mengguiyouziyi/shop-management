import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  Product, 
  Member, 
  Order, 
  Store, 
  Staff,
  MemberLevel,
  PaymentMethod,
  OrderStatus 
} from '../types';

// 应用状态接口
interface AppState {
  // 数据状态
  products: Product[];
  members: Member[];
  orders: Order[];
  stores: Store[];
  staff: Staff[];
  currentStore: Store | null;
  currentStaff: Staff | null;
  
  // UI状态
  isLoading: boolean;
  error: string | null;
  
  // POS状态
  currentOrder: Order | null;
  suspendedOrders: Order[];
  
  // 操作方法
  // 产品管理
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // 会员管理
  addMember: (member: Omit<Member, 'id' | 'joinDate' | 'lastVisit'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  // 订单管理
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => void;
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  
  // POS操作
  setCurrentOrder: (order: Order | null) => void;
  addToOrder: (productId: string, quantity: number) => void;
  updateOrderItem: (itemId: string, quantity: number) => void;
  removeFromOrder: (itemId: string) => void;
  suspendOrder: () => void;
  resumeOrder: (orderId: string) => void;
  completeOrder: (paymentMethod: PaymentMethod) => void;
  
  // 工具方法
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// 生成订单号
const generateOrderNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${dateStr}${random}`;
};

// 创建状态store（暂时移除persist功能）
export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
        // 初始状态
        products: [],
        members: [],
        orders: [],
        stores: [],
        staff: [],
        currentStore: null,
        currentStaff: null,
        isLoading: false,
        error: null,
        currentOrder: null,
        suspendedOrders: [],

        // 产品管理方法
        addProduct: (productData) => {
          const product: Product = {
            ...productData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            products: [...state.products, product],
          }));
        },

        updateProduct: (id, updates) => {
          set((state) => ({
            products: state.products.map((product) =>
              product.id === id
                ? { ...product, ...updates, updatedAt: new Date().toISOString() }
                : product
            ),
          }));
        },

        deleteProduct: (id) => {
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
          }));
        },

        // 会员管理方法
        addMember: (memberData) => {
          const member: Member = {
            ...memberData,
            id: crypto.randomUUID(),
            joinDate: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
          };
          set((state) => ({
            members: [...state.members, member],
          }));
        },

        updateMember: (id, updates) => {
          set((state) => ({
            members: state.members.map((member) =>
              member.id === id ? { ...member, ...updates } : member
            ),
          }));
        },

        deleteMember: (id) => {
          set((state) => ({
            members: state.members.filter((member) => member.id !== id),
          }));
        },

        // 订单管理方法
        createOrder: (orderData) => {
          const order: Order = {
            ...orderData,
            id: crypto.randomUUID(),
            orderNumber: generateOrderNumber(),
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            orders: [...state.orders, order],
          }));
        },

        updateOrder: (id, updates) => {
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === id ? { ...order, ...updates } : order
            ),
          }));
        },

        deleteOrder: (id) => {
          set((state) => ({
            orders: state.orders.filter((order) => order.id !== id),
          }));
        },

        addOrder: (orderData) => {
          const newOrder: Order = {
            ...orderData,
            id: crypto.randomUUID(),
            orderNumber: `ORD${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          
          set((state) => ({
            orders: [...state.orders, newOrder],
          }));
        },

        // POS操作方法
        setCurrentOrder: (order) => {
          set({ currentOrder: order });
        },

        addToOrder: (productId, quantity) => {
          const state = get();
          const product = state.products.find((p) => p.id === productId);
          
          if (!product) return;

          let currentOrder = state.currentOrder;
          
          // 如果没有当前订单，创建新订单
          if (!currentOrder) {
            currentOrder = {
              id: crypto.randomUUID(),
              orderNumber: generateOrderNumber(),
              items: [],
              subtotal: 0,
              discount: 0,
              tax: 0,
              total: 0,
              paymentMethod: PaymentMethod.CASH,
              status: OrderStatus.PENDING,
              staffId: state.currentStaff?.id || '',
              createdAt: new Date().toISOString(),
            };
          }

          // 检查是否已存在该商品
          const existingItemIndex = currentOrder.items.findIndex(
            (item) => item.productId === productId
          );

          let updatedItems;
          if (existingItemIndex >= 0) {
            // 更新现有商品数量
            updatedItems = currentOrder.items.map((item, index) =>
              index === existingItemIndex
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    totalPrice: (item.quantity + quantity) * item.unitPrice,
                  }
                : item
            );
          } else {
            // 添加新商品
            const newItem = {
              id: crypto.randomUUID(),
              productId,
              quantity,
              unitPrice: product.price,
              totalPrice: quantity * product.price,
            };
            updatedItems = [...currentOrder.items, newItem];
          }

          // 计算总价
          const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
          const total = subtotal - currentOrder.discount + currentOrder.tax;

          const updatedOrder = {
            ...currentOrder,
            items: updatedItems,
            subtotal,
            total,
          };

          set({ currentOrder: updatedOrder });
        },

        updateOrderItem: (itemId, quantity) => {
          const state = get();
          if (!state.currentOrder) return;

          const updatedItems = state.currentOrder.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  totalPrice: quantity * item.unitPrice,
                }
              : item
          );

          const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
          const total = subtotal - state.currentOrder.discount + state.currentOrder.tax;

          set({
            currentOrder: {
              ...state.currentOrder,
              items: updatedItems,
              subtotal,
              total,
            },
          });
        },

        removeFromOrder: (itemId) => {
          const state = get();
          if (!state.currentOrder) return;

          const updatedItems = state.currentOrder.items.filter((item) => item.id !== itemId);
          const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
          const total = subtotal - state.currentOrder.discount + state.currentOrder.tax;

          set({
            currentOrder: {
              ...state.currentOrder,
              items: updatedItems,
              subtotal,
              total,
            },
          });
        },

        suspendOrder: () => {
          const state = get();
          if (!state.currentOrder) return;

          set({
            suspendedOrders: [...state.suspendedOrders, state.currentOrder],
            currentOrder: null,
          });
        },

        resumeOrder: (orderId) => {
          const state = get();
          const order = state.suspendedOrders.find((o) => o.id === orderId);
          
          if (order) {
            set({
              currentOrder: order,
              suspendedOrders: state.suspendedOrders.filter((o) => o.id !== orderId),
            });
          }
        },

        completeOrder: (paymentMethod) => {
          const state = get();
          if (!state.currentOrder) return;

          const completedOrder = {
            ...state.currentOrder,
            paymentMethod,
            status: OrderStatus.COMPLETED,
            completedAt: new Date().toISOString(),
          };

          set((state) => ({
            orders: [...state.orders, completedOrder],
            currentOrder: null,
          }));
        },

        // 工具方法
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
      })
    )
);