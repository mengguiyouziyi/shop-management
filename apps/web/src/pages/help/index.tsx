import React from 'react';
import { Tabs } from 'tdesign-react';

export default function HelpPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        系统帮助文档
      </h1>
      
      <Tabs defaultValue="introduction">
        <Tabs.TabPanel value="introduction" label="系统介绍">
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>多店铺管理系统介绍</h2>
            <p>
              欢迎使用多店铺管理系统！本系统专为连锁店铺设计，支持总部-分店管理模式，提供统一的管理界面和分散的操作权限。
            </p>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>主要功能</h3>
            <ul>
              <li><strong>店铺管理</strong> - 管理所有店铺信息，包括总部和分店</li>
              <li><strong>店铺层级</strong> - 查看和管理店铺之间的层级关系</li>
              <li><strong>权限管理</strong> - 为不同店铺设置不同的用户权限</li>
              <li><strong>跨店铺报表</strong> - 统计和分析所有店铺的销售和库存数据</li>
              <li><strong>资源共享</strong> - 在店铺之间共享商品、会员和供应商信息</li>
              <li><strong>总部-分店管理</strong> - 总部统一管理分店，支持数据同步</li>
            </ul>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>系统特点</h3>
            <ul>
              <li><strong>统一管理</strong> - 总部可以统一管理所有分店的数据和配置</li>
              <li><strong>独立运营</strong> - 分店可以独立进行日常运营操作</li>
              <li><strong>数据同步</strong> - 支持总部向分店同步商品、会员和供应商信息</li>
              <li><strong>资源共享</strong> - 店铺之间可以共享资源，避免重复录入</li>
              <li><strong>报表分析</strong> - 提供多维度的报表分析功能</li>
            </ul>
          </div>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="stores" label="店铺管理">
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>店铺管理</h2>
            <p>
              店铺管理功能允许管理员创建、编辑和删除店铺信息。
            </p>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>创建店铺</h3>
            <ol>
              <li>进入"店铺管理"页面</li>
              <li>点击"添加店铺"按钮</li>
              <li>填写店铺信息，包括名称、编码、地址、电话和经理</li>
              <li>设置店铺层级关系（如果需要）</li>
              <li>点击"保存"完成创建</li>
            </ol>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>编辑店铺</h3>
            <ol>
              <li>在店铺列表中找到需要编辑的店铺</li>
              <li>点击店铺行的"编辑"按钮</li>
              <li>修改相关信息</li>
              <li>点击"保存"完成编辑</li>
            </ol>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>删除店铺</h3>
            <ol>
              <li>在店铺列表中找到需要删除的店铺</li>
              <li>点击店铺行的"删除"按钮</li>
              <li>确认删除操作</li>
            </ol>
          </div>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="hierarchy" label="店铺层级">
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>店铺层级管理</h2>
            <p>
              店铺层级功能展示了所有店铺之间的层级关系，帮助管理员更好地理解店铺结构。
            </p>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>层级结构</h3>
            <ul>
              <li><strong>总部</strong> - 层级为0，是整个连锁系统的管理中心</li>
              <li><strong>一级分店</strong> - 层级为1，直接隶属于总部</li>
              <li><strong>二级分店</strong> - 层级为2，隶属于一级分店</li>
              <li><strong>更多层级</strong> - 可以根据需要创建更多层级</li>
            </ul>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>查看层级</h3>
            <ol>
              <li>进入"店铺层级"页面</li>
              <li>页面以树状结构展示所有店铺的层级关系</li>
              <li>可以展开或折叠不同层级的店铺</li>
            </ol>
          </div>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="reports" label="跨店铺报表">
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>跨店铺报表</h2>
            <p>
              跨店铺报表功能提供对所有店铺销售和库存数据的统一分析。
            </p>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>销售报表</h3>
            <ul>
              <li><strong>聚合销售报表</strong> - 显示所有店铺的总体销售数据</li>
              <li><strong>各店铺销售对比</strong> - 对比不同店铺的销售表现</li>
              <li><strong>商品销售排行</strong> - 显示畅销商品排行榜</li>
            </ul>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>库存报表</h3>
            <ul>
              <li><strong>各店铺库存对比</strong> - 对比不同店铺的库存情况</li>
              <li><strong>低库存预警</strong> - 显示库存不足的商品</li>
            </ul>
          </div>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="sharing" label="资源共享">
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>资源共享</h2>
            <p>
              资源共享功能允许店铺之间共享商品、会员和供应商信息，避免重复录入。
            </p>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>分享资源</h3>
            <ol>
              <li>进入"资源共享"页面</li>
              <li>切换到"分享资源"标签页</li>
              <li>选择需要分享的资源类型（商品、会员或供应商）</li>
              <li>选择目标店铺</li>
              <li>点击"分享"按钮</li>
            </ol>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>请求资源</h3>
            <ol>
              <li>进入"资源共享"页面</li>
              <li>切换到"请求资源"标签页</li>
              <li>选择需要请求的资源类型</li>
              <li>填写请求说明</li>
              <li>点击"发送请求"按钮</li>
            </ol>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>管理请求</h3>
            <ol>
              <li>进入"资源共享"页面</li>
              <li>切换到"收到的请求"标签页</li>
              <li>查看其他店铺的资源请求</li>
              <li>选择"批准"或"拒绝"</li>
            </ol>
          </div>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="headquarters" label="总部-分店管理">
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>总部-分店管理</h2>
            <p>
              总部-分店管理功能允许总部统一管理分店，支持数据同步和跨店铺订单。
            </p>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>管理设置</h3>
            <ul>
              <li><strong>同步产品数据</strong> - 将总部的产品数据同步到所有分店</li>
              <li><strong>同步会员数据</strong> - 将总部的会员数据同步到所有分店</li>
              <li><strong>同步供应商数据</strong> - 将总部的供应商数据同步到所有分店</li>
              <li><strong>同步价格信息</strong> - 将总部的价格信息同步到所有分店</li>
              <li><strong>同步库存信息</strong> - 将总部的库存信息同步到所有分店</li>
              <li><strong>允许跨店铺订单</strong> - 允许创建跨店铺的订单</li>
            </ul>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>数据同步</h3>
            <ol>
              <li>进入"总部-分店管理"页面</li>
              <li>切换到"管理设置"标签页</li>
              <li>启用需要同步的数据类型</li>
              <li>点击相应的同步按钮</li>
            </ol>
            
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '12px' }}>分店管理</h3>
            <ol>
              <li>进入"总部-分店管理"页面</li>
              <li>切换到"分店管理"标签页</li>
              <li>查看所有直属分店的信息</li>
            </ol>
          </div>
        </Tabs.TabPanel>
      </Tabs>
    </div>
  );
}