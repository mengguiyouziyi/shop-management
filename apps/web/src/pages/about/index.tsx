import { useState } from 'react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // 系统信息
  const systemInfo = {
    name: '多店铺管理系统',
    version: 'v2.1.0',
    description: '专为连锁店铺设计的综合管理系统，支持总部-分店管理模式，提供统一的管理界面和分散的操作权限。',
    releaseDate: '2024-01-15',
    nextUpdate: '2024-02-01'
  };

  // 功能特性
  const features = [
    { icon: '🏪', title: '店铺层级管理', description: '支持多层级店铺结构，灵活管理总部与分店关系', color: '#1890ff' },
    { icon: '🔐', title: '权限控制', description: '精细化的权限管理，确保数据安全和操作规范', color: '#52c41a' },
    { icon: '📊', title: '跨店铺报表', description: '统一的数据分析平台，支持多维度报表展示', color: '#722ed1' },
    { icon: '🔄', title: '资源共享', description: '店铺间资源共享，避免重复录入提高效率', color: '#fa8c16' },
    { icon: '🏢', title: '总部-分店管理', description: '总部统一管理分店，支持数据同步和监控', color: '#13c2c2' },
    { icon: '📱', title: '移动端支持', description: '响应式设计，支持手机和平板设备访问', color: '#eb2f96' },
    { icon: '🔄', title: '离线操作', description: '支持离线操作，数据自动同步到云端', color: '#f5222d' },
    { icon: '⚡', title: '高性能', description: '优化的系统架构，确保快速响应和稳定运行', color: '#52c41a' }
  ];

  // 技术栈
  const technologies = [
    { name: 'React', category: '前端框架', color: '#61dafb', icon: '⚛️' },
    { name: 'TypeScript', category: '编程语言', color: '#3178c6', icon: '📝' },
    { name: 'Vite', category: '构建工具', color: '#646cff', icon: '🚀' },
    { name: 'Vitest', category: '测试框架', color: '#fcc72b', icon: '🧪' },
    { name: 'LocalStorage', category: '数据存储', color: '#ff9800', icon: '💾' },
    { name: 'CSS3', category: '样式设计', color: '#1572b6', icon: '🎨' },
    { name: 'HTML5', category: '标记语言', color: '#e34c26', icon: '📄' },
    { name: 'JavaScript', category: '脚本语言', color: '#f7df1e', icon: '🟨' }
  ];

  // 团队成员
  const teamMembers = [
    {
      name: '张三',
      role: '项目经理',
      description: '负责项目整体规划和协调',
      avatar: '👨‍💼',
      experience: '8年项目管理经验',
      skills: ['项目管理', '团队协调', '需求分析']
    },
    {
      name: '李四',
      role: '前端开发',
      description: '负责前端界面和用户体验',
      avatar: '👨‍💻',
      experience: '6年前端开发经验',
      skills: ['React', 'TypeScript', 'UI/UX']
    },
    {
      name: '王五',
      role: '后端开发',
      description: '负责后端逻辑和数据处理',
      avatar: '👩‍💻',
      experience: '7年后端开发经验',
      skills: ['Node.js', '数据库', 'API设计']
    },
    {
      name: '赵六',
      role: '测试工程师',
      description: '负责系统测试和质量保证',
      avatar: '👨‍🔬',
      experience: '5年测试经验',
      skills: ['自动化测试', '性能测试', '质量保证']
    }
  ];

  // 系统状态
  const systemStatus = [
    { name: '系统运行', status: '正常', color: '#52c41a', icon: '✅' },
    { name: '数据库连接', status: '正常', color: '#52c41a', icon: '✅' },
    { name: 'API服务', status: '正常', color: '#52c41a', icon: '✅' },
    { name: '存储空间', status: '充足', color: '#52c41a', icon: '✅' },
    { name: '备份服务', status: '正常', color: '#52c41a', icon: '✅' },
    { name: '安全监控', status: '正常', color: '#52c41a', icon: '✅' }
  ];

  // 联系信息
  const contactInfo = [
    { type: '客服电话', value: '400-123-4567', icon: '📞', color: '#1890ff' },
    { type: '技术支持', value: 'support@shopmanager.com', icon: '📧', color: '#52c41a' },
    { type: '官方网站', value: 'www.shopmanager.com', icon: '🌐', color: '#722ed1' },
    { type: '工作时间', value: '周一至周五 9:00-18:00', icon: '🕒', color: '#fa8c16' }
  ];

  // 统计数据
  const aboutStats = {
    totalUsers: 15420,
    totalStores: 2847,
    totalProducts: 156892,
    totalOrders: 1245678,
    uptime: '99.9%',
    satisfaction: 4.8
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
              ℹ️ 关于系统
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              了解多店铺管理系统的详细信息和技术规格
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
            版本 {systemInfo.version}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总用户数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {aboutStats.totalUsers.toLocaleString()}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>管理店铺</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {aboutStats.totalStores.toLocaleString()}
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
          borderTop: '4px solid #722ed1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>商品总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {aboutStats.totalProducts.toLocaleString()}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>处理订单</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {aboutStats.totalOrders.toLocaleString()}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>📋</div>
          </div>
        </div>
      </div>

      {/* 系统信息 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          🎯 系统概述
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <h3 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              {systemInfo.name}
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
              {systemInfo.description}
            </p>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#999', fontSize: '14px' }}>当前版本:</span>
                <span style={{ color: '#1890ff', fontSize: '14px', fontWeight: 'bold' }}>
                  {systemInfo.version}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#999', fontSize: '14px' }}>发布日期:</span>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  {systemInfo.releaseDate}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
              系统状态
            </h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {systemStatus.slice(0, 3).map((status, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{status.icon}</span>
                  <span style={{ color: '#666', fontSize: '14px' }}>{status.name}:</span>
                  <span style={{ color: status.color, fontSize: '14px', fontWeight: 'bold' }}>
                    {status.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 功能特性 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          ✨ 功能特性
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '16px'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{ 
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#fff',
              transition: 'all 0.3s',
              borderLeft: `4px solid ${feature.color}`
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
                <div style={{ fontSize: '24px' }}>{feature.icon}</div>
                <h3 style={{ margin: '0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                  {feature.title}
                </h3>
              </div>
              <p style={{ margin: '0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 技术栈和团队 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* 技术栈 */}
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
            🔧 技术栈
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '12px'
          }}>
            {technologies.map((tech, index) => (
              <div key={index} style={{ 
                textAlign: 'center',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
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
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{tech.icon}</div>
                <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                  {tech.name}
                </h4>
                <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>
                  {tech.category}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 开发团队 */}
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
            👥 开发团队
          </h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {teamMembers.map((member, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
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
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  backgroundColor: '#e6f7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {member.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                    {member.name}
                  </h4>
                  <p style={{ margin: '0 0 4px 0', color: '#1890ff', fontSize: '14px', fontWeight: 'bold' }}>
                    {member.role}
                  </p>
                  <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '12px' }}>
                    {member.description}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {member.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} style={{ 
                        backgroundColor: '#e6f7ff',
                        color: '#1890ff',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 联系信息 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          📞 联系我们
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px'
        }}>
          {contactInfo.map((contact, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
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
              <div style={{ fontSize: '24px', color: contact.color }}>
                {contact.icon}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                  {contact.type}
                </h4>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                  {contact.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}