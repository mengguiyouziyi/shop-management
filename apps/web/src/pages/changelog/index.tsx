import { useState, useEffect } from 'react';

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  category: 'feature' | 'improvement' | 'bugfix' | 'security';
  author: string;
  impact: 'high' | 'medium' | 'low';
}

export default function ChangelogPage() {
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Mock changelog data
  const changelogData: ChangelogEntry[] = [
    {
      id: '1',
      version: 'v2.1.0',
      date: '2024-01-15',
      title: '新增移动端适配功能',
      description: '全面优化移动端用户体验，支持响应式布局和触摸操作',
      category: 'feature',
      author: '张三',
      impact: 'high'
    },
    {
      id: '2',
      version: 'v2.1.0',
      date: '2024-01-15',
      title: '优化库存预警机制',
      description: '改进库存预警算法，支持自定义预警阈值和通知方式',
      category: 'improvement',
      author: '李四',
      impact: 'medium'
    },
    {
      id: '3',
      version: 'v2.1.0',
      date: '2024-01-15',
      title: '修复数据同步异常',
      description: '解决在特定网络环境下数据同步失败的问题',
      category: 'bugfix',
      author: '王五',
      impact: 'high'
    },
    {
      id: '4',
      version: 'v2.0.5',
      date: '2024-01-10',
      title: '新增批量导入功能',
      description: '支持Excel批量导入商品、会员和供应商信息',
      category: 'feature',
      author: '赵六',
      impact: 'medium'
    },
    {
      id: '5',
      version: 'v2.0.5',
      date: '2024-01-10',
      title: '提升报表生成性能',
      description: '优化大数据量报表生成速度，减少等待时间',
      category: 'improvement',
      author: '孙七',
      impact: 'medium'
    },
    {
      id: '6',
      version: 'v2.0.5',
      date: '2024-01-10',
      title: '修复权限验证漏洞',
      description: '加强用户权限验证机制，提高系统安全性',
      category: 'security',
      author: '周八',
      impact: 'high'
    },
    {
      id: '7',
      version: 'v2.0.0',
      date: '2024-01-01',
      title: '全新UI界面设计',
      description: '采用现代化设计语言，提升用户体验',
      category: 'feature',
      author: '吴九',
      impact: 'high'
    },
    {
      id: '8',
      version: 'v2.0.0',
      date: '2024-01-01',
      title: '支持多店铺管理',
      description: '新增店铺层级管理和跨店铺功能',
      category: 'feature',
      author: '郑十',
      impact: 'high'
    }
  ];

  const versions = ['v2.1.0', 'v2.0.5', 'v2.0.0'];
  const categories = ['feature', 'improvement', 'bugfix', 'security'];

  const filteredChangelog = changelogData.filter(entry => {
    const versionMatch = selectedVersion === 'all' || entry.version === selectedVersion;
    const categoryMatch = selectedCategory === 'all' || entry.category === selectedCategory;
    return versionMatch && categoryMatch;
  });

  const getCategoryLabel = (category: ChangelogEntry['category']) => {
    switch (category) {
      case 'feature': return '新功能';
      case 'improvement': return '改进';
      case 'bugfix': return '修复';
      case 'security': return '安全';
      default: return category;
    }
  };

  const getCategoryColor = (category: ChangelogEntry['category']) => {
    switch (category) {
      case 'feature': return '#52c41a';
      case 'improvement': return '#fa8c16';
      case 'bugfix': return '#ff4d4f';
      case 'security': return '#722ed1';
      default: return '#1890ff';
    }
  };

  const getImpactLabel = (impact: ChangelogEntry['impact']) => {
    switch (impact) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return impact;
    }
  };

  const getImpactColor = (impact: ChangelogEntry['impact']) => {
    switch (impact) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#fa8c16';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  // 统计数据
  const changelogStats = {
    totalUpdates: changelogData.length,
    totalFeatures: changelogData.filter(e => e.category === 'feature').length,
    totalImprovements: changelogData.filter(e => e.category === 'improvement').length,
    totalBugfixes: changelogData.filter(e => e.category === 'bugfix').length,
    latestVersion: versions[0],
    totalVersions: versions.length
  };

  // 按版本分组
  const groupedChangelog: Record<string, ChangelogEntry[]> = {};
  filteredChangelog.forEach(entry => {
    if (!groupedChangelog[entry.version]) {
      groupedChangelog[entry.version] = [];
    }
    groupedChangelog[entry.version].push(entry);
  });

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
              📋 系统更新日志
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              跟踪系统更新历史和新功能发布
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
            当前版本: {changelogStats.latestVersion}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总更新数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {changelogStats.totalUpdates}
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
          borderTop: '4px solid #52c41a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>新功能</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {changelogStats.totalFeatures}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>✨</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>改进优化</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {changelogStats.totalImprovements}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🔧</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>问题修复</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {changelogStats.totalBugfixes}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🐛</div>
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          🔍 筛选条件
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>版本:</label>
            <select 
              value={selectedVersion} 
              onChange={(e) => setSelectedVersion(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              <option value="all">全部版本</option>
              {versions.map(version => (
                <option key={version} value={version}>{version}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>类型:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              <option value="all">全部类型</option>
              <option value="feature">新功能</option>
              <option value="improvement">改进</option>
              <option value="bugfix">修复</option>
              <option value="security">安全</option>
            </select>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginLeft: 'auto'
          }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              找到 {filteredChangelog.length} 条记录
            </span>
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
            { id: 'all', label: '全部更新' },
            { id: 'feature', label: '新功能' },
            { id: 'improvement', label: '改进' },
            { id: 'bugfix', label: '修复' },
            { id: 'security', label: '安全' }
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
          {activeTab === 'all' && (
            <div>
              {Object.keys(groupedChangelog).map(version => (
                <div key={version} style={{ marginBottom: '32px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '16px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div style={{ fontSize: '24px' }}>🎯</div>
                    <h3 style={{ margin: '0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
                      版本 {version}
                    </h3>
                    <span style={{ 
                      backgroundColor: '#e6f7ff',
                      color: '#1890ff',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {groupedChangelog[version].length} 项更新
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {groupedChangelog[version].map(entry => (
                      <div key={entry.id} style={{ 
                        border: '1px solid #e8e8e8',
                        borderRadius: '8px',
                        padding: '16px',
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
                            <h4 style={{ margin: '0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                              {entry.title}
                            </h4>
                            <span style={{ 
                              backgroundColor: getCategoryColor(entry.category),
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              {getCategoryLabel(entry.category)}
                            </span>
                            <span style={{ 
                              backgroundColor: getImpactColor(entry.impact),
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              {getImpactLabel(entry.impact)}
                            </span>
                          </div>
                          <span style={{ color: '#999', fontSize: '12px' }}>
                            {entry.date}
                          </span>
                        </div>
                        
                        <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                          {entry.description}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#999', fontSize: '12px' }}>
                            作者: {entry.author}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab !== 'all' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredChangelog
                .filter(entry => entry.category === activeTab)
                .map(entry => (
                  <div key={entry.id} style={{ 
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    padding: '16px',
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
                        <h4 style={{ margin: '0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                          {entry.title}
                        </h4>
                        <span style={{ 
                          backgroundColor: getCategoryColor(entry.category),
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {getCategoryLabel(entry.category)}
                        </span>
                        <span style={{ 
                          backgroundColor: getImpactColor(entry.impact),
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {getImpactLabel(entry.impact)}
                        </span>
                      </div>
                      <span style={{ color: '#999', fontSize: '12px' }}>
                        {entry.version} - {entry.date}
                      </span>
                    </div>
                    
                    <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                      {entry.description}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#999', fontSize: '12px' }}>
                        作者: {entry.author}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {filteredChangelog.filter(entry => activeTab === 'all' || entry.category === activeTab).length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#999'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p>暂无更新记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}