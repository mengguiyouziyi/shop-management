import { Component } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../store/useAppStore';
import TabBar from '../../components/tabbar';
import './index.css';

class Reports extends Component {
  goToSalesReport = () => {
    Taro.navigateTo({
      url: '/pages/reports/sales/index',
    });
  };

  goToInventoryReport = () => {
    Taro.navigateTo({
      url: '/pages/reports/inventory/index',
    });
  };

  goToMemberReport = () => {
    Taro.navigateTo({
      url: '/pages/reports/member/index',
    });
  };

  render() {
    const { products, members, orders } = this.props;

    // 计算统计数据
    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalProducts = products.length;
    const totalMembers = members.length;
    const todaySales = orders
      .filter((order) => {
        const orderDate = new Date(order.date).toDateString();
        const today = new Date().toDateString();
        return orderDate === today;
      })
      .reduce((sum, order) => sum + order.amount, 0);

    // 销售趋势数据（模拟最近7天）
    const salesTrend = [
      { day: '周一', amount: 1200 },
      { day: '周二', amount: 1500 },
      { day: '周三', amount: 1800 },
      { day: '周四', amount: 1600 },
      { day: '周五', amount: 2200 },
      { day: '周六', amount: 2800 },
      { day: '周日', amount: 2500 },
    ];

    // 热销商品（模拟）
    const topProducts = products
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map((product) => ({
        ...product,
        revenue: product.sales * product.price,
      }));

    return (
      <View className="reports">
        {/* 页面标题 */}
        <View className="header-section">
          <Text className="title">数据报表</Text>
          <Text className="subtitle">实时掌握店铺运营状况</Text>
        </View>
        {/* 统计卡片 */}
        <View className="stats-grid-enhanced">
          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #1890ff' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(24, 144, 255, 0.1)' }}
              >
                <Text className="stat-icon">💰</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">总销售额</Text>
                <Text className="stat-value-enhanced">¥{totalSales.toFixed(0)}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #52c41a' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(82, 196, 26, 0.1)' }}
              >
                <Text className="stat-icon">📦</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">商品总数</Text>
                <Text className="stat-value-enhanced">{totalProducts}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #722ed1' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(114, 46, 209, 0.1)' }}
              >
                <Text className="stat-icon">👥</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">会员总数</Text>
                <Text className="stat-value-enhanced">{totalMembers}</Text>
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
                <Text className="stat-label-enhanced">今日销售</Text>
                <Text className="stat-value-enhanced">¥{todaySales.toFixed(0)}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* 报表类型选择 */}
        <View className="reports-section">
          <Text className="section-title">报表类型</Text>
          <View className="report-types-grid">
            <View className="report-type-card" onClick={this.goToSalesReport}>
              <View
                className="report-icon"
                style={{ backgroundColor: 'rgba(24, 144, 255, 0.1)', color: '#1890ff' }}
              >
                📈
              </View>
              <Text className="report-title">销售报表</Text>
              <Text className="report-desc">查看销售数据和趋势分析</Text>
            </View>

            <View className="report-type-card" onClick={this.goToInventoryReport}>
              <View
                className="report-icon"
                style={{ backgroundColor: 'rgba(82, 196, 26, 0.1)', color: '#52c41a' }}
              >
                📊
              </View>
              <Text className="report-title">库存报表</Text>
              <Text className="report-desc">查看库存状况和预警信息</Text>
            </View>

            <View className="report-type-card" onClick={this.goToMemberReport}>
              <View
                className="report-icon"
                style={{ backgroundColor: 'rgba(114, 46, 209, 0.1)', color: '#722ed1' }}
              >
                👥
              </View>
              <Text className="report-title">会员报表</Text>
              <Text className="report-desc">查看会员数据和消费分析</Text>
            </View>
          </View>
        </View>
        {/* 销售趋势图表 */}
        <View className="reports-section">
          <Text className="section-title">最近7天销售趋势</Text>
          <View className="chart-container">
            <View className="chart-bars">
              {salesTrend.map((item, index) => (
                <View className="chart-bar-container" key={index}>
                  <View
                    className="chart-bar"
                    style={{ height: `${(item.amount / 3000) * 100}%` }}
                  ></View>
                  <Text className="chart-label">{item.day}</Text>
                  <Text className="chart-value">¥{item.amount}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={{ height: 60 }}></View> {/* 为TabBar留出空间 */}
        <TabBar currentPath="/pages/reports/index" />
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function ReportsWrapper() {
  const { products, members, orders } = useAppStore();
  return <Reports products={products} members={members} orders={orders} />;
}

export default ReportsWrapper;
