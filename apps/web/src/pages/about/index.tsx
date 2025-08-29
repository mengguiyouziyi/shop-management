import React from 'react';
import { Card, Row, Col, Tag } from 'tdesign-react';

export default function AboutPage() {
  const systemInfo = {
    name: '多店铺管理系统',
    version: 'v1.0.0',
    description: '专为连锁店铺设计的综合管理系统，支持总部-分店管理模式，提供统一的管理界面和分散的操作权限。',
    features: [
      '店铺层级管理',
      '权限控制',
      '跨店铺报表',
      '资源共享',
      '总部-分店管理',
      '移动端支持',
      '离线操作',
      '数据同步'
    ],
    technologies: [
      'React', 
      'TypeScript', 
      'TDesign', 
      'Vite', 
      'Vitest',
      'LocalStorage'
    ]
  };

  const teamMembers = [
    {
      name: '张三',
      role: '项目经理',
      description: '负责项目整体规划和协调'
    },
    {
      name: '李四',
      role: '前端开发',
      description: '负责前端界面和用户体验'
    },
    {
      name: '王五',
      role: '后端开发',
      description: '负责后端逻辑和数据处理'
    },
    {
      name: '赵六',
      role: '测试工程师',
      description: '负责系统测试和质量保证'
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        关于系统
      </h1>
      
      <Row gutter={20} style={{ marginBottom: '20px' }}>
        <Col span={16}>
          <Card title="系统信息">
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{systemInfo.name}</h3>
              <p style={{ color: '#666', marginBottom: '10px' }}>{systemInfo.description}</p>
              <Tag theme="primary" variant="light">版本 {systemInfo.version}</Tag>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ margin: '15px 0 10px 0', fontSize: '16px' }}>主要功能</h4>
              <ul style={{ paddingLeft: '20px' }}>
                {systemInfo.features.map((feature, index) => (
                  <li key={index} style={{ margin: '5px 0' }}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ margin: '15px 0 10px 0', fontSize: '16px' }}>技术栈</h4>
              <div>
                {systemInfo.technologies.map((tech, index) => (
                  <Tag key={index} style={{ marginRight: '10px', marginBottom: '5px' }}>
                    {tech}
                  </Tag>
                ))}
              </div>
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="系统状态">
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>运行状态</h4>
              <p style={{ color: '#52c41a', fontWeight: 'bold' }}>✓ 正常运行</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>连接状态</h4>
              <p style={{ color: '#52c41a', fontWeight: 'bold' }}>✓ 网络连接正常</p>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>数据状态</h4>
              <p style={{ color: '#52c41a', fontWeight: 'bold' }}>✓ 数据同步正常</p>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Card title="开发团队">
        <Row gutter={20}>
          {teamMembers.map((member, index) => (
            <Col span={6} key={index}>
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                backgroundColor: '#f5f7fa',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  backgroundColor: '#1890ff',
                  margin: '0 auto 15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {member.name.charAt(0)}
                </div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{member.name}</h4>
                <p style={{ margin: '0 0 5px 0', color: '#1890ff' }}>{member.role}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{member.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
      
      <Card style={{ marginTop: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>联系我们</h3>
        <Row>
          <Col span={8}>
            <p><strong>客服电话:</strong> 400-123-4567</p>
          </Col>
          <Col span={8}>
            <p><strong>技术支持:</strong> support@shopmanager.com</p>
          </Col>
          <Col span={8}>
            <p><strong>官方网站:</strong> www.shopmanager.com</p>
          </Col>
        </Row>
      </Card>
    </div>
  );
}