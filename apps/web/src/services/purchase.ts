import { PurchaseOrder, PurchaseOrderItem } from '../types/purchase';
import { StorageService } from './storage';

export class PurchaseService {
  private static instance: PurchaseService;
  private storageService: StorageService;

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): PurchaseService {
    if (!PurchaseService.instance) {
      PurchaseService.instance = new PurchaseService();
    }
    return PurchaseService.instance;
  }

  // 获取所有采购订单
  async getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    const orders = this.storageService.get<PurchaseOrder[]>('purchase_orders');
    return orders || [];
  }

  // 根据ID获取采购订单
  async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    const orders = await this.getAllPurchaseOrders();
    return orders.find(order => order.id === id) || null;
  }

  // 创建采购订单
  async createPurchaseOrder(orderData: Omit<PurchaseOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'items'>): Promise<PurchaseOrder> {
    const orders = await this.getAllPurchaseOrders();
    const newOrder: PurchaseOrder = {
      ...orderData,
      id: `po_${Date.now()}`,
      orderNumber: `PO${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${orders.length + 1}`,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    this.storageService.set('purchase_orders', orders);
    return newOrder;
  }

  // 更新采购订单
  async updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): Promise<void> {
    const orders = await this.getAllPurchaseOrders();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) {
      throw new Error('采购订单不存在');
    }
    
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.storageService.set('purchase_orders', orders);
  }

  // 删除采购订单
  async deletePurchaseOrder(id: string): Promise<void> {
    const orders = await this.getAllPurchaseOrders();
    const filteredOrders = orders.filter(order => order.id !== id);
    this.storageService.set('purchase_orders', filteredOrders);
  }

  // 添加采购项到订单
  async addOrderItem(orderId: string, item: Omit<PurchaseOrderItem, 'id'>): Promise<PurchaseOrderItem> {
    const order = await this.getPurchaseOrderById(orderId);
    if (!order) {
      throw new Error('采购订单不存在');
    }

    const newItem: PurchaseOrderItem = {
      ...item,
      id: `poi_${Date.now()}`,
    };

    order.items.push(newItem);
    order.totalAmount = order.items.reduce((total, item) => total + item.totalPrice, 0);
    order.updatedAt = new Date().toISOString();
    
    await this.updatePurchaseOrder(orderId, order);
    return newItem;
  }

  // 更新采购项
  async updateOrderItem(orderId: string, itemId: string, updates: Partial<PurchaseOrderItem>): Promise<void> {
    const order = await this.getPurchaseOrderById(orderId);
    if (!order) {
      throw new Error('采购订单不存在');
    }

    const itemIndex = order.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('采购项不存在');
    }

    order.items[itemIndex] = {
      ...order.items[itemIndex],
      ...updates
    };

    // 重新计算总价
    order.items[itemIndex].totalPrice = order.items[itemIndex].quantity * order.items[itemIndex].unitPrice;
    order.totalAmount = order.items.reduce((total, item) => total + item.totalPrice, 0);
    order.updatedAt = new Date().toISOString();
    
    await this.updatePurchaseOrder(orderId, order);
  }

  // 删除采购项
  async deleteOrderItem(orderId: string, itemId: string): Promise<void> {
    const order = await this.getPurchaseOrderById(orderId);
    if (!order) {
      throw new Error('采购订单不存在');
    }

    order.items = order.items.filter(item => item.id !== itemId);
    order.totalAmount = order.items.reduce((total, item) => total + item.totalPrice, 0);
    order.updatedAt = new Date().toISOString();
    
    await this.updatePurchaseOrder(orderId, order);
  }
}