import { useState, useEffect } from 'react';
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
      console.error('加载销售数据失败:', error);
    }
  };

  // 计算汇总数据
  const totalSales = salesData.reduce((sum, day) => sum + day.totalSales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.totalOrders, 0);
  const totalItems = salesData.reduce((sum, day) => sum + day.totalItemsSold, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  if (!currentStore) {
    return (
      <div style={{ 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ margin: '0 0 8px 0', color: '#333' }}>请先选择一个店铺</h2>
          <p style={{ margin: '0', color: '#666' }}>
            请先在系统中选择一个店铺来查看销售报表
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 页面标题 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h1 style={{ margin: '0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
            📊 销售报表 - {currentStore.name}
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>开始日期:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>结束日期:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <button
            onClick={loadSalesData}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            刷新数据
          </button>
        </div>
      </div>

      {/* 汇总数据 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #1890ff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总销售额</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                ¥{(totalSales || 0).toFixed(2)}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>💰</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #52c41a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总订单数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalOrders}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>📋</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #722ed1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总商品数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalItems}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>📦</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #fa8c16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>平均订单价值</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                ¥{(avgOrderValue || 0).toFixed(2)}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>📈</div>
          </div>
        </div>
      </div>

      {/* 每日销售数据 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          📅 每日销售数据
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>日期</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>销售额</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>订单数</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>商品数</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>平均订单价值</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((data, index) => (
                <tr key={data.date} style={{ 
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                }}>
                  <td style={{ padding: '12px', color: '#666' }}>
                    {new Date(data.date).toLocaleDateString('zh-CN')}
                  </td>
                  <td style={{ padding: '12px', color: '#52c41a', fontWeight: 'bold' }}>
                    ¥{(data.totalSales || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>
                    {data.totalOrders}
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>
                    {data.totalItemsSold}
                  </td>
                  <td style={{ padding: '12px', color: '#1890ff', fontWeight: 'bold' }}>
                    ¥{(data.averageOrderValue || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {salesData.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#999'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <p>在选定的时间段内没有销售数据</p>
          </div>
        )}
      </div>

      {/* 热门商品排行 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          🔥 热门商品排行
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>排名</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>商品名称</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>销售数量</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>销售额</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={product.id} style={{ 
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                }}>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: index < 3 ? '#ffd700' : '#f0f0f0',
                      color: index < 3 ? '#333' : '#666',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      #{index + 1}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#333', fontWeight: '500' }}>
                    {product.name}
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>
                    {product.quantitySold}
                  </td>
                  <td style={{ padding: '12px', color: '#52c41a', fontWeight: 'bold' }}>
                    ¥{(product.revenue || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {topProducts.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#999'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
            <p>在选定的时间段内没有商品销售数据</p>
          </div>
        )}
      </div>
    </div>
  );
}
