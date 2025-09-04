import { Component } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../store/useAppStore';
import TabBar from '../../components/tabbar';
import './index.css';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      searchResults: {
        products: [],
        members: [],
        orders: [],
      },
    };
  }

  handleSearch = (e) => {
    const searchTerm = e.detail.value.toLowerCase();
    this.setState({ searchTerm });

    if (searchTerm.length > 0) {
      const { products, members, orders } = this.props;

      // 搜索商品
      const productResults = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.id.includes(searchTerm)
      );

      // 搜索会员
      const memberResults = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm) ||
          member.phone.includes(searchTerm) ||
          member.id.includes(searchTerm)
      );

      // 搜索订单
      const orderResults = orders.filter(
        (order) =>
          order.id.includes(searchTerm) || order.customer.toLowerCase().includes(searchTerm)
      );

      this.setState({
        searchResults: {
          products: productResults.slice(0, 5), // 限制结果数量
          members: memberResults.slice(0, 5),
          orders: orderResults.slice(0, 5),
        },
      });
    } else {
      this.setState({
        searchResults: {
          products: [],
          members: [],
          orders: [],
        },
      });
    }
  };

  goToProductDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/products/detail/index?id=${id}`,
    });
  };

  goToMemberDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/members/detail/index?id=${id}`,
    });
  };

  goToOrderDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/orders/detail/index?id=${id}`,
    });
  };

  getStatusName = (status) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'pending':
        return '待处理';
      case 'cancelled':
        return '已取消';
      case 'shipped':
        return '已发货';
      default:
        return '未知';
    }
  };

  getLevelName = (level) => {
    switch (level) {
      case 1:
        return '普通会员';
      case 2:
        return '银卡会员';
      case 3:
        return '金卡会员';
      case 4:
        return '钻石会员';
      default:
        return '普通会员';
    }
  };

  render() {
    const { searchTerm, searchResults } = this.state;

    return (
      <View className="search">
        <View className="search-header">
          <Input
            className="search-input"
            placeholder="搜索商品、会员或订单..."
            value={searchTerm}
            onInput={this.handleSearch}
            focus
          />
        </View>
        <ScrollView className="search-results">
          {searchTerm.length > 0 && (
            <View>
              {/* 商品搜索结果 */}
              {searchResults.products.length > 0 && (
                <View className="result-section">
                  <Text className="section-title">商品</Text>
                  {searchResults.products.map((product) => (
                    <View
                      className="result-item product-item"
                      key={product.id}
                      onClick={() => this.goToProductDetail(product.id)}
                    >
                      <Text className="item-name">{product.name}</Text>
                      <Text className="item-info">
                        ¥{product.price} | 库存: {product.stock}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 会员搜索结果 */}
              {searchResults.members.length > 0 && (
                <View className="result-section">
                  <Text className="section-title">会员</Text>
                  {searchResults.members.map((member) => (
                    <View
                      className="result-item member-item"
                      key={member.id}
                      onClick={() => this.goToMemberDetail(member.id)}
                    >
                      <Text className="item-name">{member.name}</Text>
                      <Text className="item-info">
                        {member.phone} | {this.getLevelName(member.level)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 订单搜索结果 */}
              {searchResults.orders.length > 0 && (
                <View className="result-section">
                  <Text className="section-title">订单</Text>
                  {searchResults.orders.map((order) => (
                    <View
                      className="result-item order-item"
                      key={order.id}
                      onClick={() => this.goToOrderDetail(order.id)}
                    >
                      <Text className="item-name">订单号: {order.id}</Text>
                      <Text className="item-info">
                        {order.customer} | ¥{order.amount} | {this.getStatusName(order.status)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 无搜索结果 */}
              {searchResults.products.length === 0 &&
                searchResults.members.length === 0 &&
                searchResults.orders.length === 0 && (
                  <View className="no-results">
                    <Text className="no-results-text">未找到相关结果</Text>
                  </View>
                )}
            </View>
          )}

          {searchTerm.length === 0 && (
            <View className="search-tips">
              <Text className="empty-text">请输入关键词搜索商品或会员</Text>
            </View>
          )}
        </ScrollView>
        <View style={{ height: 60 }}></View> {/* 为TabBar留出空间 */}
        <TabBar currentPath="/pages/search/index" />
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function SearchWrapper() {
  const { products, members, orders } = useAppStore();
  return <Search products={products} members={members} orders={orders} />;
}

export default SearchWrapper;
