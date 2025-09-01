import { useState } from 'react';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('introduction');
  
  // 统计数据
  const helpStats = {
    totalArticles: 156,
    totalViews: 12450,
    totalUsers: 2847,
    satisfactionRate: 94.5
  };

  // 帮助分类
  const helpCategories = [
    {
      id: 'introduction',
      title: '系统介绍',
      icon: '📚',
      color: '#1890ff',
      description: '了解多店铺管理系统的基本功能和特点',
      articles: 12,
      popularity: 95
    },
    {
      id: 'stores',
      title: '店铺管理',
      icon: '🏪',
      color: '#52c41a',
      description: '学习如何创建、编辑和管理店铺信息',
      articles: 24,
      popularity: 88
    },
    {
      id: 'hierarchy',
      title: '店铺层级',
      icon: '🏗️',
      color: '#722ed1',
      description: '理解店铺层级关系和管理结构',
      articles: 18,
      popularity: 76
    },
    {
      id: 'reports',
      title: '跨店铺报表',
      icon: '📊',
      color: '#fa8c16',
      description: '掌握跨店铺销售和库存报表分析',
      articles: 32,
      popularity: 92
    },
    {
      id: 'sharing',
      title: '资源共享',
      icon: '🔄',
      color: '#13c2c2',
      description: '学习店铺间资源共享和同步功能',
      articles: 28,
      popularity: 85
    },
    {
      id: 'headquarters',
      title: '总部-分店管理',
      icon: '🏢',
      color: '#eb2f96',
      description: '了解总部统一管理和分店运营功能',
      articles: 42,
      popularity: 90
    }
  ];

  // 帮助内容
  const helpContent = {
    introduction: {
      title: '多店铺管理系统介绍',
      content: [
        {
          subtitle: '系统概述',
          text: '欢迎使用多店铺管理系统！本系统专为连锁店铺设计，支持总部-分店管理模式，提供统一的管理界面和分散的操作权限。通过先进的技术架构和用户友好的界面设计，帮助您高效管理多个店铺的日常运营。'
        },
        {
          subtitle: '主要功能',
          items: [
            { icon: '🏪', title: '店铺管理', desc: '管理所有店铺信息，包括总部和分店' },
            { icon: '🏗️', title: '店铺层级', desc: '查看和管理店铺之间的层级关系' },
            { icon: '🔐', title: '权限管理', desc: '为不同店铺设置不同的用户权限' },
            { icon: '📊', title: '跨店铺报表', desc: '统计和分析所有店铺的销售和库存数据' },
            { icon: '🔄', title: '资源共享', desc: '在店铺之间共享商品、会员和供应商信息' },
            { icon: '🏢', title: '总部-分店管理', desc: '总部统一管理分店，支持数据同步' }
          ]
        },
        {
          subtitle: '系统特点',
          items: [
            { icon: '🎯', title: '统一管理', desc: '总部可以统一管理所有分店的数据和配置' },
            { icon: '🏃', title: '独立运营', desc: '分店可以独立进行日常运营操作' },
            { icon: '🔄', title: '数据同步', desc: '支持总部向分店同步商品、会员和供应商信息' },
            { icon: '🤝', title: '资源共享', desc: '店铺之间可以共享资源，避免重复录入' },
            { icon: '📈', title: '报表分析', desc: '提供多维度的报表分析功能' }
          ]
        }
      ]
    },
    stores: {
      title: '店铺管理',
      content: [
        {
          subtitle: '店铺管理概述',
          text: '店铺管理功能允许管理员创建、编辑和删除店铺信息。通过直观的界面设计，您可以轻松管理所有店铺的基本信息、联系方式和运营状态。'
        },
        {
          subtitle: '创建店铺',
          steps: [
            '进入"店铺管理"页面',
            '点击"添加店铺"按钮',
            '填写店铺信息，包括名称、编码、地址、电话和经理',
            '设置店铺层级关系（如果需要）',
            '点击"保存"完成创建'
          ]
        },
        {
          subtitle: '编辑店铺',
          steps: [
            '在店铺列表中找到需要编辑的店铺',
            '点击店铺行的"编辑"按钮',
            '修改相关信息',
            '点击"保存"完成编辑'
          ]
        },
        {
          subtitle: '删除店铺',
          steps: [
            '在店铺列表中找到需要删除的店铺',
            '点击店铺行的"删除"按钮',
            '确认删除操作'
          ]
        }
      ]
    },
    hierarchy: {
      title: '店铺层级管理',
      content: [
        {
          subtitle: '层级管理概述',
          text: '店铺层级功能展示了所有店铺之间的层级关系，帮助管理员更好地理解店铺结构。通过树状结构展示，您可以清晰地看到总部与分店、上级分店与下级分店之间的关系。'
        },
        {
          subtitle: '层级结构',
          items: [
            { icon: '🏢', title: '总部', desc: '层级为0，是整个连锁系统的管理中心' },
            { icon: '🏪', title: '一级分店', desc: '层级为1，直接隶属于总部' },
            { icon: '🏘️', title: '二级分店', desc: '层级为2，隶属于一级分店' },
            { icon: '🏗️', title: '更多层级', desc: '可以根据需要创建更多层级' }
          ]
        },
        {
          subtitle: '查看层级',
          steps: [
            '进入"店铺层级"页面',
            '页面以树状结构展示所有店铺的层级关系',
            '可以展开或折叠不同层级的店铺'
          ]
        }
      ]
    },
    reports: {
      title: '跨店铺报表',
      content: [
        {
          subtitle: '报表功能概述',
          text: '跨店铺报表功能提供对所有店铺销售和库存数据的统一分析。通过聚合多个店铺的数据，帮助管理者做出更好的业务决策。'
        },
        {
          subtitle: '销售报表',
          items: [
            { icon: '📈', title: '聚合销售报表', desc: '显示所有店铺的总体销售数据' },
            { icon: '📊', title: '各店铺销售对比', desc: '对比不同店铺的销售表现' },
            { icon: '🏆', title: '商品销售排行', desc: '显示畅销商品排行榜' }
          ]
        },
        {
          subtitle: '库存报表',
          items: [
            { icon: '📦', title: '各店铺库存对比', desc: '对比不同店铺的库存情况' },
            { icon: '⚠️', title: '低库存预警', desc: '显示库存不足的商品' }
          ]
        }
      ]
    },
    sharing: {
      title: '资源共享',
      content: [
        {
          subtitle: '资源共享概述',
          text: '资源共享功能允许店铺之间共享商品、会员和供应商信息，避免重复录入。通过统一的数据共享机制，提高数据一致性和工作效率。'
        },
        {
          subtitle: '分享资源',
          steps: [
            '进入"资源共享"页面',
            '切换到"分享资源"标签页',
            '选择需要分享的资源类型（商品、会员或供应商）',
            '选择目标店铺',
            '点击"分享"按钮'
          ]
        },
        {
          subtitle: '请求资源',
          steps: [
            '进入"资源共享"页面',
            '切换到"请求资源"标签页',
            '选择需要请求的资源类型',
            '填写请求说明',
            '点击"发送请求"按钮'
          ]
        },
        {
          subtitle: '管理请求',
          steps: [
            '进入"资源共享"页面',
            '切换到"收到的请求"标签页',
            '查看其他店铺的资源请求',
            '选择"批准"或"拒绝"'
          ]
        }
      ]
    },
    headquarters: {
      title: '总部-分店管理',
      content: [
        {
          subtitle: '总部管理概述',
          text: '总部-分店管理功能允许总部统一管理分店，支持数据同步和跨店铺订单。通过集中的控制台，总部可以有效地管理和监控所有分店的运营情况。'
        },
        {
          subtitle: '管理设置',
          items: [
            { icon: '🔄', title: '同步产品数据', desc: '将总部的产品数据同步到所有分店' },
            { icon: '👥', title: '同步会员数据', desc: '将总部的会员数据同步到所有分店' },
            { icon: '🏭', title: '同步供应商数据', desc: '将总部的供应商数据同步到所有分店' },
            { icon: '💰', title: '同步价格信息', desc: '将总部的价格信息同步到所有分店' },
            { icon: '📦', title: '同步库存信息', desc: '将总部的库存信息同步到所有分店' },
            { icon: '🛒', title: '允许跨店铺订单', desc: '允许创建跨店铺的订单' }
          ]
        },
        {
          subtitle: '数据同步',
          steps: [
            '进入"总部-分店管理"页面',
            '切换到"管理设置"标签页',
            '启用需要同步的数据类型',
            '点击相应的同步按钮'
          ]
        },
        {
          subtitle: '分店管理',
          steps: [
            '进入"总部-分店管理"页面',
            '切换到"分店管理"标签页',
            '查看所有直属分店的信息'
          ]
        }
      ]
    }
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
              📚 系统帮助文档
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              多店铺管理系统使用指南和帮助文档
            </p>
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#1890ff',
            backgroundColor: '#e6f7ff',
            padding: '6px 12px', 
            borderRadius: '12px',
            fontWeight: 'bold'
          }}>
            最后更新: 2024-01-15
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>帮助文档</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {helpStats.totalArticles}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>📚</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>浏览次数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {helpStats.totalViews.toLocaleString()}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>👀</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>帮助用户</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {helpStats.totalUsers.toLocaleString()}
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
          borderTop: '4px solid #fa8c16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>满意度</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {helpStats.satisfactionRate}%
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>⭐</div>
          </div>
        </div>
      </div>

      {/* 帮助分类卡片 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          📖 帮助分类
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px'
        }}>
          {helpCategories.map(category => (
            <div
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              style={{
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: activeTab === category.id ? '#f0f9ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s',
                borderLeft: `4px solid ${category.color}`
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '24px' }}>{category.icon}</div>
                <div>
                  <h3 style={{ margin: '0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                    {category.title}
                  </h3>
                </div>
              </div>
              <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>
                {category.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#999', fontSize: '12px' }}>
                  {category.articles} 篇文章
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#999', fontSize: '12px' }}>热度</span>
                  <div style={{ 
                    width: '60px', 
                    height: '4px', 
                    backgroundColor: '#f0f0f0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${category.popularity}%`, 
                      height: '100%', 
                      backgroundColor: category.color,
                      transition: 'width 0.3s'
                    }}></div>
                  </div>
                  <span style={{ color: category.color, fontSize: '12px', fontWeight: 'bold' }}>
                    {category.popularity}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 帮助内容 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ fontSize: '24px' }}>
            {helpCategories.find(c => c.id === activeTab)?.icon}
          </div>
          <h2 style={{ margin: '0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
            {helpContent[activeTab as keyof typeof helpContent].title}
          </h2>
        </div>

        {helpContent[activeTab as keyof typeof helpContent].content.map((section, index) => (
          <div key={index} style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              {section.subtitle}
            </h3>
            
            {section.text && (
              <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                {section.text}
              </p>
            )}
            
            {section.items && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '12px'
              }}>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} style={{ 
                    display: 'flex', 
                    alignItems: 'start', 
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '16px', marginTop: '2px' }}>{item.icon}</div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                        {item.title}
                      </h4>
                      <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {section.steps && (
              <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '16px' }}>
                <ol style={{ margin: '0', paddingLeft: '20px' }}>
                  {section.steps.map((step, stepIndex) => (
                    <li key={stepIndex} style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}