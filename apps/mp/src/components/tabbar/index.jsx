import { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.css';

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMoreMenu: false,
    };
  }

  toggleMoreMenu = () => {
    this.setState((prevState) => ({
      showMoreMenu: !prevState.showMoreMenu,
    }));
  };

  navigateTo = (url) => {
    if (this.props.currentPath !== url) {
      if (url.startsWith('/pages/')) {
        Taro.switchTab({ url });
      } else {
        Taro.navigateTo({ url });
      }
    }
    this.setState({ showMoreMenu: false });
  };

  render() {
    const { currentPath } = this.props;
    const { showMoreMenu } = this.state;

    // 主要导航项（显示在底部导航栏）
    const mainTabs = [
      {
        id: 'home',
        title: '首页',
        url: '/pages/index/index',
        icon: '🏠',
      },
      {
        id: 'products',
        title: '商品',
        url: '/pages/products/list/index',
        icon: '📦',
      },
      {
        id: 'orders',
        title: '订单',
        url: '/pages/orders/list/index',
        icon: '📋',
      },
      {
        id: 'members',
        title: '会员',
        url: '/pages/members/list/index',
        icon: '👥',
      },
      {
        id: 'more',
        title: '更多',
        url: '#',
        icon: '⋯',
        action: this.toggleMoreMenu,
      },
    ];

    // 更多菜单项（在折叠菜单中显示）
    const moreTabs = [
      {
        id: 'reports',
        title: '数据报表',
        url: '/pages/reports/index',
        icon: '📊',
      },
      {
        id: 'pos',
        title: 'POS收银',
        url: '/pages/orders/pos/index',
        icon: '💰',
      },
      {
        id: 'search',
        title: '搜索',
        url: '/pages/search/index',
        icon: '🔍',
      },
      {
        id: 'settings',
        title: '设置',
        url: '/pages/settings/index',
        icon: '⚙️',
      },
    ];

    return (
      <View className="tabbar-container">
        {/* 主要导航栏 */}
        <View className="tabbar">
          {mainTabs.map((tab) => (
            <View
              key={tab.id}
              className={`tabbar-item ${currentPath === tab.url ? 'active' : ''}`}
              onClick={tab.action || (() => this.navigateTo(tab.url))}
            >
              <Text className="tabbar-icon">{tab.icon}</Text>
              <Text className="tabbar-text">{tab.title}</Text>
            </View>
          ))}
        </View>

        {/* 更多功能菜单（折叠） */}
        {showMoreMenu && (
          <View className="more-menu-overlay" onClick={this.toggleMoreMenu}>
            <View className="more-menu" onClick={(e) => e.stopPropagation()}>
              <View className="more-menu-header">
                <Text className="more-menu-title">更多功能</Text>
                <Button className="close-btn" onClick={this.toggleMoreMenu}>
                  ×
                </Button>
              </View>
              <View className="more-menu-content">
                {moreTabs.map((tab) => (
                  <View
                    key={tab.id}
                    className={`more-menu-item ${currentPath === tab.url ? 'active' : ''}`}
                    onClick={() => this.navigateTo(tab.url)}
                  >
                    <Text className="more-menu-icon">{tab.icon}</Text>
                    <Text className="more-menu-text">{tab.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default TabBar;
