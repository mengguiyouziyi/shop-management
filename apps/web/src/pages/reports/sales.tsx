import { useState, useEffect } from 'react';
import { Card, Table, DatePicker, MessagePlugin, Tag } from 'tdesign-react';
import { useAppStore } from '../../store/useAppStore';

interface SalesData {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
  averageOrderValue: number;
}

interface TopProduct {
  id: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export default function SalesReportPage() {
  const { currentStore, orders, products } = useAppStore();
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    // 默认显示最近7天的数据
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate && currentStore) {
      loadSalesData();
    }
  }, [startDate, endDate, currentStore, orders, products]);

  const loadSalesData = () => {
    try {
      // 过滤订单数据
      const filteredOrders = orders.filter(order => {
        if (!currentStore) return false;
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDate >= startDate && orderDate <= endDate;
      });

      // 按日期分组统计
      const dailySales: Record<string, SalesData> = {};
      
      filteredOrders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        
        if (!dailySales[date]) {
          dailySales[date] = {
            date,
            totalSales: 0,
            totalOrders: 0,
            totalItemsSold: 0,
            averageOrderValue: 0
          };
        }

        dailySales[date].totalSales += order.total;
        dailySales[date].totalOrders += 1;
        dailySales[date].totalItemsSold += order.items.reduce((sum, item) => sum + item.quantity, 0);
      });

      // 计算平均订单价值
      Object.keys(dailySales).forEach(date => {
        const data = dailySales[date];
        data.averageOrderValue = data.totalOrders > 0 ? data.totalSales / data.totalOrders : 0;
      });

      // 转换为数组并排序
      const salesArray = Object.values(dailySales).sort((a, b) => a.date.localeCompare(b.date));
      setSalesData(salesArray);

      // 统计热门商品
      const productSales: Record<string, TopProduct> = {};
      
      filteredOrders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            const product = products.find(p => p.id === item.productId);
            productSales[item.productId] = {
              id: item.productId,
              name: product?.name || '未知商品',
              quantitySold: 0,
              revenue: 0
            };
          }
          
          productSales[item.productId].quantitySold += item.quantity;
          productSales[item.productId].revenue += item.totalPrice;
        });
      });

      const topProductsArray = Object.values(productSales)
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 10);
      
      setTopProducts(topProductsArray);
    } catch (error) {
      MessagePlugin.error('加载销售数据失败');
    }
  };

  const salesColumns = [
    {
      title: '日期',
      colKey: 'date',
    },
    {
      title: '销售额',
      colKey: 'totalSales',
      render: ({ row }: { row: SalesData }) => (
        <span>¥{(row.totalSales || 0).toFixed(2)}</span>
      )
    },
    {
      title: '订单数',
      colKey: 'totalOrders',
    },
    {
      title: '商品数',
      colKey: 'totalItemsSold',
    },
    {
      title: '平均订单价值',
      colKey: 'averageOrderValue',
      render: ({ row }: { row: SalesData }) => (
        <span>¥{(row.averageOrderValue || 0).toFixed(2)}</span>
      )
    }
  ];

  const productColumns = [
    {
      title: '商品名称',
      colKey: 'name',
    },
    {
      title: '销售数量',
      colKey: 'quantitySold',
    },
    {
      title: '销售额',
      colKey: 'revenue',
      render: ({ row }: { row: TopProduct }) => (
        <span>¥{(row.revenue || 0).toFixed(2)}</span>
      )
    }
  ];

  // 计算汇总数据
  const totalSales = salesData.reduce((sum, day) => sum + day.totalSales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.totalOrders, 0);
  const totalItems = salesData.reduce((sum, day) => sum + day.totalItemsSold, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  if (!currentStore) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Tag theme="warning">请先选择一个店铺</Tag>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
          销售报表 - {currentStore.name}
        </h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <DatePicker 
            value={startDate}
            onChange={(value: string) => setStartDate(value)}
            placeholder="开始日期"
          />
          <DatePicker 
            value={endDate}
            onChange={(value: string) => setEndDate(value)}
            placeholder="结束日期"
          />
        </div>
      </div>

      {/* 汇总数据 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px',
        marginBottom: '20px'
      }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>总销售额</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
              ¥{(totalSales || 0).toFixed(2)}
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>总订单数</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
              {totalOrders}
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>总商品数</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
              {totalItems}
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>平均订单价值</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
              ¥{(avgOrderValue || 0).toFixed(2)}
            </div>
          </div>
        </Card>
      </div>

      {/* 销售数据表格 */}
      <Card title="每日销售数据" style={{ marginBottom: '20px' }}>
        <Table
          data={salesData}
          columns={salesColumns}
          rowKey="date"
          pagination={{ defaultPageSize: 10 }}
        />
      </Card>

      {/* 热门商品 */}
      <Card title="热门商品排行">
        <Table
          data={topProducts}
          columns={productColumns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </Card>
    </div>
  );
}
