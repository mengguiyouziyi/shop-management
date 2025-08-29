import { StorageService } from './storage';
import { useAppStore } from '../store/useAppStore';

export class SyncService {
  private static instance: SyncService;
  private storageService: StorageService;
  private syncInterval: number | null = null;

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  // 模拟与服务器同步数据
  async syncWithServer(): Promise<void> {
    try {
      // 获取本地数据
      const localState = this.storageService.get<any>('app_state');
      
      if (!localState) {
        return;
      }

      // 在实际应用中，这里会发送数据到服务器
      // 模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('数据同步完成', localState);
      
      // 如果需要从服务器获取数据，可以在这里更新本地存储
      // this.storageService.set('app_state', serverData);
    } catch (error) {
      console.error('数据同步失败:', error);
    }
  }

  // 启动定期同步
  startAutoSync(interval: number = 30000): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = window.setInterval(() => {
      this.syncWithServer();
    }, interval);
  }

  // 停止定期同步
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // 手动触发同步
  async manualSync(): Promise<void> {
    await this.syncWithServer();
  }
}