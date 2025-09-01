import React, { useState, useEffect } from 'react';
import { InventoryService } from '../../services/inventory';
import { InventoryItem } from '../../types/inventory';

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockAction, setStockAction] = useState<'in' | 'out'>('in');
  const [stockQuantity, setStockQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const inventoryService = InventoryService.getInstance();

  useEffect(() => {
    loadInventoryItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, inventoryItems]);

  useEffect(() => {
    // Generate mock data if no inventory items exist
    if (inventoryItems.length === 0) {
      generateMockInventory();
    }
  }, [inventoryItems]);

  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      const items = await inventoryService.getAllInventoryItems();
      setInventoryItems(items);
    } catch (error) {
      console.error('加载库存数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockInventory = () => {
    const mockItems: InventoryItem[] = [
      {
        id: '1',
        productId: '1',
        productName: 'iPhone 15 Pro',
        sku: 'IP15P-256-BLK',
        quantity: 45,
        reservedQuantity: 5,
        minStockLevel: 10,
        maxStockLevel: 100,
        unit: '台',
        location: 'A-01-01',
        lastUpdated: new Date().toISOString(),
        notes: '高端智能手机'
      },
      {
        id: '2',
        productId: '2',
        productName: 'AirPods Pro',
        sku: 'APP-3RD-GEN',
        quantity: 120,
        reservedQuantity: 15,
        minStockLevel: 20,
        maxStockLevel: 200,
        unit: '个',
        location: 'B-02-03',
        lastUpdated: new Date().toISOString(),
        notes: '无线降噪耳机'
      },
      {
        id: '3',
        productId: '3',
        productName: 'MacBook Pro 14"',
        sku: 'MBP14-16GB-512GB',
        quantity: 8,
        reservedQuantity: 2,
        minStockLevel: 5,
        maxStockLevel: 30,
        unit: '台',
        location: 'C-01-02',
        lastUpdated: new Date().toISOString(),
        notes: '专业笔记本电脑'
      },
      {
        id: '4',
        productId: '4',
        productName: 'iPad Air',
        sku: 'IPA-64GB-WIFI',
        quantity: 25,
        reservedQuantity: 3,
        minStockLevel: 10,
        maxStockLevel: 50,
        unit: '台',
        location: 'D-03-01',
        lastUpdated: new Date().toISOString(),
        notes: '轻薄平板电脑'
      },
      {
        id: '5',
        productId: '5',
        productName: 'Apple Watch Series 9',
        sku: 'AW9-45MM-GPS',
        quantity: 35,
        reservedQuantity: 8,
        minStockLevel: 15,
        maxStockLevel: 80,
        unit: '块',
        location: 'E-02-02',
        lastUpdated: new Date().toISOString(),
        notes: '智能手表'
      },
      {
        id: '6',
        productId: '6',
        productName: 'USB-C 充电线',
        sku: 'USBC-1M-CERT',
        quantity: 200,
        reservedQuantity: 30,
        minStockLevel: 50,
        maxStockLevel: 500,
        unit: '根',
        location: 'F-01-05',
        lastUpdated: new Date().toISOString(),
        notes: '原装充电线'
      }
    ];

    setInventoryItems(mockItems);
  };

  const filterItems = () => {
    if (!searchTerm) {
      setFilteredItems(inventoryItems);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = inventoryItems.filter(item => 
      item.productName.toLowerCase().includes(term) || 
      (item.sku && item.sku.toLowerCase().includes(term))
    );
    
    setFilteredItems(filtered);
  };

  const handleStockMovement = (item: InventoryItem, action: 'in' | 'out') => {
    setSelectedItem(item);
    setStockAction(action);
    setStockQuantity(action === 'in' ? 10 : 5);
    setShowStockModal(true);
  };

  const confirmStockMovement = () => {
    if (!selectedItem || stockQuantity <= 0) return;

    try {
      const updatedItems = inventoryItems.map(item => {
        if (item.id === selectedItem.id) {
          const newQuantity = stockAction === 'in' 
            ? item.quantity + stockQuantity 
            : Math.max(0, item.quantity - stockQuantity);
          
          return {
            ...item,
            quantity: newQuantity,
            lastUpdated: new Date().toISOString()
          };
        }
        return item;
      });

      setInventoryItems(updatedItems);
      setShowStockModal(false);
      setSelectedItem(null);
      
      alert(`${stockAction === 'in' ? '入库' : '出库'}操作成功`);
    } catch (error) {
      alert(`${stockAction === 'in' ? '入库' : '出库'}操作失败`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个库存记录吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      setInventoryItems(inventoryItems.filter(item => item.id !== id));
    } catch (error) {
      alert('库存记录删除失败');
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    const availableQuantity = item.quantity - item.reservedQuantity;
    
    if (availableQuantity <= 0) return { color: '#ff4d4f', text: '缺货', status: 'out' };
    if (availableQuantity < item.minStockLevel) return { color: '#fa8c16', text: '库存不足', status: 'low' };
    if (item.quantity > item.maxStockLevel) return { color: '#1890ff', text: '超储', status: 'over' };
    return { color: '#52c41a', text: '正常', status: 'normal' };
  };

  // 统计数据
  const totalProducts = inventoryItems.length;
  const totalStock = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalReserved = inventoryItems.reduce((sum, item) => sum + item.reservedQuantity, 0);
  const totalAvailable = totalStock - totalReserved;
  const lowStockItems = inventoryItems.filter(item => {
    const available = item.quantity - item.reservedQuantity;
    return available < item.minStockLevel;
  }).length;
  const outOfStockItems = inventoryItems.filter(item => {
    const available = item.quantity - item.reservedQuantity;
    return available <= 0;
  }).length;

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
              📦 库存管理
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              实时监控和管理您的商品库存
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleStockMovement({} as InventoryItem, 'in')}
              style={{
                backgroundColor: '#52c41a',
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
                e.currentTarget.style.backgroundColor = '#73d13d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#52c41a';
              }}
            >
              <span>📥</span>
              <span>批量入库</span>
            </button>
            <button
              onClick={() => handleStockMovement({} as InventoryItem, 'out')}
              style={{
                backgroundColor: '#ff4d4f',
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
                e.currentTarget.style.backgroundColor = '#ff7875';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ff4d4f';
              }}
            >
              <span>📤</span>
              <span>批量出库</span>
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总库存</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {totalStock}
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>库存预警</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {lowStockItems + outOfStockItems}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>⚠️</div>
            </div>
          </div>
        </div>
      </div>

      {/* 库存列表 */}
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
            库存列表
          </h2>
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
                    SKU
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    当前库存
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    预留数量
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    可用数量
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    库存状态
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    位置
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const availableQuantity = item.quantity - item.reservedQuantity;
                  
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{item.productName}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{item.unit}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        {item.sku}
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                          {item.quantity > item.maxStockLevel && (
                            <span style={{ 
                              backgroundColor: '#ff4d4f20',
                              color: '#ff4d4f',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              超储
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        {item.reservedQuantity}
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <span style={{ 
                          fontWeight: 'bold',
                          color: availableQuantity <= 0 ? '#ff4d4f' : '#333'
                        }}>
                          {availableQuantity}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <span style={{ 
                          backgroundColor: stockStatus.color + '20',
                          color: stockStatus.color,
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        {item.location}
                      </td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleStockMovement(item, 'in')}
                            style={{
                              backgroundColor: '#52c41a',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#73d13d';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#52c41a';
                            }}
                          >
                            入库
                          </button>
                          <button
                            onClick={() => handleStockMovement(item, 'out')}
                            style={{
                              backgroundColor: '#fa8c16',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffc53d';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#fa8c16';
                            }}
                          >
                            出库
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              backgroundColor: '#ff4d4f',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#ff7875';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ff4d4f';
                            }}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 库存操作模态框 */}
      {showStockModal && selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '24px',
            width: '400px',
            maxWidth: '90vw',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              {stockAction === 'in' ? '商品入库' : '商品出库'}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                商品名称: <strong>{selectedItem.productName}</strong>
              </p>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                当前库存: <strong>{selectedItem.quantity}</strong>
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                {stockAction === 'in' ? '入库数量' : '出库数量'}
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                min="1"
                max={stockAction === 'out' ? selectedItem.quantity : undefined}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowStockModal(false)}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: '1px solid #d9d9d9',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e8e8e8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
              >
                取消
              </button>
              <button
                onClick={confirmStockMovement}
                style={{
                  backgroundColor: stockAction === 'in' ? '#52c41a' : '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = stockAction === 'in' ? '#73d13d' : '#ff7875';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = stockAction === 'in' ? '#52c41a' : '#ff4d4f';
                }}
              >
                确认{stockAction === 'in' ? '入库' : '出库'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}