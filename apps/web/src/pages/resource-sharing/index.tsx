import React, { useState, useEffect } from 'react';
import { ResourceSharingService } from '../../services/resourceSharing';
import { StoreService } from '../../services/store';
import { useAppStore } from '../../store/useAppStore';

interface SharedResource {
  id: string;
  resourceName: string;
  resourceType: 'product' | 'other';
  targetStoreId: string;
  targetStoreName: string;
  sourceStoreId: string;
  sourceStoreName: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function ResourceSharingPage() {
  const [activeTab, setActiveTab] = useState('share');
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [shareRequests, setShareRequests] = useState<SharedResource[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const currentStore = useAppStore(state => state.currentStore);
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: 'product' as 'product' | 'other',
    targetStoreId: '',
    description: ''
  });

  const resourceSharingService = ResourceSharingService.getInstance();
  const storeService = StoreService.getInstance();

  useEffect(() => {
    loadData();
    loadStores();
  }, []);

  const loadData = async () => {
    try {
      // 模拟数据
      const mockResources: SharedResource[] = [
        {
          id: '1',
          resourceName: '高端智能手机系列',
          resourceType: 'product',
          targetStoreId: 'store2',
          targetStoreName: '分店A',
          sourceStoreId: 'store1',
          sourceStoreName: '总店',
          status: 'approved',
          description: '共享高端智能手机产品线和库存信息',
          createdAt: '2024-01-15 10:30:00',
          updatedAt: '2024-01-15 11:00:00'
        },
        {
          id: '2',
          resourceName: '会员管理系统',
          resourceType: 'other',
          targetStoreId: 'store3',
          targetStoreName: '分店B',
          sourceStoreId: 'store1',
          sourceStoreName: '总店',
          status: 'pending',
          description: '共享会员管理系统和数据',
          createdAt: '2024-01-16 14:20:00',
          updatedAt: '2024-01-16 14:20:00'
        }
      ];

      const mockRequests: SharedResource[] = [
        {
          id: '3',
          resourceName: '库存管理系统',
          resourceType: 'other',
          targetStoreId: 'store1',
          targetStoreName: '总店',
          sourceStoreId: 'store2',
          sourceStoreName: '分店A',
          status: 'pending',
          description: '请求共享库存管理系统',
          createdAt: '2024-01-17 09:15:00',
          updatedAt: '2024-01-17 09:15:00'
        },
        {
          id: '4',
          resourceName: '促销活动方案',
          resourceType: 'other',
          targetStoreId: 'store1',
          targetStoreName: '总店',
          sourceStoreId: 'store3',
          sourceStoreName: '分店B',
          status: 'approved',
          description: '共享促销活动方案和执行计划',
          createdAt: '2024-01-14 16:45:00',
          updatedAt: '2024-01-14 17:00:00'
        }
      ];

      const mockStores = [
        { id: 'store1', name: '总店', address: '北京市朝阳区', manager: '张经理' },
        { id: 'store2', name: '分店A', address: '北京市海淀区', manager: '李经理' },
        { id: 'store3', name: '分店B', address: '北京市西城区', manager: '王经理' }
      ];

      setResources(mockResources);
      setShareRequests(mockRequests);
      setStores(mockStores);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  const loadStores = async () => {
    try {
      const allStores = await storeService.getAllStores();
      // 排除当前店铺
      const otherStores = allStores.filter(store => 
        currentStore && store.id !== currentStore.id
      );
      setStores(otherStores);
    } catch (error) {
      console.error('加载店铺数据失败:', error);
    }
  };

  const handleShare = async () => {
    if (!formData.resourceName || !formData.targetStoreId) {
      alert('请填写完整信息');
      return;
    }

    try {
      // 模拟共享操作
      const newResource: SharedResource = {
        id: Date.now().toString(),
        resourceName: formData.resourceName,
        resourceType: formData.resourceType,
        targetStoreId: formData.targetStoreId,
        targetStoreName: stores.find(s => s.id === formData.targetStoreId)?.name || '',
        sourceStoreId: currentStore?.id || '',
        sourceStoreName: currentStore?.name || '',
        status: 'pending',
        description: formData.description,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      };

      setResources(prev => [...prev, newResource]);
      setFormVisible(false);
      setFormData({
        resourceName: '',
        resourceType: 'product',
        targetStoreId: '',
        description: ''
      });
      alert('资源共享请求已发送');
    } catch (error) {
      alert('资源共享失败');
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setShareRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'approved' as const, updatedAt: new Date().toLocaleString() }
            : req
        )
      );
      alert('已批准资源共享请求');
    } catch (error) {
      alert('操作失败');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setShareRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'rejected' as const, updatedAt: new Date().toLocaleString() }
            : req
        )
      );
      alert('已拒绝资源共享请求');
    } catch (error) {
      alert('操作失败');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#52c41a';
      case 'pending': return '#fa8c16';
      case 'rejected': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '已批准';
      case 'pending': return '待处理';
      case 'rejected': return '已拒绝';
      default: return '未知';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return '📦';
      case 'other': return '🔧';
      default: return '📄';
    }
  };

  const getResourceTypeText = (type: string) => {
    switch (type) {
      case 'product': return '商品';
      case 'other': return '其他';
      default: return '未知';
    }
  };

  // 统计数据
  const stats = {
    totalShared: resources.length,
    approvedShared: resources.filter(r => r.status === 'approved').length,
    pendingShared: resources.filter(r => r.status === 'pending').length,
    totalRequests: shareRequests.length,
    pendingRequests: shareRequests.filter(r => r.status === 'pending').length,
    approvedRequests: shareRequests.filter(r => r.status === 'approved').length
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
              🤝 资源共享管理
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              管理店铺间的资源共享和协作
            </p>
          </div>
          <button
            onClick={() => setFormVisible(true)}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
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
            ➕ 发起资源共享
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>我共享的资源</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.totalShared}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>📤</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>已批准共享</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.approvedShared}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>待处理共享</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.pendingShared}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>⏳</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>收到请求</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.totalRequests}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>📥</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>待处理请求</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.pendingRequests}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🔄</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>已批准请求</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.approvedRequests}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🎉</div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
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
            onClick={() => setActiveTab('share')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: activeTab === 'share' ? '#1890ff' : '#666',
              borderBottom: activeTab === 'share' ? '2px solid #1890ff' : 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'share') {
                e.currentTarget.style.color = '#1890ff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'share') {
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            📤 我共享的资源
          </button>
          
          <button
            onClick={() => setActiveTab('request')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: activeTab === 'request' ? '#1890ff' : '#666',
              borderBottom: activeTab === 'request' ? '2px solid #1890ff' : 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'request') {
                e.currentTarget.style.color = '#1890ff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'request') {
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            📥 收到的共享请求
          </button>
        </div>

        {/* 我共享的资源 */}
        {activeTab === 'share' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              📤 我共享的资源
            </h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {resources.map(resource => (
                <div 
                  key={resource.id} 
                  style={{ 
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #e8e8e8',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                        {getResourceTypeIcon(resource.resourceType)} {resource.resourceName}
                      </h4>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                        <strong>目标店铺:</strong> {resource.targetStoreName}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        <strong>描述:</strong> {resource.description}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: resource.status === 'approved' ? '#f6ffed' : 
                                       resource.status === 'pending' ? '#fff7e6' : '#fff2f0',
                      color: getStatusColor(resource.status),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {getStatusIcon(resource.status)} {getStatusText(resource.status)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
                    <span>创建时间: {resource.createdAt}</span>
                    <span>更新时间: {resource.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 收到的共享请求 */}
        {activeTab === 'request' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              📥 收到的共享请求
            </h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {shareRequests.filter(request => 
                currentStore && request.targetStoreId === currentStore.id
              ).map(request => (
                <div 
                  key={request.id} 
                  style={{ 
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #e8e8e8',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                        {getResourceTypeIcon(request.resourceType)} {request.resourceName}
                      </h4>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                        <strong>来源店铺:</strong> {request.sourceStoreName}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        <strong>描述:</strong> {request.description}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: request.status === 'approved' ? '#f6ffed' : 
                                       request.status === 'pending' ? '#fff7e6' : '#fff2f0',
                      color: getStatusColor(request.status),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {getStatusIcon(request.status)} {getStatusText(request.status)}
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <button
                        onClick={() => handleApprove(request.id)}
                        style={{
                          backgroundColor: '#52c41a',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
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
                        ✅ 批准
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        style={{
                          backgroundColor: '#ff4d4f',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
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
                        ❌ 拒绝
                      </button>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999', marginTop: '12px' }}>
                    <span>创建时间: {request.createdAt}</span>
                    <span>更新时间: {request.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 发起资源共享对话框 */}
      {formVisible && (
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
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: '0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
                🤝 发起资源共享
              </h3>
              <button
                onClick={() => setFormVisible(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  资源名称 *
                </label>
                <input
                  type="text"
                  value={formData.resourceName}
                  onChange={(e) => setFormData({...formData, resourceName: e.target.value})}
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
                  placeholder="请输入资源名称"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  资源类型 *
                </label>
                <select
                  value={formData.resourceType}
                  onChange={(e) => setFormData({...formData, resourceType: e.target.value as 'product' | 'other'})}
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
                >
                  <option value="product">📦 商品</option>
                  <option value="other">🔧 其他</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  目标店铺 *
                </label>
                <select
                  value={formData.targetStoreId}
                  onChange={(e) => setFormData({...formData, targetStoreId: e.target.value})}
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
                >
                  <option value="">请选择目标店铺</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name} - {store.address}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
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
                  placeholder="请输入资源描述"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setFormVisible(false)}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: 'none',
                  padding: '10px 20px',
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
                onClick={handleShare}
                style={{
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#40a9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1890ff';
                }}
              >
                发送请求
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}