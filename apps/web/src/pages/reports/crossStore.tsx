import React, { useState, useEffect } from 'react';

interface CrossStoreSalesReport {
  storeId: string;
  storeName: string;
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}

interface CrossStoreInventoryReport {
  storeId: string;
  storeName: string;
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
}

interface AggregatedSalesReport {
  date: string;
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  storeCount: number;
}

export default function CrossStoreReportPage() {
  const [salesReports, setSalesReports] = useState<CrossStoreSalesReport[]>([]);
  const [inventoryReports, setInventoryReports] = useState<CrossStoreInventoryReport[]>([]);
  const [aggregatedSalesData, setAggregatedSalesData] = useState<AggregatedSalesReport[]>([]);
  const [productRanking, setProductRanking] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState('aggregated');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 默认显示最近30天的数据
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadData();
    }
  }, [startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 模拟数据加载
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟销售数据
      const mockSalesData: CrossStoreSalesReport[] = [
        {
          storeId: '1',
          storeName: '示例总部',
          totalSales: 156800,
          totalOrders: 342,
          avgOrderValue: 458.48,
          topProducts: [
            { productId: '1', productName: '苹果iPhone 15', quantity: 45, revenue: 67500 },
            { productId: '2', productName: '华为Mate 60', quantity: 32, revenue: 44800 },
            { productId: '3', productName: '小米14', quantity: 28, revenue: 22400 }
          ]
        },
        {
          storeId: '2', 
          storeName: '分店A',
          totalSales: 98500,
          totalOrders: 215,
          avgOrderValue: 458.14,
          topProducts: [
            { productId: '1', productName: '苹果iPhone 15', quantity: 28, revenue: 42000 },
            { productId: '4', productName: 'MacBook Air', quantity: 12, revenue: 19200 },
            { productId: '5', productName: 'iPad Pro', quantity: 18, revenue: 21600 }
          ]
        }
      ];

      // 模拟库存数据
      const mockInventoryData: CrossStoreInventoryReport[] = [
        {
          storeId: '1',
          storeName: '示例总部',
          totalProducts: 156,
          totalValue: 892000,
          lowStockItems: 12,
          outOfStockItems: 3
        },
        {
          storeId: '2',
          storeName: '分店A', 
          totalProducts: 98,
          totalValue: 456000,
          lowStockItems: 8,
          outOfStockItems: 2
        }
      ];

      // 模拟聚合销售数据
      const mockAggregatedData: AggregatedSalesReport[] = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        mockAggregatedData.unshift({
          date: date.toISOString().split('T')[0],
          totalSales: Math.floor(Math.random() * 50000) + 30000,
          totalOrders: Math.floor(Math.random() * 100) + 50,
          avgOrderValue: Math.floor(Math.random() * 200) + 400,
          storeCount: 2
        });
      }

      // 模拟产品排名
      const mockProductRanking = [
        { productId: '1', productName: '苹果iPhone 15', totalQuantity: 73, totalRevenue: 109500, storeCount: 2 },
        { productId: '2', productName: '华为Mate 60', totalQuantity: 32, totalRevenue: 44800, storeCount: 1 },
        { productId: '4', productName: 'MacBook Air', totalQuantity: 12, totalRevenue: 19200, storeCount: 1 },
        { productId: '5', productName: 'iPad Pro', totalQuantity: 18, totalRevenue: 21600, storeCount: 1 },
        { productId: '3', productName: '小米14', totalQuantity: 28, totalRevenue: 22400, storeCount: 1 }
      ];

      setSalesReports(mockSalesData);
      setInventoryReports(mockInventoryData);
      setAggregatedSalesData(mockAggregatedData);
      setProductRanking(mockProductRanking);
    } catch (error) {
      console.error('加载跨店铺报表数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 计算统计数据
  const totalSales = salesReports.reduce((sum, report) => sum + report.totalSales, 0);
  const totalOrders = salesReports.reduce((sum, report) => sum + report.totalOrders, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const totalStores = salesReports.length;

  const totalInventoryValue = inventoryReports.reduce((sum, report) => sum + report.totalValue, 0);
  const totalProducts = inventoryReports.reduce((sum, report) => sum + report.totalProducts, 0);
  const totalLowStock = inventoryReports.reduce((sum, report) => sum + report.lowStockItems, 0);
  const totalOutOfStock = inventoryReports.reduce((sum, report) => sum + report.outOfStockItems, 0);

  const getRankBadge = (index: number) => {
    if (index === 0) return { color: '#FFD700', text: '🥇' };
    if (index === 1) return { color: '#C0C0C0', text: '🥈' };
    if (index === 2) return { color: '#CD7F32', text: '🥉' };
    return { color: '#8c8c8c', text: `${index + 1}` };
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
              🔄 跨店铺报表
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              跨店铺销售数据和库存分析
            </p>
          </div>
          
          {/* 日期选择和刷新 */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
              onClick={loadData}
              disabled={loading}
              style={{
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {loading ? '⏳' : '🔄'} 刷新数据
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px'
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
                  ¥{totalSales.toLocaleString()}
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
                  {totalOrders.toLocaleString()}
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>平均订单价值</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  ¥{avgOrderValue.toFixed(2)}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>📊</div>
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>参与店铺数</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {totalStores}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>🏪</div>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 标签导航 */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #f0f0f0', marginBottom: '24px' }}>
          {[
            { key: 'aggregated', label: '聚合销售' },
            { key: 'store', label: '店铺对比' },
            { key: 'inventory', label: '库存分析' },
            { key: 'ranking', label: '产品排名' }
          ].map(tab => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 24px',
                cursor: 'pointer',
                borderBottom: activeTab === tab.key ? '3px solid #1890ff' : '3px solid transparent',
                color: activeTab === tab.key ? '#1890ff' : '#666',
                fontWeight: activeTab === tab.key ? '600' : '400',
                transition: 'all 0.3s',
                backgroundColor: activeTab === tab.key ? '#f0f9ff' : 'transparent',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  (e.target as HTMLDivElement).style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  (e.target as HTMLDivElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* 标签内容 */}
        {activeTab === 'aggregated' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              📈 聚合销售趋势
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>日期</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>总销售额</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>总订单数</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>平均订单价值</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>参与店铺数</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedSalesData.slice(-10).map((data, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px', color: '#666' }}>{data.date}</td>
                      <td style={{ padding: '12px', color: '#333', fontWeight: 'bold' }}>¥{data.totalSales.toLocaleString()}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{data.totalOrders}</td>
                      <td style={{ padding: '12px', color: '#666' }}>¥{data.avgOrderValue.toFixed(2)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          backgroundColor: '#1890ff20', 
                          color: '#1890ff', 
                          padding: '2px 8px', 
                          borderRadius: '10px', 
                          fontSize: '12px', 
                          fontWeight: 'bold' 
                        }}>
                          {data.storeCount} 家
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              🏪 店铺销售对比
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>店铺名称</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>总销售额</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>总订单数</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>平均订单价值</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>热销产品</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReports.map((report, index) => (
                    <tr key={report.storeId} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>🏪</span>
                          <strong>{report.storeName}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontWeight: 'bold' }}>¥{report.totalSales.toLocaleString()}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{report.totalOrders}</td>
                      <td style={{ padding: '12px', color: '#666' }}>¥{report.avgOrderValue.toFixed(2)}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {report.topProducts[0]?.productName} ({report.topProducts[0]?.quantity})
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              📦 库存分析
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>店铺名称</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>产品总数</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>库存总值</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>库存不足</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>缺货商品</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryReports.map((report, index) => (
                    <tr key={report.storeId} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>🏪</span>
                          <strong>{report.storeName}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>{report.totalProducts}</td>
                      <td style={{ padding: '12px', color: '#333', fontWeight: 'bold' }}>¥{report.totalValue.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          backgroundColor: '#fa8c1620', 
                          color: '#fa8c16', 
                          padding: '2px 8px', 
                          borderRadius: '10px', 
                          fontSize: '12px', 
                          fontWeight: 'bold' 
                        }}>
                          {report.lowStockItems}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          backgroundColor: '#ff4d4f20', 
                          color: '#ff4d4f', 
                          padding: '2px 8px', 
                          borderRadius: '10px', 
                          fontSize: '12px', 
                          fontWeight: 'bold' 
                        }}>
                          {report.outOfStockItems}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              🏆 跨店铺产品排名
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>排名</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>产品名称</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>总销量</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>总销售额</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold', color: '#333' }}>销售店铺数</th>
                  </tr>
                </thead>
                <tbody>
                  {productRanking.map((product, index) => {
                    const badge = getRankBadge(index);
                    return (
                      <tr key={product.productId} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            backgroundColor: badge.color, 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '12px', 
                            fontWeight: 'bold' 
                          }}>
                            {badge.text}
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '16px' }}>📦</span>
                            <strong>{product.productName}</strong>
                          </div>
                        </td>
                        <td style={{ padding: '12px', color: '#666' }}>{product.totalQuantity}</td>
                        <td style={{ padding: '12px', color: '#333', fontWeight: 'bold' }}>¥{product.totalRevenue.toLocaleString()}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            backgroundColor: '#1890ff20', 
                            color: '#1890ff', 
                            padding: '2px 8px', 
                            borderRadius: '10px', 
                            fontSize: '12px', 
                            fontWeight: 'bold' 
                          }}>
                            {product.storeCount} 家
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}