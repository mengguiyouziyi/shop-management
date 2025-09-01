import { useState, useEffect } from 'react';

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'submitted' | 'reviewed' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  response?: string;
}

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState('submit');
  const [formData, setFormData] = useState({
    type: '',
    priority: '',
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock feedback data
  const mockFeedbacks: Feedback[] = [
    {
      id: '1',
      userId: 'user1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      type: 'feature',
      title: '希望增加批量导出功能',
      description: '希望能够批量导出商品和会员数据，方便进行数据分析和备份。',
      priority: 'medium',
      status: 'in-progress',
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-01-16 14:20:00',
      response: '感谢您的建议！我们正在开发批量导出功能，预计下个版本发布。'
    },
    {
      id: '2',
      userId: 'user2',
      userName: '李四',
      userEmail: 'lisi@example.com',
      type: 'bug',
      title: '库存数量显示错误',
      description: '在销售报表页面，某些商品的库存数量显示不准确，与实际库存不符。',
      priority: 'high',
      status: 'resolved',
      createdAt: '2024-01-14 15:45:00',
      updatedAt: '2024-01-15 09:30:00',
      response: '问题已修复，请清除浏览器缓存后重新查看。'
    },
    {
      id: '3',
      userId: 'user3',
      userName: '王五',
      userEmail: 'wangwu@example.com',
      type: 'improvement',
      title: '优化搜索功能',
      description: '希望能够在商品搜索中支持模糊搜索和拼音搜索，提高查找效率。',
      priority: 'low',
      status: 'reviewed',
      createdAt: '2024-01-13 11:20:00',
      updatedAt: '2024-01-14 16:10:00',
      response: '您的建议已收到，我们会在后续版本中考虑优化搜索功能。'
    }
  ];

  useEffect(() => {
    setFeedbacks(mockFeedbacks);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.priority || !formData.title || !formData.description) {
      alert('请填写所有必填字段');
      return;
    }

    setSubmitting(true);
    
    // 模拟提交
    setTimeout(() => {
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        userId: 'current_user',
        userName: '当前用户',
        userEmail: 'current@example.com',
        type: formData.type as Feedback['type'],
        title: formData.title,
        description: formData.description,
        priority: formData.priority as Feedback['priority'],
        status: 'submitted',
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      };

      setFeedbacks(prev => [newFeedback, ...prev]);
      setFormData({ type: '', priority: '', title: '', description: '' });
      setSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const getTypeLabel = (type: Feedback['type']) => {
    switch (type) {
      case 'bug': return '问题报告';
      case 'feature': return '功能建议';
      case 'improvement': return '改进建议';
      case 'other': return '其他';
      default: return type;
    }
  };

  const getTypeColor = (type: Feedback['type']) => {
    switch (type) {
      case 'bug': return '#ff4d4f';
      case 'feature': return '#52c41a';
      case 'improvement': return '#fa8c16';
      case 'other': return '#1890ff';
      default: return '#666';
    }
  };

  const getPriorityLabel = (priority: Feedback['priority']) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return priority;
    }
  };

  const getPriorityColor = (priority: Feedback['priority']) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#fa8c16';
      case 'low': return '#52c41a';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: Feedback['status']) => {
    switch (status) {
      case 'submitted': return '已提交';
      case 'reviewed': return '已审核';
      case 'in-progress': return '处理中';
      case 'resolved': return '已解决';
      case 'closed': return '已关闭';
      default: return status;
    }
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'submitted': return '#1890ff';
      case 'reviewed': return '#fa8c16';
      case 'in-progress': return '#722ed1';
      case 'resolved': return '#52c41a';
      case 'closed': return '#666';
      default: return '#666';
    }
  };

  // 统计数据
  const feedbackStats = {
    totalFeedbacks: feedbacks.length,
    resolvedFeedbacks: feedbacks.filter(f => f.status === 'resolved').length,
    inProgressFeedbacks: feedbacks.filter(f => f.status === 'in-progress').length,
    pendingFeedbacks: feedbacks.filter(f => f.status === 'submitted' || f.status === 'reviewed').length,
    avgResponseTime: '24小时',
    satisfactionRate: 92.5
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
              💬 用户反馈
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              提交您的建议和问题，帮助我们改进产品
            </p>
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#52c41a',
            backgroundColor: '#f6ffed',
            padding: '6px 12px', 
            borderRadius: '12px',
            fontWeight: 'bold'
          }}>
            平均响应: {feedbackStats.avgResponseTime}
          </div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总反馈数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {feedbackStats.totalFeedbacks}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>💬</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>已解决</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {feedbackStats.resolvedFeedbacks}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>处理中</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {feedbackStats.inProgressFeedbacks}
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
          borderTop: '4px solid #fa8c16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>满意度</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {feedbackStats.satisfactionRate}%
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>⭐</div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #f0f0f0'
        }}>
          {[
            { id: 'submit', label: '提交反馈' },
            { id: 'my-feedback', label: '我的反馈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: activeTab === tab.id ? '#1890ff' : '#666',
                borderBottom: activeTab === tab.id ? '2px solid #1890ff' : 'none',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px' }}>
          {activeTab === 'submit' && (
            <div>
              <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
                📝 提交反馈
              </h2>
              
              {showSuccess && (
                <div style={{ 
                  backgroundColor: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '20px',
                  color: '#52c41a',
                  fontSize: '14px'
                }}>
                  ✅ 反馈提交成功！我们会尽快处理您的反馈。
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                      反馈类型 *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    >
                      <option value="">请选择反馈类型</option>
                      <option value="bug">问题报告</option>
                      <option value="feature">功能建议</option>
                      <option value="improvement">改进建议</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                      优先级 *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    >
                      <option value="">请选择优先级</option>
                      <option value="high">高</option>
                      <option value="medium">中</option>
                      <option value="low">低</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                    标题 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="请输入反馈标题"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                    详细描述 *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="请详细描述您的反馈内容"
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      backgroundColor: '#1890ff',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#40a9ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1890ff';
                    }}
                  >
                    {submitting ? '提交中...' : '提交反馈'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ type: '', priority: '', title: '', description: '' })}
                    style={{
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e8e8e8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                  >
                    重置
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'my-feedback' && (
            <div>
              <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
                📋 我的反馈
              </h2>
              
              {feedbacks.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#999'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                  <p>暂无反馈记录</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {feedbacks.map(feedback => (
                    <div key={feedback.id} style={{ 
                      border: '1px solid #e8e8e8',
                      borderRadius: '8px',
                      padding: '20px',
                      backgroundColor: '#fff',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ margin: '0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                            {feedback.title}
                          </h3>
                          <span style={{ 
                            backgroundColor: getTypeColor(feedback.type),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {getTypeLabel(feedback.type)}
                          </span>
                          <span style={{ 
                            backgroundColor: getPriorityColor(feedback.priority),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {getPriorityLabel(feedback.priority)}
                          </span>
                          <span style={{ 
                            backgroundColor: getStatusColor(feedback.status),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {getStatusLabel(feedback.status)}
                          </span>
                        </div>
                      </div>
                      
                      <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                        {feedback.description}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid #f0f0f0'
                      }}>
                        <span style={{ color: '#999', fontSize: '12px' }}>
                          提交时间: {feedback.createdAt}
                        </span>
                        <span style={{ color: '#999', fontSize: '12px' }}>
                          更新时间: {feedback.updatedAt}
                        </span>
                      </div>
                      
                      {feedback.response && (
                        <div style={{ 
                          marginTop: '12px',
                          padding: '12px',
                          backgroundColor: '#f6ffed',
                          borderRadius: '6px',
                          borderLeft: '4px solid #52c41a'
                        }}>
                          <div style={{ fontWeight: 'bold', color: '#52c41a', marginBottom: '4px', fontSize: '12px' }}>
                            官方回复:
                          </div>
                          <p style={{ margin: '0', color: '#666', fontSize: '12px', lineHeight: '1.5' }}>
                            {feedback.response}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}