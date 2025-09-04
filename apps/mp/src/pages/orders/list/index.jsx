import { Component } from 'react';
import { View, Text, Button, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../../store/useAppStore';
import TabBar from '../../../components/tabbar';
import './index.css';

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      statusFilter: 'all',
    };
  }

  goToCreate = () => {
    Taro.navigateTo({
      url: '/pages/orders/create/index',
    });
  };

  goToDetail = (id) => {
    Taro.navigateTo({
      url: '/pages/orders/detail/index?id=' + id,
    });
  };

  handleSearch = (e) => {
    const searchTerm = e.detail.value;
    this.setState({ searchTerm });
  };

  handleStatusFilter = (status) => {
    this.setState({ statusFilter: status });
  };

  getOrderStatusText = (status) => {
    const statusMap = {
      pending: '待处理',
      processing: '处理中',
      completed: '已完成',
      cancelled: '已取消',
    };
    return statusMap[status] || status;
  };

  getOrderStatusColor = (status) => {
    const colorMap = {
      pending: '#fa8c16',
      processing: '#1890ff',
      completed: '#52c41a',
      cancelled: '#ff4d4f',
    };
    return colorMap[status] || '#666';
  };

  onPullDownRefresh = () => {
    // 模拟刷新数据
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({
        title: '刷新成功',
        icon: 'success',
      });
    }, 1000);
  };

  render() {
    const { searchTerm, statusFilter } = this.state;
    const { orders } = this.props;

    const filteredOrders = orders.filter((order) => {
      const matchesSearch =
        order.id.includes(searchTerm) || (order.customer && order.customer.includes(searchTerm));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // 计算统计数据
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.date).toDateString();
      const today = new Date().toDateString();
      return orderDate === today;
    }).length;
    const pendingOrders = orders.filter((order) => order.status === 'pending').length;

    return (
      <View className="order-list">
        {/* 页面标题和操作栏 */}
        <View className="header-section">
          <Text className="title">订单管理</Text>
          <Button className="create-btn" onClick={this.goToCreate}>
            ➕ 创建订单
          </Button>
        </View>
        {/* 搜索和筛选栏 */}
        <View className="search-filter-container">
          <Input
            className="search-input"
            placeholder="搜索订单号或客户..."
            value={searchTerm}
            onInput={this.handleSearch}
          />

          <View className="filter-tabs">
            <Button
              className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => this.handleStatusFilter('all')}
            >
              全部
            </Button>
            <Button
              className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => this.handleStatusFilter('pending')}
            >
              待处理
            </Button>
            <Button
              className={`filter-tab ${statusFilter === 'processing' ? 'active' : ''}`}
              onClick={() => this.handleStatusFilter('processing')}
            >
              处理中
            </Button>
            <Button
              className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => this.handleStatusFilter('completed')}
            >
              已完成
            </Button>
          </View>
        </View>
        {/* 统计卡片 */}
        <View className="stats-grid-enhanced">
          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #1890ff' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(24, 144, 255, 0.1)' }}
              >
                <Text className="stat-icon">📋</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">订单总数</Text>
                <Text className="stat-value-enhanced">{totalOrders}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #52c41a' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(82, 196, 26, 0.1)' }}
              >
                <Text className="stat-icon">💰</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">总销售额</Text>
                <Text className="stat-value-enhanced">¥{totalSales.toFixed(0)}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #fa8c16' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(250, 140, 22, 0.1)' }}
              >
                <Text className="stat-icon">⏰</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">今日订单</Text>
                <Text className="stat-value-enhanced">{todayOrders}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #ff4d4f' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(255, 77, 79, 0.1)' }}
              >
                <Text className="stat-icon">⚠️</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">待处理</Text>
                <Text className="stat-value-enhanced">{pendingOrders}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* 订单列表 */}
        <ScrollView
          className="order-scroll"
          enablePullDownRefresh
          onPullDownRefresh={this.onPullDownRefresh}
        >
          <View className="order-list-container">
            {filteredOrders.map((order) => (
              <View
                className="order-item-enhanced"
                key={order.id}
                onClick={() => this.goToDetail(order.id)}
              >
                <View className="order-header">
                  <Text className="order-id">#{order.id}</Text>
                  <View
                    className="order-status"
                    style={{ color: this.getOrderStatusColor(order.status) }}
                  >
                    {this.getOrderStatusText(order.status)}
                  </View>
                </View>

                <View className="order-details">
                  <View className="order-customer">
                    <Text className="label">客户:</Text>
                    <Text className="value">{order.customer || '匿名客户'}</Text>
                  </View>

                  <View className="order-amount">
                    <Text className="label">金额:</Text>
                    <Text className="value amount">¥{order.amount.toFixed(2)}</Text>
                  </View>

                  <View className="order-date">
                    <Text className="label">时间:</Text>
                    <Text className="value">{order.date}</Text>
                  </View>

                  {order.items && order.items.length > 0 && (
                    <View className="order-items">
                      <Text className="label">商品:</Text>
                      <View className="items-list">
                        {order.items.slice(0, 2).map((item, index) => (
                          <Text key={index} className="item">
                            {item.name} x {item.quantity}
                          </Text>
                        ))}
                        {order.items.length > 2 && (
                          <Text className="more-items">+{order.items.length - 2} 更多</Text>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {filteredOrders.length === 0 && (
            <View className="empty-state">
              <Text className="empty-icon">📋</Text>
              <Text className="empty-text">
                {searchTerm || statusFilter !== 'all' ? '没有找到匹配的订单' : '还没有订单记录'}
              </Text>
            </View>
          )}
        </ScrollView>
        <View style={{ height: 60 }}></View> {/* 为TabBar留出空间 */}
        <TabBar currentPath="/pages/orders/list/index" />
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function OrderListWrapper() {
  const { orders } = useAppStore();
  return <OrderList orders={orders} />;
}

export default OrderListWrapper;
