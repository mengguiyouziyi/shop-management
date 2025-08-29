export class StorageService {
  private static instance: StorageService;
  private storageKeyPrefix = 'shop_manager_';

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  set(key: string, data: any): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.storageKeyPrefix + key, serializedData);
    } catch (error) {
      console.error('存储数据时出错:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const serializedData = localStorage.getItem(this.storageKeyPrefix + key);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error('获取数据时出错:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.storageKeyPrefix + key);
    } catch (error) {
      console.error('删除数据时出错:', error);
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.storageKeyPrefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('清空数据时出错:', error);
    }
  }
}