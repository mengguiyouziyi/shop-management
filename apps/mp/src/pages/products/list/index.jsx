import { Component } from 'react';
import { View, Text, Button, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../../store/useAppStore';
import TabBar from '../../../components/tabbar';
import './index.css';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  goToCreate = () => {
    Taro.navigateTo({
      url: '/pages/products/create/index',
    });
  };

  goToDetail = (id) => {
    Taro.navigateTo({
      url: '/pages/products/detail/index?id=' + id,
    });
  };

  handleSearch = (e) => {
    const searchTerm = e.detail.value;
    this.setState({ searchTerm });
  };

  getStockStatus = (stock, minStock) => {
    if (stock === 0) {
      return { text: '缺货', color: '#ff4d4f' };
    } else if (stock <= minStock) {
      return { text: '库存不足', color: '#fa8c16' };
    }
    return { text: '正常', color: '#52c41a' };
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
    const { searchTerm } = this.state;
    const { products } = this.props;

    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 计算统计数据
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStockProducts = products.filter((p) => p.stock <= p.minStock).length;

    return (
      <View className="product-list">
        {/* 页面标题和操作栏 */}
        <View className="header-section">
          <Text className="title">商品管理</Text>
          <Button className="create-btn" onClick={this.goToCreate}>
            ➕ 创建商品
          </Button>
        </View>
        {/* 搜索栏 */}
        <View className="search-container">
          <Input
            className="search-input"
            placeholder="搜索商品名称或分类..."
            value={searchTerm}
            onInput={this.handleSearch}
          />
          <Text className="search-result">找到 {filteredProducts.length} 个商品</Text>
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
                <Text className="stat-value-enhanced">{totalProducts}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #52c41a' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(82, 196, 26, 0.1)' }}
              >
                <Text className="stat-icon">📊</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">总库存</Text>
                <Text className="stat-value-enhanced">{totalStock}</Text>
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
                <Text className="stat-label-enhanced">总价值</Text>
                <Text className="stat-value-enhanced">¥{totalValue.toFixed(0)}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #fa8c16' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(250, 140, 22, 0.1)' }}
              >
                <Text className="stat-icon">⚠️</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">库存不足</Text>
                <Text className="stat-value-enhanced">{lowStockProducts}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* 商品列表 */}
        <ScrollView
          className="product-scroll"
          enablePullDownRefresh
          onPullDownRefresh={this.onPullDownRefresh}
        >
          <View className="product-grid">
            {filteredProducts.map((product) => {
              const stockStatus = this.getStockStatus(product.stock, product.minStock);
              return (
                <View
                  className="product-item-enhanced"
                  key={product.id}
                  onClick={() => this.goToDetail(product.id)}
                >
                  <View className="product-header">
                    <Text className="product-name-enhanced">{product.name}</Text>
                    <View className="stock-badge" style={{ backgroundColor: stockStatus.color }}>
                      {stockStatus.text}
                    </View>
                  </View>

                  <Text className="product-category-enhanced">{product.category}</Text>

                  <View className="product-details-row">
                    <Text className="product-price-enhanced">¥{product.price.toFixed(2)}</Text>
                    <Text className="product-stock-enhanced">库存: {product.stock}</Text>
                  </View>

                  {product.description && (
                    <Text className="product-description-enhanced" numberOfLines={1}>
                      {product.description}
                    </Text>
                  )}

                  <View className="product-footer">
                    <Text className="min-stock-info">最低库存: {product.minStock}</Text>
                    <View className="product-actions">
                      <Button
                        className="action-btn edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          Taro.showToast({
                            title: '编辑功能待实现',
                            icon: 'none',
                          });
                        }}
                      >
                        编辑
                      </Button>
                      <Button
                        className="action-btn delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          Taro.showModal({
                            title: '确认删除',
                            content: '确定要删除这个商品吗？',
                            success: (res) => {
                              if (res.confirm) {
                                Taro.showToast({
                                  title: '已删除',
                                  icon: 'success',
                                });
                              }
                            },
                          });
                        }}
                      >
                        删除
                      </Button>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {filteredProducts.length === 0 && (
            <View className="empty-state">
              <Text className="empty-icon">📦</Text>
              <Text className="empty-text">暂无商品数据</Text>
            </View>
          )}
        </ScrollView>
        <View style={{ height: 60 }}></View> {/* 为TabBar留出空间 */}
        <TabBar currentPath="/pages/products/list/index" />
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function ProductListWrapper() {
  const { products } = useAppStore();
  return <ProductList products={products} />;
}

export default ProductListWrapper;
