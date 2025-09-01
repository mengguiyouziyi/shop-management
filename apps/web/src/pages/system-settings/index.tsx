import React, { useState, useEffect } from 'react';
import { SystemSettingsService, SystemSettings } from '../../services/systemSettings';

interface SystemSettingsData extends SystemSettings {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  defaultTaxRate?: number;
  printReceipt?: boolean;
  enableMemberPoints?: boolean;
  enableInventoryAlert?: boolean;
  enableOfflineMode?: boolean;
  receiptTitle?: string;
  receiptFooter?: string;
}

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsData>({
    companyName: '示例零售公司',
    companyAddress: '北京市朝阳区某某街道123号',
    companyPhone: '010-12345678',
    defaultTaxRate: 13,
    printReceipt: true,
    enableMemberPoints: true,
    enableInventoryAlert: true,
    enableOfflineMode: false,
    receiptTitle: '销售小票',
    receiptFooter: '谢谢惠顾，欢迎下次光临！'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const systemSettingsService = SystemSettingsService.getInstance();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await systemSettingsService.getSystemSettings();
      if (currentSettings) {
        setSettings(currentSettings);
      } else {
        // 保持默认设置
        setSettings({
          companyName: '示例零售公司',
          companyAddress: '北京市朝阳区某某街道123号',
          companyPhone: '010-12345678',
          defaultTaxRate: 13,
          printReceipt: true,
          enableMemberPoints: true,
          enableInventoryAlert: true,
          enableOfflineMode: false,
          receiptTitle: '销售小票',
          receiptFooter: '谢谢惠顾，欢迎下次光临！'
        });
      }
    } catch (error) {
      console.error('加载系统设置失败:', error);
      // 保持默认设置
      setSettings({
        companyName: '示例零售公司',
        companyAddress: '北京市朝阳区某某街道123号',
        companyPhone: '010-12345678',
        defaultTaxRate: 13,
        printReceipt: true,
        enableMemberPoints: true,
        enableInventoryAlert: true,
        enableOfflineMode: false,
        receiptTitle: '销售小票',
        receiptFooter: '谢谢惠顾，欢迎下次光临！'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SystemSettingsData, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    setSaving(true);
    try {
      await systemSettingsService.updateSystemSettings(settings);
      alert('系统设置已保存');
    } catch (error) {
      alert('保存系统设置失败');
    } finally {
      setSaving(false);
    }
  };

  // 模拟系统统计数据
  const systemStats = {
    totalUsers: 156,
    activeUsers: 142,
    totalStores: 12,
    systemUptime: '99.9%',
    lastBackup: new Date().toLocaleDateString(),
    databaseSize: '2.3 GB'
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
              ⚙️ 系统设置
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              配置系统参数、公司信息和其他设置选项
            </p>
          </div>
          <button
            onClick={onSubmit}
            disabled={saving}
            style={{
              backgroundColor: saving ? '#d9d9d9' : '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#40a9ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }
            }}
          >
            {saving ? '⏳ 保存中...' : '💾 保存设置'}
          </button>
        </div>
      </div>

      {/* 系统统计卡片 */}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总用户数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {systemStats.totalUsers}
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
          borderTop: '4px solid #52c41a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>活跃用户</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {systemStats.activeUsers}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>店铺总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {systemStats.totalStores}
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
          borderTop: '4px solid #fa8c16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>系统运行时间</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {systemStats.systemUptime}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>⏱️</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>最后备份</p>
              <p style={{ margin: '0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                {systemStats.lastBackup}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>💾</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>数据库大小</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {systemStats.databaseSize}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🗄️</div>
          </div>
        </div>
      </div>

      {/* 设置内容 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 标签页导航 */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '24px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <button
            onClick={() => setActiveTab('basic')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: activeTab === 'basic' ? '#1890ff' : '#666',
              borderBottom: activeTab === 'basic' ? '2px solid #1890ff' : 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'basic') {
                e.currentTarget.style.color = '#1890ff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'basic') {
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            🏢 基本信息
          </button>
          
          <button
            onClick={() => setActiveTab('business')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: activeTab === 'business' ? '#1890ff' : '#666',
              borderBottom: activeTab === 'business' ? '2px solid #1890ff' : 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'business') {
                e.currentTarget.style.color = '#1890ff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'business') {
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            💼 业务设置
          </button>
          
          <button
            onClick={() => setActiveTab('receipt')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: activeTab === 'receipt' ? '#1890ff' : '#666',
              borderBottom: activeTab === 'receipt' ? '2px solid #1890ff' : 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'receipt') {
                e.currentTarget.style.color = '#1890ff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'receipt') {
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            🧾 小票设置
          </button>
        </div>

        {/* 基本信息 */}
        {activeTab === 'basic' && (
          <div>
            <h3 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              🏢 基本信息
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  公司名称
                </label>
                <input
                  type="text"
                  value={settings.companyName || ''}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d9d9d9';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="请输入公司名称"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  公司地址
                </label>
                <input
                  type="text"
                  value={settings.companyAddress || ''}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d9d9d9';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="请输入公司地址"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  联系电话
                </label>
                <input
                  type="text"
                  value={settings.companyPhone || ''}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d9d9d9';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="请输入联系电话"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  默认税率 (%)
                </label>
                <input
                  type="number"
                  value={settings.defaultTaxRate || ''}
                  onChange={(e) => handleInputChange('defaultTaxRate', Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d9d9d9';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="请输入默认税率"
                />
              </div>
            </div>
          </div>
        )}

        {/* 业务设置 */}
        {activeTab === 'business' && (
          <div>
            <h3 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              💼 业务设置
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
                      🧾 打印小票
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      启用小票打印功能
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
                      checked={settings.printReceipt || false}
                      onChange={(e) => handleInputChange('printReceipt', e.target.checked)}
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
                      backgroundColor: settings.printReceipt ? '#1890ff' : '#ccc',
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
                        transform: settings.printReceipt ? 'translateX(26px)' : 'translateX(0)'
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
                      ⭐ 会员积分
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      启用会员积分系统
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
                      checked={settings.enableMemberPoints || false}
                      onChange={(e) => handleInputChange('enableMemberPoints', e.target.checked)}
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
                      backgroundColor: settings.enableMemberPoints ? '#52c41a' : '#ccc',
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
                        transform: settings.enableMemberPoints ? 'translateX(26px)' : 'translateX(0)'
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
                      📊 库存预警
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      启用库存预警功能
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
                      checked={settings.enableInventoryAlert || false}
                      onChange={(e) => handleInputChange('enableInventoryAlert', e.target.checked)}
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
                      backgroundColor: settings.enableInventoryAlert ? '#fa8c16' : '#ccc',
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
                        transform: settings.enableInventoryAlert ? 'translateX(26px)' : 'translateX(0)'
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
                      📴 离线模式
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      启用离线模式功能
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
                      checked={settings.enableOfflineMode || false}
                      onChange={(e) => handleInputChange('enableOfflineMode', e.target.checked)}
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
                      backgroundColor: settings.enableOfflineMode ? '#722ed1' : '#ccc',
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
                        transform: settings.enableOfflineMode ? 'translateX(26px)' : 'translateX(0)'
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 小票设置 */}
        {activeTab === 'receipt' && (
          <div>
            <h3 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              🧾 小票设置
            </h3>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  小票标题
                </label>
                <input
                  type="text"
                  value={settings.receiptTitle || ''}
                  onChange={(e) => handleInputChange('receiptTitle', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d9d9d9';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="请输入小票标题"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  小票底部信息
                </label>
                <textarea
                  value={settings.receiptFooter || ''}
                  onChange={(e) => handleInputChange('receiptFooter', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '100px',
                    resize: 'vertical',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d9d9d9';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="请输入小票底部信息"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettingsPage;