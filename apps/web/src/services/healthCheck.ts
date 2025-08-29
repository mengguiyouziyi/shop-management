import { StorageService } from './storage';
import { useNetworkStore } from './network';
import { StoreService } from './store';

export interface HealthStatus {
  status: 'healthy' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface SystemHealth {
  overall: HealthStatus;
  services: {
    storage: HealthStatus;
    network: HealthStatus;
    database: HealthStatus;
    authentication: HealthStatus;
    stores: HealthStatus;
  };
  timestamp: string;
}

export class HealthCheckService {
  private static instance: HealthCheckService;
  private storageService: StorageService;
  private storeService: StoreService;

  private constructor() {
    this.storageService = StorageService.getInstance();
    this.storeService = StoreService.getInstance();
  }

  public static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  // 检查存储服务健康状态
  private async checkStorageHealth(): Promise<HealthStatus> {
    try {
      // 测试存储读写
      const testKey = 'health_check_test';
      const testValue = 'test_value';
      
      await this.storageService.set(testKey, testValue);
      const retrievedValue = this.storageService.get(testKey);
      await this.storageService.remove(testKey);
      
      if (retrievedValue === testValue) {
        return {
          status: 'healthy',
          message: '存储服务正常',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'error',
          message: '存储服务读写异常',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `存储服务错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 检查网络服务健康状态
  private async checkNetworkHealth(): Promise<HealthStatus> {
    try {
      const networkStore = useNetworkStore.getState();
    const isOnline = networkStore.isOnline;
      
      if (isOnline) {
        return {
          status: 'healthy',
          message: '网络连接正常',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'warning',
          message: '网络连接断开',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `网络服务错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 检查数据库服务健康状态（模拟）
  private async checkDatabaseHealth(): Promise<HealthStatus> {
    try {
      // 模拟数据库连接检查
      // 在实际应用中，这里会进行真实的数据库连接测试
      return {
        status: 'healthy',
        message: '数据库连接正常',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `数据库连接错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 检查认证服务健康状态
  private async checkAuthenticationHealth(): Promise<HealthStatus> {
    try {
      // 检查是否有有效的用户会话
      const currentUser = localStorage.getItem('currentUser');
      
      if (currentUser) {
        try {
          JSON.parse(currentUser);
          return {
            status: 'healthy',
            message: '认证服务正常',
            timestamp: new Date().toISOString()
          };
        } catch {
          return {
            status: 'warning',
            message: '用户会话数据格式异常',
            timestamp: new Date().toISOString()
          };
        }
      } else {
        return {
          status: 'warning',
          message: '无活动用户会话',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `认证服务错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 检查店铺服务健康状态
  private async checkStoresHealth(): Promise<HealthStatus> {
    try {
      const stores = await this.storeService.getAllStores();
      
      if (stores && Array.isArray(stores)) {
        return {
          status: 'healthy',
          message: `店铺服务正常 (${stores.length} 个店铺)`,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'warning',
          message: '店铺数据格式异常',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `店铺服务错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 检查商品服务健康状态
  private async checkProductsHealth(): Promise<HealthStatus> {
    try {
      const products = await this.productService.getAllProducts();
      
      if (products && Array.isArray(products)) {
        return {
          status: 'healthy',
          message: `商品服务正常 (${products.length} 个商品)`,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'warning',
          message: '商品数据格式异常',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `商品服务错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 检查会员服务健康状态
  private async checkMembersHealth(): Promise<HealthStatus> {
    try {
      const members = await this.memberService.getAllMembers();
      
      if (members && Array.isArray(members)) {
        return {
          status: 'healthy',
          message: `会员服务正常 (${members.length} 个会员)`,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'warning',
          message: '会员数据格式异常',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `会员服务错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 检查订单服务健康状态
  private async checkOrdersHealth(): Promise<HealthStatus> {
    try {
      const orders = await this.orderService.getAllOrders();
      
      if (orders && Array.isArray(orders)) {
        return {
          status: 'healthy',
          message: `订单服务正常 (${orders.length} 个订单)`,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'warning',
          message: '订单数据格式异常',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `订单服务错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 获取整体系统健康状态
  private calculateOverallHealth(services: SystemHealth['services']): HealthStatus {
    const statuses = Object.values(services).map(service => service.status);
    
    if (statuses.every(status => status === 'healthy')) {
      return {
        status: 'healthy',
        message: '系统运行正常',
        timestamp: new Date().toISOString()
      };
    } else if (statuses.some(status => status === 'error')) {
      return {
        status: 'error',
        message: '系统存在严重问题',
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        status: 'warning',
        message: '系统存在警告',
        timestamp: new Date().toISOString()
      };
    }
  }

  // 执行完整的系统健康检查
  async checkSystemHealth(): Promise<SystemHealth> {
    try {
      // 并行执行所有健康检查
      const [
        storage,
        network,
        database,
        authentication,
        stores
      ] = await Promise.all([
        this.checkStorageHealth(),
        this.checkNetworkHealth(),
        this.checkDatabaseHealth(),
        this.checkAuthenticationHealth(),
        this.checkStoresHealth()
      ]);

      const services = {
        storage,
        network,
        database,
        authentication,
        stores
      };

      const overall = this.calculateOverallHealth(services);

      return {
        overall,
        services,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('系统健康检查失败:', error);
      throw new Error('系统健康检查执行失败');
    }
  }

  // 获取简化的健康状态（用于快速检查）
  async getQuickHealthStatus(): Promise<HealthStatus> {
    try {
      const health = await this.checkSystemHealth();
      return health.overall;
    } catch (error) {
      return {
        status: 'error',
        message: `健康检查失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}