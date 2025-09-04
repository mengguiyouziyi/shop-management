import { Component } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../store/useAppStore';
import TabBar from '../../components/tabbar';
import './index.css';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  // 处理搜索输入
  handleSearch = (e) => {
    const searchTerm = e.detail.value;
    this.setState({ searchTerm });

    // 如果需要跳转到搜索页面，可以在这里实现
    if (searchTerm.length > 0) {
      // 可以添加搜索逻辑
    }
  };

  // 跳转到商品管理页面
  goToProducts = () => {
    Taro.switchTab({
      url: '/pages/products/list/index',
    });
  };

  // 跳转到订单管理页面
  goToOrders = () => {
    Taro.switchTab({
      url: '/pages/orders/list/index',
    });
  };

  // 跳转到会员管理页面
  goToMembers = () => {
    Taro.switchTab({
      url: '/pages/members/list/index',
    });
  };

  // 跳转到搜索页面
  goToSearch = () => {
    Taro.switchTab({
      url: '/pages/search/index',
    });
  };

  // 跳转到统计页面
  goToReports = () => {
    Taro.switchTab({
      url: '/pages/reports/index',
    });
  };

  // 跳转到POS收银页面
  goToPOS = () => {
    Taro.navigateTo({
      url: '/pages/orders/pos/index',
    });
  };

  render() {
    const { products, members, orders } = this.props;
    const { searchTerm } = this.state;

    // 计算统计数据
    const stats = {
      totalProducts: products.length,
      totalMembers: members.length,
      totalOrders: orders.length,
      totalSales: orders.reduce((sum, order) => sum + order.amount, 0),
      todayOrders: orders.filter((order) => {
        const orderDate = new Date(order.date.replace(/-/g, '/')).toDateString();
        const today = new Date().toDateString();
        return orderDate === today;
      }).length,
      todaySales: orders
        .filter((order) => {
          const orderDate = new Date(order.date.replace(/-/g, '/')).toDateString();
          const today = new Date().toDateString();
          return orderDate === today;
        })
        .reduce((sum, order) => sum + order.amount, 0),
      lowStock: products.filter((product) => product.stock <= product.minStock).length,
      pendingOrders: orders.filter((order) => order.status === 'pending').length,
    };

    // 快捷操作
    const quickActions = [
      {
        id: 'products',
        title: '商品管理',
        description: '添加、编辑和删除商品信息',
        icon: '📦',
        color: '#1890ff',
        action: this.goToProducts,
      },
      {
        id: 'members',
        title: '会员管理',
        description: '管理会员信息和积分',
        icon: '👥',
        color: '#52c41a',
        action: this.goToMembers,
      },
      {
        id: 'orders',
        title: '订单管理',
        description: '查看和处理订单',
        icon: '📋',
        color: '#fa8c16',
        action: this.goToOrders,
      },
      {
        id: 'pos',
        title: 'POS收银',
        description: '快速收银结账服务',
        icon: '💰',
        color: '#722ed1',
        action: this.goToPOS,
      },
      {
        id: 'reports',
        title: '数据统计',
        description: '查看业务统计数据',
        icon: '📊',
        color: '#722ed1',
        action: this.goToReports,
      },
    ];

    return (
      <View className="index">
        {/* 头部欢迎区域 */}
        <View className="header-gradient">
          <Text className="welcome-text">欢迎使用店铺管理系统</Text>
          <Text className="subtitle">实时掌握店铺运营状况，高效管理业务流程</Text>
        </View>
        {/* 搜索栏 */}
        <View className="search-container">
          <Input
            className="search-input"
            placeholder="搜索商品、会员或订单..."
            value={searchTerm}
            onInput={this.handleSearch}
          />
        </View>
        {/* 统计卡片 - 更接近Web端设计 */}
        <View className="stats-grid-enhanced">
          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #1890ff' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(24, 144, 255, 0.1)' }}
              >
                <Text className="stat-icon">📦</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">商品总数</Text>
                <Text className="stat-value-enhanced">{stats.totalProducts}</Text>
                <Text className="stat-trend positive">↑ 12% 较上月</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #52c41a' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(82, 196, 26, 0.1)' }}
              >
                <Text className="stat-icon">👥</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">会员总数</Text>
                <Text className="stat-value-enhanced">{stats.totalMembers}</Text>
                <Text className="stat-trend positive">↑ 8% 较上月</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #fa8c16' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(250, 140, 22, 0.1)' }}
              >
                <Text className="stat-icon">📋</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">订单总数</Text>
                <Text className="stat-value-enhanced">{stats.totalOrders}</Text>
                <Text className="stat-trend positive">↑ 5% 较上月</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #722ed1' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(114, 46, 209, 0.1)' }}
              >
                <Text className="stat-icon">💰</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">总销售额</Text>
                <Text className="stat-value-enhanced">¥{stats.totalSales.toFixed(0)}</Text>
                <Text className="stat-trend positive">↑ 15% 较上月</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #13c2c2' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(19, 194, 194, 0.1)' }}
              >
                <Text className="stat-icon">⏰</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">今日订单</Text>
                <Text className="stat-value-enhanced">{stats.todayOrders}</Text>
                <Text className="stat-trend positive">↑ 3% 今日</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #f5222d' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(245, 34, 45, 0.1)' }}
              >
                <Text className="stat-icon">⚠️</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">库存不足</Text>
                <Text className="stat-value-enhanced">{stats.lowStock}</Text>
                <Text className="stat-trend negative">需要补货</Text>
              </View>
            </View>
          </View>
        </View>
        {/* 快捷操作 */}
        <View className="quick-actions">
          <Text className="section-title">快捷操作</Text>
          <View className="actions-grid">
            {quickActions.map((action) => (
              <View key={action.id} className="action-item-enhanced" onClick={action.action}>
                <Text
                  className="action-icon-enhanced"
                  style={{ color: action.color, backgroundColor: action.color + '10' }}
                >
                  {action.icon}
                </Text>
                <Text className="action-title-enhanced">{action.title}</Text>
                <Text className="action-desc-enhanced">{action.description}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 60 }}></View> {/* 为TabBar留出空间 */}
        <TabBar currentPath="/pages/index/index" />
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function IndexWrapper() {
  const { products, members, orders } = useAppStore();
  return <Index products={products} members={members} orders={orders} />;
}

export default IndexWrapper;
