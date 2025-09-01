import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ReportingService, InventoryReportData } from '../../services/reporting';

export default function InventoryReportPage() {
  const { products } = useAppStore();
  const [inventoryData, setInventoryData] = useState<InventoryReportData[]>([]);
  const [filteredData, setFilteredData] = useState<InventoryReportData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const reportingService = ReportingService.getInstance();

  useEffect(() => {
    loadInventoryData();
  }, [products]);

  useEffect(() => {
    filterData();
  }, [searchTerm, statusFilter, inventoryData]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      // 获取库存报表数据
      const inventoryReport = reportingService.getInventoryReportData(products);
      setInventoryData(inventoryReport);
    } catch (error) {
      console.error('生成库存报表数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate mock data if no inventory data exists
    if (inventoryData.length === 0) {
      generateMockInventoryData();
    }
  }, [inventoryData]);

  const generateMockInventoryData = () => {
    const mockData: InventoryReportData[] = [
      {
        productId: '1',
        productName: 'iPhone 15 Pro',
        currentStock: 45,
        reservedStock: 5,
        availableStock: 40,
        minStockLevel: 10,
        maxStockLevel: 100,
        status: 'normal',
        totalValue: 40455.00,
        location: 'A-01-01',
        lastUpdated: new Date().toISOString()
      },
      {
        productId: '2',
        productName: 'AirPods Pro',
        currentStock: 120,
        reservedStock: 15,
        availableStock: 105,
        minStockLevel: 20,
        maxStockLevel: 200,
        status: 'normal',
        totalValue: 21480.00,
        location: 'B-02-03',
        lastUpdated: new Date().toISOString()
      },
      {
        productId: '3',
        productName: 'MacBook Pro 14"',
        currentStock: 8,
        reservedStock: 2,
        availableStock: 6,
        minStockLevel: 5,
        maxStockLevel: 30,
        status: 'low',
        totalValue: 13600.00,
        location: 'C-01-02',
        lastUpdated: new Date().toISOString()
      },
      {
        productId: '4',
        productName: 'iPad Air',
        currentStock: 25,
        reservedStock: 3,
        availableStock: 22,
        minStockLevel: 10,
        maxStockLevel: 50,
        status: 'normal',
        totalValue: 10000.00,
        location: 'D-03-01',
        lastUpdated: new Date().toISOString()
      },
      {
        productId: '5',
        productName: 'Apple Watch Series 9',
        currentStock: 35,
        reservedStock: 8,
        availableStock: 27,
        minStockLevel: 15,
        maxStockLevel: 80,
        status: 'normal',
        totalValue: 8745.00,
        location: 'E-02-02',
        lastUpdated: new Date().toISOString()
      },
      {
        productId: '6',
        productName: 'USB-C 充电线',
        currentStock: 200,
        reservedStock: 30,
        availableStock: 170,
        minStockLevel: 50,
        maxStockLevel: 500,
        status: 'normal',
        totalValue: 2000.00,
        location: 'F-01-05',
        lastUpdated: new Date().toISOString()
      },
      {
        productId: '7',
        productName: 'Magic Mouse',
        currentStock: 2,
        reservedStock: 1,
        availableStock: 1,
        minStockLevel: 10,
        maxStockLevel: 50,
        status: 'out',
        totalValue: 158.00,
        location: 'G-01-01',
        lastUpdated: new Date().toISOString()
      },
      {
        productId: '8',
        productName: 'Lightning Cable',
        currentStock: 350,
        reservedStock: 45,
        availableStock: 305,
        minStockLevel: 100,
        maxStockLevel: 300,
        status: 'over',
        totalValue: 3500.00,
        location: 'H-02-02',
        lastUpdated: new Date().toISOString()
      }
    ];

    setInventoryData(mockData);
  };

  const filterData = () => {
    let filtered = [...inventoryData];

    // 根据搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.productName.toLowerCase().includes(term)
      );
    }

    // 根据状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'out': return '缺货';
      case 'low': return '低库存';
      case 'over': return '超储';
      case 'normal': return '正常';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out': return '#ff4d4f';
      case 'low': return '#fa8c16';
      case 'over': return '#1890ff';
      case 'normal': return '#52c41a';
      default: return '#666';
    }
  };

  const getHealthPercentage = (item: InventoryReportData) => {
    const range = item.maxStockLevel - item.minStockLevel;
    const current = item.availableStock - item.minStockLevel;
    return Math.max(0, Math.min(100, (current / range) * 100));
  };

  // 统计数据
  const totalProducts = inventoryData.length;
  const totalValue = inventoryData.reduce((sum, item) => sum + item.totalValue, 0);
  const totalStock = inventoryData.reduce((sum, item) => sum + item.currentStock, 0);
  const totalAvailable = inventoryData.reduce((sum, item) => sum + item.availableStock, 0);
  const outOfStockProducts = inventoryData.filter(item => item.status === 'out').length;
  const lowStockProducts = inventoryData.filter(item => item.status === 'low').length;
  const overStockProducts = inventoryData.filter(item => item.status === 'over').length;
  const normalStockProducts = inventoryData.filter(item => item.status === 'normal').length;

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
          marginBottom: '20px'
        }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
              📊 库存报表
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              详细的库存数据分析和健康状况报告
            </p>
          </div>
          <button
            onClick={loadInventoryData}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#40a9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1890ff';
            }}
          >
            <span>🔄</span>
            <span>刷新数据</span>
          </button>
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>商品种类</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {totalProducts}
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
            borderTop: '4px solid #52c41a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总库存价值</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  ¥{totalValue.toLocaleString()}
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
            borderTop: '4px solid #722ed1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>可用库存</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {totalAvailable}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>✅</div>
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>预警商品</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {outOfStockProducts + lowStockProducts}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>⚠️</div>
            </div>
          </div>
        </div>

        {/* 状态分布 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          marginTop: '20px'
        }}>
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>正常库存</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {normalStockProducts}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>✅</div>
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>低库存</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {lowStockProducts}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>⚠️</div>
            </div>
          </div>

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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>超储</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {overStockProducts}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>📈</div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderTop: '4px solid #ff4d4f'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>缺货</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {outOfStockProducts}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>❌</div>
            </div>
          </div>
        </div>
      </div>

      {/* 库存报表数据 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: '0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
            库存详细数据
          </h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              <option value="all">全部状态</option>
              <option value="normal">正常</option>
              <option value="low">低库存</option>
              <option value="over">超储</option>
              <option value="out">缺货</option>
            </select>
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '300px',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #1890ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p style={{ color: '#666', marginTop: '16px' }}>加载中...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    商品名称
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    当前库存
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    预留库存
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    可用库存
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    库存范围
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    健康度
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    总价值
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    状态
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => {
                  const healthPercentage = getHealthPercentage(item);
                  const statusColor = getStatusColor(item.status);
                  const statusText = getStatusText(item.status);
                  
                  return (
                    <tr key={item.productId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{item.productName}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            位置: {item.location}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <div style={{ fontWeight: 'bold' }}>{item.currentStock}</div>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        {item.reservedStock}
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <span style={{ 
                          fontWeight: 'bold',
                          color: item.availableStock <= 0 ? '#ff4d4f' : '#333'
                        }}>
                          {item.availableStock}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <div style={{ fontSize: '12px' }}>
                          <div>最低: {item.minStockLevel}</div>
                          <div>最高: {item.maxStockLevel}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '60px', 
                            height: '8px', 
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${healthPercentage}%`,
                              height: '100%',
                              backgroundColor: healthPercentage > 70 ? '#52c41a' : healthPercentage > 30 ? '#fa8c16' : '#ff4d4f',
                              borderRadius: '4px'
                            }}></div>
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                            {healthPercentage.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <div style={{ fontWeight: 'bold' }}>
                          ¥{item.totalValue.toLocaleString()}
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <span style={{ 
                          backgroundColor: statusColor + '20',
                          color: statusColor,
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}