import { create } from 'zustand';

interface NetworkState {
  isOnline: boolean;
  offlineOperations: any[];
  setIsOnline: (isOnline: boolean) => void;
  addOfflineOperation: (operation: any) => void;
  clearOfflineOperations: () => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: navigator.onLine,
  offlineOperations: [],
  
  setIsOnline: (isOnline) => set({ isOnline }),
  
  addOfflineOperation: (operation) => set((state) => ({
    offlineOperations: [...state.offlineOperations, { ...operation, timestamp: Date.now() }]
  })),
  
  clearOfflineOperations: () => set({ offlineOperations: [] })
}));

export class NetworkService {
  private static instance: NetworkService;
  private networkStore = useNetworkStore;

  private constructor() {
    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.networkStore.getState().setIsOnline(true);
    });

    window.addEventListener('offline', () => {
      this.networkStore.getState().setIsOnline(false);
    });
  }

  static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  isOnline(): boolean {
    return this.networkStore.getState().isOnline;
  }

  addOfflineOperation(operation: any): void {
    if (!this.isOnline()) {
      this.networkStore.getState().addOfflineOperation(operation);
    }
  }

  getOfflineOperations(): any[] {
    return this.networkStore.getState().offlineOperations;
  }

  clearOfflineOperations(): void {
    this.networkStore.getState().clearOfflineOperations();
  }

  // 模拟同步离线操作
  async syncOfflineOperations(): Promise<void> {
    if (!this.isOnline()) {
      throw new Error('Cannot sync while offline');
    }

    const operations = this.getOfflineOperations();
    if (operations.length === 0) {
      return;
    }

    // 模拟同步过程
    for (const operation of operations) {
      try {
        // 在实际应用中，这里会发送请求到服务器
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Synced operation:', operation);
      } catch (error) {
        console.error('Failed to sync operation:', operation, error);
      }
    }

    this.clearOfflineOperations();
  }
}