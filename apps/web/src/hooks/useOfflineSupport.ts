import { useEffect, useState } from 'react';
import { useNetworkStore } from '../services/network';
import { IndexedDBService } from '../services/indexedDB';
import { useAppStore } from '../store/useAppStore';

export const useOfflineSupport = () => {
  const { isOnline, offlineOperations } = useNetworkStore();
  const [isDBReady, setIsDBReady] = useState(false);
  const { products, members, orders } = useAppStore();

  useEffect(() => {
    const initDB = async () => {
      try {
        const dbService = IndexedDBService.getInstance();
        await dbService.init();
        setIsDBReady(true);
        
        // 如果在线，同步数据到IndexedDB
        if (isOnline) {
          await syncDataToDB();
        }
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
      }
    };

    initDB();
  }, []);

  const syncDataToDB = async () => {
    if (!isDBReady) return;
    
    try {
      const dbService = IndexedDBService.getInstance();
      
      // 同步商品数据
      await dbService.clear('products');
      for (const product of products) {
        await dbService.add('products', product);
      }
      
      // 同步会员数据
      await dbService.clear('members');
      for (const member of members) {
        await dbService.add('members', member);
      }
      
      // 同步订单数据
      await dbService.clear('orders');
      for (const order of orders) {
        await dbService.add('orders', order);
      }
    } catch (error) {
      console.error('Failed to sync data to DB:', error);
    }
  };

  const getOfflineData = async (storeName: string) => {
    if (!isDBReady) return [];
    
    try {
      const dbService = IndexedDBService.getInstance();
      return await dbService.getAll(storeName);
    } catch (error) {
      console.error(`Failed to get offline data from ${storeName}:`, error);
      return [];
    }
  };

  // 监听在线状态变化，当恢复在线时同步数据
  useEffect(() => {
    if (isOnline && isDBReady) {
      syncDataToDB();
      
      // 同步离线操作
      const networkService = NetworkService.getInstance();
      networkService.syncOfflineOperations();
    }
  }, [isOnline, isDBReady]);

  return {
    isOnline,
    isDBReady,
    offlineOperations,
    getOfflineData,
    syncDataToDB
  };
};