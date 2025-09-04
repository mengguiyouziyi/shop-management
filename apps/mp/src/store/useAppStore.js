import { useState, useEffect } from 'react';

// 初始化示例数据
const initialProducts = [
  {
    id: '1',
    name: '苹果iPhone 15',
    category: '手机',
    price: 5999,
    stock: 25,
    minStock: 5,
    image: '📱',
  },
  {
    id: '2',
    name: '小米手机',
    category: '手机',
    price: 1499,
    stock: 42,
    minStock: 10,
    image: '📱',
  },
  { id: '3', name: '华为平板', category: '平板', price: 999, stock: 18, minStock: 5, image: '📟' },
  { id: '4', name: 'AirPods', category: '配件', price: 299, stock: 67, minStock: 15, image: '🎧' },
  {
    id: '5',
    name: '无线充电器',
    category: '配件',
    price: 89,
    stock: 34,
    minStock: 10,
    image: '🔋',
  },
];

const initialMembers = [
  {
    id: '1',
    name: '张三',
    phone: '13800138000',
    points: 1200,
    level: 3,
    balance: 500,
    totalSpent: 5000,
  },
  {
    id: '2',
    name: '李四',
    phone: '13800138001',
    points: 800,
    level: 2,
    balance: 200,
    totalSpent: 2000,
  },
  {
    id: '3',
    name: '王五',
    phone: '13800138002',
    points: 300,
    level: 1,
    balance: 100,
    totalSpent: 800,
  },
];

const initialOrders = [
  { id: '1001', customer: '张三', amount: 299, status: 'completed', date: '2023/05/01 10:30' },
  { id: '1002', customer: '李四', amount: 199, status: 'pending', date: '2023/05/02 14:15' },
  { id: '1003', customer: '王五', amount: 399, status: 'cancelled', date: '2023/05/03 09:45' },
  { id: '1004', customer: '赵六', amount: 599, status: 'shipped', date: '2023/05/04 16:20' },
];

// 创建全局状态管理
class AppStore {
  constructor() {
    this.state = {
      products: initialProducts,
      members: initialMembers,
      orders: initialOrders,
    };
    this.listeners = [];
  }

  // 订阅状态变化
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 通知所有订阅者状态变化
  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // 获取当前状态
  getState() {
    return this.state;
  }

  // 商品相关操作
  addProduct(product) {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    this.state.products = [...this.state.products, newProduct];
    this.notify();
  }

  updateProduct(id, updatedProduct) {
    this.state.products = this.state.products.map((product) =>
      product.id === id ? { ...product, ...updatedProduct } : product
    );
    this.notify();
  }

  deleteProduct(id) {
    this.state.products = this.state.products.filter((product) => product.id !== id);
    this.notify();
  }

  // 会员相关操作
  addMember(member) {
    const newMember = {
      ...member,
      id: Date.now().toString(),
    };
    this.state.members = [...this.state.members, newMember];
    this.notify();
  }

  updateMember(id, updatedMember) {
    this.state.members = this.state.members.map((member) =>
      member.id === id ? { ...member, ...updatedMember } : member
    );
    this.notify();
  }

  deleteMember(id) {
    this.state.members = this.state.members.filter((member) => member.id !== id);
    this.notify();
  }

  // 订单相关操作
  addOrder(order) {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
    };
    this.state.orders = [...this.state.orders, newOrder];
    this.notify();
  }

  updateOrder(id, updatedOrder) {
    this.state.orders = this.state.orders.map((order) =>
      order.id === id ? { ...order, ...updatedOrder } : order
    );
    this.notify();
  }
}

// 创建全局store实例
const appStore = new AppStore();

// React Hook封装
export const useAppStore = () => {
  const [state, setState] = useState(appStore.getState());

  useEffect(() => {
    const unsubscribe = appStore.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    addProduct: (product) => appStore.addProduct(product),
    updateProduct: (id, product) => appStore.updateProduct(id, product),
    deleteProduct: (id) => appStore.deleteProduct(id),
    addMember: (member) => appStore.addMember(member),
    updateMember: (id, member) => appStore.updateMember(id, member),
    deleteMember: (id) => appStore.deleteMember(id),
    addOrder: (order) => appStore.addOrder(order),
    updateOrder: (id, order) => appStore.updateOrder(id, order),
  };
};

export default appStore;
