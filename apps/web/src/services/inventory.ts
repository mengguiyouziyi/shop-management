import { InventoryItem, StockMovement } from '../types/inventory';
import { StorageService } from './storage';

export class InventoryService {
  private static instance: InventoryService;
  private storageService: StorageService;

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  // 获取所有库存项
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    const items = this.storageService.get<InventoryItem[]>('inventory_items');
    return items || [];
  }

  // 根据商品ID获取库存项
  async getInventoryItemByProductId(productId: string): Promise<InventoryItem | null> {
    const items = await this.getAllInventoryItems();
    return items.find(item => item.productId === productId) || null;
  }

  // 创建库存项
  async createInventoryItem(itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const items = await this.getAllInventoryItems();
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv_${Date.now()}`,
      availableQuantity: itemData.quantity - itemData.reservedQuantity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    items.push(newItem);
    this.storageService.set('inventory_items', items);
    return newItem;
  }

  // 更新库存项
  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<void> {
    const items = await this.getAllInventoryItems();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error('库存项不存在');
    }
    
    items[index] = {
      ...items[index],
      ...updates,
      availableQuantity: (updates.quantity ?? items[index].quantity) - (updates.reservedQuantity ?? items[index].reservedQuantity),
      updatedAt: new Date().toISOString()
    };
    
    this.storageService.set('inventory_items', items);
  }

  // 删除库存项
  async deleteInventoryItem(id: string): Promise<void> {
    const items = await this.getAllInventoryItems();
    const filteredItems = items.filter(item => item.id !== id);
    this.storageService.set('inventory_items', filteredItems);
  }

  // 获取库存流水记录
  async getAllStockMovements(): Promise<StockMovement[]> {
    const movements = this.storageService.get<StockMovement[]>('stock_movements');
    return movements || [];
  }

  // 记录库存流水
  async recordStockMovement(movement: Omit<StockMovement, 'id' | 'createdAt'>): Promise<StockMovement> {
    const movements = await this.getAllStockMovements();
    const newMovement: StockMovement = {
      ...movement,
      id: `sm_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    movements.push(newMovement);
    this.storageService.set('stock_movements', movements);
    
    // 更新库存
    await this.updateInventoryForMovement(movement);
    
    return newMovement;
  }

  // 根据库存流水更新库存
  private async updateInventoryForMovement(movement: Omit<StockMovement, 'id' | 'createdAt'>): Promise<void> {
    const item = await this.getInventoryItemByProductId(movement.productId);
    if (!item) {
      throw new Error('库存项不存在');
    }

    let newQuantity = item.quantity;
    if (movement.type === 'in') {
      newQuantity += movement.quantity;
    } else if (movement.type === 'out') {
      newQuantity -= movement.quantity;
    } else if (movement.type === 'adjustment') {
      newQuantity = movement.quantity; // 调整为指定数量
    }

    await this.updateInventoryItem(item.id, {
      quantity: newQuantity,
      availableQuantity: newQuantity - item.reservedQuantity,
      ...(movement.type === 'in' ? { lastRestockedAt: new Date().toISOString() } : {}),
      ...(movement.type === 'out' ? { lastSoldAt: new Date().toISOString() } : {})
    });
  }

  // 检查低库存预警
  async checkLowStockAlerts(): Promise<InventoryItem[]> {
    const items = await this.getAllInventoryItems();
    return items.filter(item => item.quantity <= item.minStockLevel);
  }
}