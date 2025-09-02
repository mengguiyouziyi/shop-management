import React, { useState, useEffect } from 'react';
import { StoreService } from '../../services/store';
import type { Store } from '../../types/store';
import { useAppStore } from '../../store/useAppStore';

export default function StoreHierarchyPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentStore } = useAppStore();
  const storeService = StoreService.getInstance();

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const storeList = await storeService.getAllStores();
      setStores(storeList);
    } catch (error) {
      console.error('加载店铺列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 构建店铺层级树
  const buildStoreTree = () => {
    // 找到所有总部（level 0）
    const headquarters = stores.filter(store => store.level === 0);
    
    // 递归构建子店铺
    const buildChildren = (parentStore: Store) => {
      const children = stores.filter(store => store.parentId === parentStore.id);
      return children.map(child => ({
        ...child,
        children: buildChildren(child)
      }));
    };
    
    return headquarters.map(hq => ({
      ...hq,
      children: buildChildren(hq)
    }));
  };

  // 渲染店铺层级结构
  const renderStoreHierarchy = (stores: any[], level = 0) => {
    return stores.map(store => (
      <div key={store.id} style={{ marginLeft: `${level * 24}px`, marginBottom: '12px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '16px',
          backgroundColor: level === 0 ? '#f0f9ff' : '#fafafa',
          borderRadius: '8px',
          border: level === 0 ? '2px solid #e0f2fe' : '1px solid #e8e8e8',
          transition: 'all 0.3s',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          {/* 层级连接线 */}
          {level > 0 && (
            <div style={{
              position: 'absolute',
              left: '-24px',
              top: '50%',
              width: '24px',
              height: '1px',
              backgroundColor: '#e8e8e8'
            }} />
          )}
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                fontSize: '20px',
                filter: store.isActive ? 'none' : 'grayscale(100%)'
              }}>
                {level === 0 ? '🏢' : '🏪'}
              </span>
              <div>
                <span style={{ 
                  fontWeight: level === 0 ? 'bold' : '600',
                  fontSize: level === 0 ? '16px' : '14px',
                  color: store.isActive ? '#333' : '#999'
                }}>
                  {store.name}
                </span>
                {store.code && (
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '12px', 
                    color: '#666',
                    backgroundColor: '#f5f5f5',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {store.code}
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <span style={{ 
                fontSize: '12px', 
                backgroundColor: level === 0 ? '#dbeafe' : '#fef3c7',
                color: level === 0 ? '#1e40af' : '#d97706',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: '500'
              }}>
                {level === 0 ? '🏛️ 总部' : `🏘️ 分店 L${store.level}`}
              </span>
              
              {store.isActive ? (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#52c41a',
                  backgroundColor: '#f6ffed',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '500'
                }}>
                  ✅ 启用
                </span>
              ) : (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#ff4d4f',
                  backgroundColor: '#fff2f0',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '500'
                }}>
                  ❌ 停用
                </span>
              )}
              
              {store.manager && (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  👤 {store.manager}
                </span>
              )}
              
              {store.phone && (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  📞 {store.phone}
                </span>
              )}
            </div>
            
            {store.address && (
              <div style={{ 
                marginTop: '6px', 
                fontSize: '12px', 
                color: '#999',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                📍 {store.address}
              </div>
            )}
          </div>
          
          {currentStore?.id === store.id && (
            <div style={{
              backgroundColor: '#1890ff',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              当前店铺
            </div>
          )}
        </div>
        
        {store.children && store.children.length > 0 && (
          <div style={{ 
            marginTop: '8px',
            position: 'relative'
          }}>
            {/* 垂直连接线 */}
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '0',
              bottom: '0',
              width: '1px',
              backgroundColor: '#e8e8e8'
            }} />
            {renderStoreHierarchy(store.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const treeData = buildStoreTree();
  
  // 统计数据
  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.isActive).length;
  const headquarters = stores.filter(s => s.level === 0).length;
  const branches = stores.filter(s => s.level > 0).length;

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
              🏗️ 店铺层级结构
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              查看店铺组织架构和层级关系
            </p>
          </div>
          <button
            onClick={loadStores}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#d9d9d9' : '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#40a9ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }
            }}
          >
            {loading ? '⏳ 加载中...' : '🔄 刷新数据'}
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总店铺数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalStores}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🏪</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>营业中</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {activeStores}
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
          borderTop: '4px solid #722ed1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总部</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {headquarters}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🏢</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>分店</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {branches}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🏘️</div>
          </div>
        </div>
      </div>

      {/* 组织架构图 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
            🏗️ 组织架构图
          </h2>
        </div>
        
        {treeData.length > 0 ? (
          <div style={{ 
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            padding: '24px',
            border: '1px solid #e8e8e8'
          }}>
            {renderStoreHierarchy(treeData)}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏗️</div>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>暂无店铺数据</p>
            <p style={{ fontSize: '14px' }}>请先创建店铺以查看层级结构</p>
          </div>
        )}
      </div>
    </div>
  );
}