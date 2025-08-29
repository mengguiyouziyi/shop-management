import { useAppStore } from '../store/useAppStore';
import { Order } from '../types';
import { Product } from '../types';
import { Member } from '../types';

export interface SalesReportData {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
}

export interface ProductSalesRanking {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface InventoryReportData {
  productId: string;
  productName: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minStockLevel: number;
  maxStockLevel?: number;
  status: 'normal' | 'low' | 'out' | 'over';
}

export interface MemberReportData {
  date: string;
  newMembers: number;
  activeMembers: number;
  totalMembers: number;
}

export class ReportingService {
  private static instance: ReportingService;

  private constructor() {}

  static getInstance(): ReportingService {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  // 获取销售报表数据
  getSalesReportData(orders: Order[], startDate: Date, endDate: Date): SalesReportData[] {
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // 按日期分组
    const dailyData: Record<string, SalesReportData> = {};

    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          totalSales: 0,
          totalOrders: 0,
          totalItemsSold: 0
        };
      }

      dailyData[date].totalSales += order.totalAmount;
      dailyData[date].totalOrders += 1;
      
      order.items.forEach(item => {
        dailyData[date].totalItemsSold += item.quantity;
      });
    });

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  }

  // 获取商品销售排行
  getProductSalesRanking(orders: Order[], products: Product[]): ProductSalesRanking[] {
    const productSales: Record<string, ProductSalesRanking> = {};

    // 初始化所有商品
    products.forEach(product => {
      productSales[product.id] = {
        productId: product.id,
        productName: product.name,
        quantitySold: 0,
        totalRevenue: 0
      };
    });

    // 统计销售数据
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.productId]) {
          productSales[item.productId].quantitySold += item.quantity;
          productSales[item.productId].totalRevenue += item.quantity * item.price;
        }
      });
    });

    // 转换为数组并排序
    return Object.values(productSales)
      .filter(item => item.quantitySold > 0)
      .sort((a, b) => b.quantitySold - a.quantitySold);
  }

  // 获取库存报表数据
  getInventoryReportData(products: Product[]): InventoryReportData[] {
    return products.map(product => {
      let status: 'normal' | 'low' | 'out' | 'over' = 'normal';
      
      if (product.stock === 0) {
        status = 'out';
      } else if (product.stock <= 5) { // 假设5为最低库存预警线
        status = 'low';
      } else if (product.stock > 100) { // 假设100为最高库存预警线
        status = 'over';
      }

      return {
        productId: product.id,
        productName: product.name,
        currentStock: product.stock,
        reservedStock: 0, // 简化处理，实际应用中需要考虑预留库存
        availableStock: product.stock,
        minStockLevel: 5,
        maxStockLevel: 100,
        status
      };
    });
  }

  // 获取会员报表数据
  getMemberReportData(members: Member[], orders: Order[]): MemberReportData[] {
    // 按注册日期分组统计新会员
    const membersByDate: Record<string, number> = {};
    
    members.forEach(member => {
      const date = new Date(member.createdAt).toISOString().split('T')[0];
      membersByDate[date] = (membersByDate[date] || 0) + 1;
    });

    // 按订单日期统计活跃会员
    const activeMembersByDate: Record<string, Set<string>> = {};
    
    orders.forEach(order => {
      if (order.memberId) {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        if (!activeMembersByDate[date]) {
          activeMembersByDate[date] = new Set();
        }
        activeMembersByDate[date].add(order.memberId);
      }
    });

    // 合并数据
    const allDates = new Set([
      ...Object.keys(membersByDate),
      ...Object.keys(activeMembersByDate)
    ]);

    const reportData: MemberReportData[] = Array.from(allDates).map(date => ({
      date,
      newMembers: membersByDate[date] || 0,
      activeMembers: activeMembersByDate[date] ? activeMembersByDate[date].size : 0,
      totalMembers: members.filter(m => new Date(m.createdAt) <= new Date(date)).length
    }));

    return reportData.sort((a, b) => a.date.localeCompare(b.date));
  }

  // 获取销售汇总数据
  getSalesSummary(orders: Order[]): { 
    totalSales: number; 
    totalOrders: number; 
    averageOrderValue: number;
    totalItemsSold: number;
  } {
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalItemsSold = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      totalItemsSold
    };
  }
}