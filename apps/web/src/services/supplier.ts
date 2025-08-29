import { Supplier, SupplierCategory } from '../types/supplier';
import { StorageService } from './storage';

export class SupplierService {
  private static instance: SupplierService;
  private storageService: StorageService;

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): SupplierService {
    if (!SupplierService.instance) {
      SupplierService.instance = new SupplierService();
    }
    return SupplierService.instance;
  }

  // 获取所有供应商
  async getAllSuppliers(): Promise<Supplier[]> {
    const suppliers = this.storageService.get<Supplier[]>('suppliers');
    return suppliers || [];
  }

  // 根据ID获取供应商
  async getSupplierById(id: string): Promise<Supplier | null> {
    const suppliers = await this.getAllSuppliers();
    return suppliers.find(supplier => supplier.id === id) || null;
  }

  // 创建新供应商
  async createSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    const suppliers = await this.getAllSuppliers();
    const newSupplier: Supplier = {
      ...supplierData,
      id: `supplier_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    suppliers.push(newSupplier);
    this.storageService.set('suppliers', suppliers);
    return newSupplier;
  }

  // 更新供应商信息
  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<void> {
    const suppliers = await this.getAllSuppliers();
    const index = suppliers.findIndex(supplier => supplier.id === id);
    
    if (index === -1) {
      throw new Error('供应商不存在');
    }
    
    suppliers[index] = {
      ...suppliers[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.storageService.set('suppliers', suppliers);
  }

  // 删除供应商
  async deleteSupplier(id: string): Promise<void> {
    const suppliers = await this.getAllSuppliers();
    const filteredSuppliers = suppliers.filter(supplier => supplier.id !== id);
    this.storageService.set('suppliers', filteredSuppliers);
  }

  // 获取所有供应商分类
  async getAllCategories(): Promise<SupplierCategory[]> {
    const categories = this.storageService.get<SupplierCategory[]>('supplier_categories');
    return categories || [];
  }

  // 创建供应商分类
  async createCategory(categoryData: Omit<SupplierCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplierCategory> {
    const categories = await this.getAllCategories();
    const newCategory: SupplierCategory = {
      ...categoryData,
      id: `category_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    categories.push(newCategory);
    this.storageService.set('supplier_categories', categories);
    return newCategory;
  }

  // 更新供应商分类
  async updateCategory(id: string, updates: Partial<SupplierCategory>): Promise<void> {
    const categories = await this.getAllCategories();
    const index = categories.findIndex(category => category.id === id);
    
    if (index === -1) {
      throw new Error('供应商分类不存在');
    }
    
    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.storageService.set('supplier_categories', categories);
  }

  // 删除供应商分类
  async deleteCategory(id: string): Promise<void> {
    const categories = await this.getAllCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    this.storageService.set('supplier_categories', filteredCategories);
  }
}