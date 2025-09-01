import * as React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { HeadquartersBranchService } from '../../services/headquartersBranch';
import { StoreService } from '../../services/store';
import type { Store } from '../../types/store';

interface HeadquartersBranchSettings {
  id: string;
  headquartersId: string;
  syncProducts: boolean;
  syncMembers: boolean;
  syncSuppliers: boolean;
  syncPricing: boolean;
  syncInventory: boolean;
  allowCrossStoreOrders: boolean;
  createdAt: string;
  updatedAt: string;
}

const HeadquartersBranchPage: React.FC = () => {
  const { currentStore } = useAppStore();
  const [childStores, setChildStores] = React.useState<Store[]>([]);
  const [allStores, setAllStores] = React.useState<Store[]>([]);
  const [settings, setSettings] = React.useState<HeadquartersBranchSettings>({
    id: '',
    headquartersId: '',
    syncProducts: false,
    syncMembers: false,
    syncSuppliers: false,
    syncPricing: false,
    syncInventory: false,
    allowCrossStoreOrders: false,
    createdAt: '',
    updatedAt: ''
  });
  const [loading, setLoading] = React.useState(true);
  const [syncing, setSyncing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');

  const headquartersBranchService = HeadquartersBranchService.getInstance();
  const storeService = StoreService.getInstance();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 先获取所有店铺
        const allStoresData = await storeService.getAllStores();
        setAllStores(allStoresData);
        
        // 如果有当前店铺，获取相关数据
        if (currentStore) {
          const [childStoresData, settingsData] = await Promise.all([
            headquartersBranchService.getChildStores(currentStore.id),
            headquartersBranchService.getHeadquartersBranchSettings(currentStore.id)
          ]);
          
          setChildStores(childStoresData);
          setSettings(settingsData);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentStore]);

  const handleSyncData = async () => {
    if (!currentStore) return;
    
    try {
      setSyncing(true);
      await headquartersBranchService.syncDataToBranches(currentStore.id);
      alert('数据同步成功');
    } catch (error) {
      alert('数据同步失败');
    } finally {
      setSyncing(false);
    }
  };

  const handleSettingsChange = async (field: keyof HeadquartersBranchSettings, value: boolean) => {
    try {
      const updatedSettings = await headquartersBranchService.updateHeadquartersBranchSettings(
        currentStore.id,
        { ...settings, [field]: value }
      );
      setSettings(updatedSettings);
      alert('设置已更新');
    } catch (error) {
      alert('更新设置失败');
    }
  };

  // 模拟统计数据
  const stats = {
    totalBranches: childStores.length,
    activeBranches: childStores.filter(s => s.isActive).length,
    totalSyncProducts: settings.syncProducts ? childStores.length : 0,
    totalSyncMembers: settings.syncMembers ? childStores.length : 0,
    totalSyncInventory: settings.syncInventory ? childStores.length : 0,
    lastSyncTime: new Date().toLocaleString()
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#666', fontSize: '16px' }}>加载中...</p>
        </div>
      </div>
    );
  }

  if (!currentStore) {
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
                🏢 总部-分店管理
              </h1>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                管理总部与分店之间的数据同步和业务协作
              </p>
            </div>
          </div>
        </div>

        {/* 选择总部店铺 */}
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏪</div>
          <h2 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '20px' }}>请选择一个总部店铺</h2>
          <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>
            需要先选择一个总部店铺才能管理总部-分店设置
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {allStores.filter(store => store.level === 0).map(store => (
              <div 
                key={store.id} 
                style={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e8e8e8',
                  borderRadius: '8px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderTop: '4px solid #1890ff'
                }}
                onClick={() => {
                  storeService.setCurrentStore(store);
                  window.location.reload();
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{ margin: '0 0 12px 0', color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>
                  {store.name}
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                  <strong>编码:</strong> {store.code}
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                  <strong>地址:</strong> {store.address}
                </p>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  <strong>经理:</strong> {store.manager}
                </p>
              </div>
            ))}
          </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
              🏢 总部-分店管理
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              当前总部: {currentStore.name} | 管理分店数据同步和协作
            </p>
          </div>
          <button
            onClick={handleSyncData}
            disabled={syncing}
            style={{
              backgroundColor: syncing ? '#d9d9d9' : '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: syncing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!syncing) {
                e.currentTarget.style.backgroundColor = '#40a9ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!syncing) {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }
            }}
          >
            {syncing ? '⏳ 同步中...' : '🔄 同步数据'}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>分店总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.totalBranches}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>活跃分店</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.activeBranches}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>产品同步</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.totalSyncProducts}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>会员同步</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.totalSyncMembers}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>👥</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #13c2c2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>库存同步</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.totalSyncInventory}
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
          borderTop: '4px solid #eb2f96'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>最后同步</p>
              <p style={{ margin: '0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                {stats.lastSyncTime}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>⏰</div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '24px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: activeTab === 'overview' ? '#1890ff' : '#666',
              borderBottom: activeTab === 'overview' ? '2px solid #1890ff' : 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'overview') {
                e.currentTarget.style.color = '#1890ff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'overview') {
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            📊 概览
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: activeTab === 'settings' ? '#1890ff' : '#666',
              borderBottom: activeTab === 'settings' ? '2px solid #1890ff' : 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'settings') {
                e.currentTarget.style.color = '#1890ff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'settings') {
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            ⚙️ 设置
          </button>
        </div>

        {activeTab === 'overview' && (
          <div>
            {/* 总部信息 */}
            <div style={{ 
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
                🏢 总部信息
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                    <strong>店铺名称:</strong> {currentStore.name}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                    <strong>店铺编码:</strong> {currentStore.code}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                    <strong>地址:</strong> {currentStore.address}
                  </p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                    <strong>联系电话:</strong> {currentStore.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* 分店列表 */}
            <div>
              <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
                🏪 分店列表
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {childStores.map(store => (
                  <div 
                    key={store.id} 
                    style={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e8e8e8',
                      borderRadius: '8px',
                      padding: '16px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                          {store.name}
                        </h4>
                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                          编码: {store.code} | 地址: {store.address}
                        </p>
                        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                          电话: {store.phone} | 负责人: {store.manager}
                        </p>
                      </div>
                      <div style={{ 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: store.isActive ? '#f6ffed' : '#fff2f0',
                        color: store.isActive ? '#52c41a' : '#ff4d4f'
                      }}>
                        {store.isActive ? '启用' : '停用'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              ⚙️ 总部-分店管理设置
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ 
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e8e8e8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                      📦 产品同步
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      同步产品信息到分店
                    </p>
                  </div>
                  <label style={{ 
                    position: 'relative',
                    display: 'inline-block',
                    width: '50px',
                    height: '24px'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={settings.syncProducts}
                      onChange={(e) => handleSettingsChange('syncProducts', e.target.checked)}
                      style={{ 
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.syncProducts ? '#1890ff' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '24px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%',
                        transform: settings.syncProducts ? 'translateX(26px)' : 'translateX(0)'
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e8e8e8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                      📊 库存共享
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      共享库存信息到分店
                    </p>
                  </div>
                  <label style={{ 
                    position: 'relative',
                    display: 'inline-block',
                    width: '50px',
                    height: '24px'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={settings.syncInventory}
                      onChange={(e) => handleSettingsChange('syncInventory', e.target.checked)}
                      style={{ 
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.syncInventory ? '#52c41a' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '24px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%',
                        transform: settings.syncInventory ? 'translateX(26px)' : 'translateX(0)'
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e8e8e8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                      💰 价格统一
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      统一各分店价格
                    </p>
                  </div>
                  <label style={{ 
                    position: 'relative',
                    display: 'inline-block',
                    width: '50px',
                    height: '24px'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={settings.syncPricing}
                      onChange={(e) => handleSettingsChange('syncPricing', e.target.checked)}
                      style={{ 
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.syncPricing ? '#722ed1' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '24px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%',
                        transform: settings.syncPricing ? 'translateX(26px)' : 'translateX(0)'
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e8e8e8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                      👥 会员通用
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      会员信息在各分店通用
                    </p>
                  </div>
                  <label style={{ 
                    position: 'relative',
                    display: 'inline-block',
                    width: '50px',
                    height: '24px'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={settings.syncMembers}
                      onChange={(e) => handleSettingsChange('syncMembers', e.target.checked)}
                      style={{ 
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.syncMembers ? '#fa8c16' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '24px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%',
                        transform: settings.syncMembers ? 'translateX(26px)' : 'translateX(0)'
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e8e8e8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                      🛒 跨店订单
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      允许跨店订单处理
                    </p>
                  </div>
                  <label style={{ 
                    position: 'relative',
                    display: 'inline-block',
                    width: '50px',
                    height: '24px'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={settings.allowCrossStoreOrders}
                      onChange={(e) => handleSettingsChange('allowCrossStoreOrders', e.target.checked)}
                      style={{ 
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.allowCrossStoreOrders ? '#13c2c2' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '24px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%',
                        transform: settings.allowCrossStoreOrders ? 'translateX(26px)' : 'translateX(0)'
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadquartersBranchPage;