import { Component } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../../store/useAppStore';
import './index.css';

class POS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      memberSearchTerm: '',
      productSearchTerm: '',
      filteredProducts: [],
      filteredMembers: [],
      totalPrice: 0,
      customerPayment: '',
      changeAmount: 0,
      activeTab: 'products', // products or cart
      showCheckoutModal: false,
      // 添加购物车宽度控制
      cartWidth: '30%', // 初始宽度
    };
  }

  componentDidMount() {
    const { products, members } = this.props;
    this.setState({ filteredProducts: products, filteredMembers: members });
  }

  handleMemberSearch = (e) => {
    const searchTerm = e.detail.value.toLowerCase();
    const { members } = this.props;

    const filteredMembers = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm) || member.phone.includes(searchTerm)
    );

    this.setState({ memberSearchTerm: searchTerm, filteredMembers });
  };

  handleProductSearch = (e) => {
    const searchTerm = e.detail.value.toLowerCase();
    const { products } = this.props;

    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.barcode?.includes(searchTerm)
    );

    this.setState({ productSearchTerm: searchTerm, filteredProducts });
  };

  addToCart = (product) => {
    const { cart } = this.state;
    const existingItem = cart.find((item) => item.id === product.id);

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      );
    } else {
      newCart = [
        ...cart,
        {
          ...product,
          quantity: 1,
          subtotal: product.price,
        },
      ];
    }

    const totalPrice = newCart.reduce((sum, item) => sum + item.subtotal, 0);

    this.setState({
      cart: newCart,
      totalPrice,
      activeTab: 'cart', // 添加商品后自动切换到购物车
    });

    // 显示添加成功的提示
    Taro.showToast({
      title: '已添加到购物车',
      icon: 'success',
      duration: 1000,
    });
  };

  updateQuantity = (id, quantity) => {
    const { cart } = this.state;

    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }

    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity, subtotal: quantity * item.price } : item
    );

    const totalPrice = newCart.reduce((sum, item) => sum + item.subtotal, 0);

    this.setState({ cart: newCart, totalPrice });
  };

  removeFromCart = (id) => {
    const { cart } = this.state;
    const newCart = cart.filter((item) => item.id !== id);
    const totalPrice = newCart.reduce((sum, item) => sum + item.subtotal, 0);

    this.setState({ cart: newCart, totalPrice });
  };

  handlePaymentInput = (e) => {
    const customerPayment = e.detail.value;
    const { totalPrice } = this.state;

    const changeAmount = customerPayment ? parseFloat(customerPayment) - totalPrice : 0;

    this.setState({ customerPayment, changeAmount });
  };

  processCheckout = () => {
    const { cart, totalPrice, customerPayment, changeAmount } = this.state;
    const { addOrder } = this.props;

    if (cart.length === 0) {
      Taro.showToast({
        title: '购物车为空',
        icon: 'none',
      });
      return;
    }

    if (!customerPayment) {
      Taro.showToast({
        title: '请输入收款金额',
        icon: 'none',
      });
      return;
    }

    if (changeAmount < 0) {
      Taro.showToast({
        title: '收款金额不足',
        icon: 'none',
      });
      return;
    }

    // 创建订单
    const newOrder = {
      id: Date.now().toString(),
      customer: '现场客户',
      amount: totalPrice,
      date: new Date().toLocaleString(),
      status: 'completed',
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    addOrder(newOrder);

    // 显示收银结果
    Taro.showModal({
      title: '收银成功',
      content: `总计: ¥${totalPrice.toFixed(2)}\n收款: ¥${parseFloat(customerPayment).toFixed(2)}\n找零: ¥${changeAmount.toFixed(2)}`,
      showCancel: false,
      confirmText: '确定',
    });

    // 清空购物车
    this.setState({
      cart: [],
      totalPrice: 0,
      customerPayment: '',
      changeAmount: 0,
      showCheckoutModal: false,
      activeTab: 'products',
    });
  };

  toggleCheckoutModal = () => {
    const { showCheckoutModal } = this.state;
    this.setState({ showCheckoutModal: !showCheckoutModal });
  };

  // 新增方法：调整购物车宽度
  adjustCartWidth = () => {
    const { activeTab } = this.state;
    if (activeTab === 'cart') {
      this.setState({ cartWidth: '45%' });
    } else {
      this.setState({ cartWidth: '30%' });
    }
  };

  switchTab = (tab) => {
    this.setState({ activeTab: tab }, () => {
      this.adjustCartWidth();
    });
  };

  render() {
    const { searchTerm, searchResults } = this.state;

    return (
      <View className="pos">
        {/* 页面标题和操作栏 */}
        <View className="pos-header">
          <Text className="title">POS收银系统</Text>
          <Text className="subtitle">快速收银结账服务</Text>
          <Text className="time">{new Date().toLocaleTimeString()}</Text>
        </View>

        {/* 搜索栏 */}
        <View className="search-section">
          <Input
            className="search-input"
            placeholder="搜索商品名称或分类..."
            value={this.state.productSearchTerm}
            onInput={this.handleProductSearch}
          />
          <Input
            className="search-input"
            placeholder="搜索会员姓名或手机号..."
            value={this.state.memberSearchTerm}
            onInput={this.handleMemberSearch}
          />
        </View>

        {/* 主要内容区域 */}
        <View className="main-content">
          {/* 会员选择区 */}
          <View className="members-section">
            <Text className="section-title">选择会员</Text>
            <ScrollView className="member-scroll">
              {this.state.filteredMembers.map((member) => (
                <View key={member.id} className="member-item">
                  <Text>{member.name}</Text>
                  <Text>{member.phone}</Text>
                  <Text>余额: ¥{member.balance}</Text>
                  <Text>积分: {member.points}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 商品列表区 */}
          <View className="products-section">
            <Text className="section-title">商品列表</Text>
            <ScrollView className="products-scroll">
              {this.state.filteredProducts.map((product) => (
                <View
                  key={product.id}
                  className="product-item"
                  onClick={() => this.addToCart(product)}
                >
                  <Image
                    src={`https://placehold.co/100x100?text=${product.name}`}
                    alt={product.name}
                    crossOrigin="anonymous"
                  />
                  <Text>{product.name}</Text>
                  <Text>¥{product.price}</Text>
                  <Text>库存: {product.stock}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 购物车区 */}
          <View className="cart-section">
            <Text className="section-title">购物车</Text>
            <ScrollView className="cart-scroll">
              {this.state.cart.map((item) => (
                <View key={item.id} className="cart-item">
                  <Text>{item.name}</Text>
                  <Text>数量: {item.quantity}</Text>
                  <Text>小计: ¥{item.subtotal}</Text>
                  <Button onClick={() => this.removeFromCart(item.id)}>移除</Button>
                </View>
              ))}
              {!this.state.cart.length && <Text className="empty-cart">购物车为空</Text>}
            </ScrollView>
            <View className="cart-footer">
              <Text>总价: ¥{this.state.totalPrice}</Text>
              <Input
                className="customer-payment"
                placeholder="请输入收款金额..."
                value={this.state.customerPayment}
                onInput={this.handlePaymentInput}
              />
              <Text>找零: ¥{this.state.changeAmount}</Text>
              <Button onClick={this.processCheckout}>结算</Button>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default POS;
