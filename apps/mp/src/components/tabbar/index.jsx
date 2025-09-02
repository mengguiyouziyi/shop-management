import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.css'

export default class TabBar extends Component {
  handleClick = (path) => {
    // 页面跳转
    console.log('跳转到页面:', path);
  }

  render() {
    const { currentPath } = this.props;
    
    const tabs = [
      { id: 'home', title: '首页', path: '/pages/index/index' },
      { id: 'products', title: '商品', path: '/pages/products/list/index' },
      { id: 'orders', title: '订单', path: '/pages/orders/list/index' },
      { id: 'members', title: '会员', path: '/pages/members/list/index' }
    ];
    
    return (
      <View className='tab-bar'>
        {tabs.map(tab => (
          <View 
            className={`tab-item ${currentPath.includes(tab.id) ? 'active' : ''}`} 
            key={tab.id}
            onClick={() => this.handleClick(tab.path)}
          >
            <Text className='tab-title'>{tab.title}</Text>
          </View>
        ))}
      </View>
    )
  }
}