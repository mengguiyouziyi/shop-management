import { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../../store/useAppStore';
import './index.css';

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
    };
  }

  componentDidMount() {
    // 获取订单详情
    const { orders } = this.props;
    const orderId = Taro.getCurrentInstance().router.params.id;
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      this.setState({ order });
    }
  }

  updateStatus = (newStatus) => {
    const { updateOrder } = this.props;
    const { order } = this.state;

    // 更新订单状态
    updateOrder(order.id, {
      ...order,
      status: newStatus,
    });

    this.setState({
      order: {
        ...order,
        status: newStatus,
      },
    });

    Taro.showToast({
      title: '订单状态已更新',
      icon: 'success',
    });
  };

  contactCustomer = () => {
    Taro.makePhoneCall({
      phoneNumber: this.state.order.phone || '13800138000', // 使用默认号码如果未提供
    }).catch(() => {
      Taro.showToast({
        title: '无法联系客户',
        icon: 'none',
      });
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

  getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'cancelled';
      case 'shipped':
        return 'shipped';
      default:
        return '';
    }
  };

  render() {
    const { order } = this.state;

    if (!order) {
      return (
        <View className="order-detail">
          <Text>订单不存在</Text>
        </View>
      );
    }

    // 模拟订单商品项
    const orderItems = [
      { id: '1', name: '苹果iPhone 15', price: 5999, quantity: 2, subtotal: 11998 },
      { id: '2', name: '小米手机', price: 1499, quantity: 1, subtotal: 1499 },
    ];

    return (
      <View className="order-detail">
        <View className="order-header">
          <Text className="order-id">订单号: {order.id}</Text>
          <Text className={`order-status ${this.getStatusClass(order.status)}`}>
            {this.getStatusName(order.status)}
          </Text>
        </View>

        <View className="customer-info">
          <View className="info-item">
            <Text className="info-label">客户:</Text>
            <Text className="info-value">{order.customer}</Text>
          </View>

          <View className="info-item">
            <Text className="info-label">电话:</Text>
            <Text className="info-value">{order.phone || '未知'}</Text>
          </View>

          <View className="info-item">
            <Text className="info-label">地址:</Text>
            <Text className="info-value">{order.address || '未知'}</Text>
          </View>

          <View className="info-item">
            <Text className="info-label">下单时间:</Text>
            <Text className="info-value">{order.date}</Text>
          </View>
        </View>

        <View className="order-items">
          <Text className="section-title">商品信息</Text>
          {orderItems.map((item) => (
            <View className="item" key={item.id}>
              <View className="item-info">
                <Text className="item-name">{item.name}</Text>
                <Text className="item-price">
                  ¥{item.price} × {item.quantity}
                </Text>
              </View>
              <Text className="item-subtotal">¥{item.subtotal}</Text>
            </View>
          ))}
        </View>

        <View className="order-summary">
          <View className="summary-item">
            <Text className="summary-label">总金额:</Text>
            <Text className="summary-value">¥{order.amount}</Text>
          </View>

          <View className="summary-item">
            <Text className="summary-label">支付方式:</Text>
            <Text className="summary-value">在线支付</Text>
          </View>

          <View className="summary-item">
            <Text className="summary-label">配送方式:</Text>
            <Text className="summary-value">快递配送</Text>
          </View>
        </View>

        <View className="action-buttons">
          <Button className="contact-btn" onClick={this.contactCustomer}>
            联系客户
          </Button>

          {order.status === 'pending' && (
            <View className="status-buttons">
              <Button className="ship-btn" onClick={() => this.updateStatus('shipped')}>
                发货
              </Button>
              <Button className="cancel-btn" onClick={() => this.updateStatus('cancelled')}>
                取消订单
              </Button>
            </View>
          )}

          {order.status === 'shipped' && (
            <Button className="complete-btn" onClick={() => this.updateStatus('completed')}>
              完成订单
            </Button>
          )}
        </View>
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function OrderDetailWrapper() {
  const { orders, updateOrder } = useAppStore();
  return <OrderDetail orders={orders} updateOrder={updateOrder} />;
}

export default OrderDetailWrapper;
