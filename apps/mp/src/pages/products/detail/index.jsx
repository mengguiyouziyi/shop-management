import { Component } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../../store/useAppStore';
import './index.css';

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      isEditing: false,
      editForm: {
        name: '',
        category: '',
        price: '',
        stock: '',
        minStock: '',
        description: '',
      },
    };
  }

  componentDidMount() {
    // 获取商品详情
    const { products } = this.props;
    const productId = Taro.getCurrentInstance().router.params.id;
    const product = products.find((p) => p.id === productId);
    if (product) {
      this.setState({
        product,
        editForm: {
          name: product.name,
          category: product.category,
          price: product.price.toString(),
          stock: product.stock.toString(),
          minStock: product.minStock.toString(),
          description: product.description || '',
        },
      });
    }
  }

  handleEditChange = (e, field) => {
    const { value } = e.detail;
    this.setState((prevState) => ({
      editForm: {
        ...prevState.editForm,
        [field]: value,
      },
    }));
  };

  toggleEdit = () => {
    const { isEditing, product } = this.state;
    if (isEditing) {
      // 取消编辑，恢复原始数据
      this.setState({
        isEditing: false,
        editForm: {
          name: product.name,
          category: product.category,
          price: product.price.toString(),
          stock: product.stock.toString(),
          minStock: product.minStock.toString(),
          description: product.description || '',
        },
      });
    } else {
      // 开始编辑
      this.setState({ isEditing: true });
    }
  };

  saveEdit = () => {
    const { editForm } = this.state;
    const { updateProduct } = this.props;
    const { product } = this.state;

    // 表单验证
    if (!editForm.name.trim()) {
      Taro.showToast({
        title: '请输入商品名称',
        icon: 'none',
      });
      return;
    }

    const price = parseFloat(editForm.price);
    if (isNaN(price) || price <= 0) {
      Taro.showToast({
        title: '请输入有效的商品价格',
        icon: 'none',
      });
      return;
    }

    const stock = parseInt(editForm.stock);
    if (isNaN(stock) || stock < 0) {
      Taro.showToast({
        title: '请输入有效的商品库存',
        icon: 'none',
      });
      return;
    }

    const minStock = parseInt(editForm.minStock) || 0;
    if (minStock < 0) {
      Taro.showToast({
        title: '请输入有效的最低库存',
        icon: 'none',
      });
      return;
    }

    // 更新商品信息
    updateProduct(product.id, {
      ...product,
      name: editForm.name,
      category: editForm.category,
      price: price,
      stock: stock,
      minStock: minStock,
      description: editForm.description,
    });

    this.setState({
      isEditing: false,
      product: {
        ...product,
        name: editForm.name,
        category: editForm.category,
        price: price,
        stock: stock,
        minStock: minStock,
        description: editForm.description,
      },
    });

    Taro.showToast({
      title: '保存成功',
      icon: 'success',
    });
  };

  deleteProduct = () => {
    const { deleteProduct } = this.props;
    const { product } = this.state;

    // 删除商品
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          deleteProduct(product.id);
          Taro.showToast({
            title: '删除成功',
            icon: 'success',
          });
          // 返回商品列表页面
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        }
      },
    });
  };

  exportProduct = () => {
    Taro.showToast({
      title: '导出功能在小程序中不可用',
      icon: 'none',
    });
  };

  render() {
    const { product } = this.state;

    if (!product) {
      return (
        <View className="product-detail">
          <Text>商品不存在</Text>
        </View>
      );
    }

    return (
      <View className="product-detail">
        <View className="product-header">
          <Text className="product-name">{product.name}</Text>
          <Text className="product-price">¥{product.price}</Text>
          <View className="product-id">ID: {product.id}</View>
        </View>

        <View className="product-info">
          <View className="info-item">
            <Text className="info-label">分类:</Text>
            <Text className="info-value">{product.category}</Text>
          </View>

          <View className="info-item">
            <Text className="info-label">库存:</Text>
            <Text className="info-value">{product.stock}</Text>
          </View>

          <View className="info-item">
            <Text className="info-label">最低库存:</Text>
            <Text className="info-value">{product.minStock}</Text>
          </View>

          <View className="info-item">
            <Text className="info-label">商品描述:</Text>
            <Text className="info-value">{product.description || '暂无描述'}</Text>
          </View>
        </View>

        {isEditing ? (
          <View className="edit-form">
            <View className="form-item">
              <Text className="label">商品名称</Text>
              <Input
                className="input"
                value={editForm.name}
                onInput={(e) => this.handleEditChange(e, 'name')}
              />
            </View>

            <View className="form-item">
              <Text className="label">分类</Text>
              <Input
                className="input"
                value={editForm.category}
                onInput={(e) => this.handleEditChange(e, 'category')}
              />
            </View>

            <View className="form-item">
              <Text className="label">价格</Text>
              <Input
                className="input"
                type="digit"
                value={editForm.price}
                onInput={(e) => this.handleEditChange(e, 'price')}
              />
            </View>

            <View className="form-item">
              <Text className="label">库存</Text>
              <Input
                className="input"
                type="number"
                value={editForm.stock}
                onInput={(e) => this.handleEditChange(e, 'stock')}
              />
            </View>

            <View className="form-item">
              <Text className="label">最低库存</Text>
              <Input
                className="input"
                type="number"
                value={editForm.minStock}
                onInput={(e) => this.handleEditChange(e, 'minStock')}
              />
            </View>

            <View className="form-item">
              <Text className="label">商品描述</Text>
              <Input
                className="input"
                value={editForm.description}
                onInput={(e) => this.handleEditChange(e, 'description')}
              />
            </View>

            <View className="form-actions">
              <Button className="cancel-btn" onClick={this.toggleEdit}>
                取消
              </Button>
              <Button className="save-btn" onClick={this.saveEdit}>
                保存
              </Button>
            </View>
          </View>
        ) : (
          <View className="product-info">
            <View className="info-item">
              <Text className="info-label">分类:</Text>
              <Text className="info-value">{product.category}</Text>
            </View>

            <View className="info-item">
              <Text className="info-label">库存:</Text>
              <Text className="info-value">{product.stock}</Text>
            </View>

            <View className="info-item">
              <Text className="info-label">最低库存:</Text>
              <Text className="info-value">{product.minStock}</Text>
            </View>

            <View className="info-item">
              <Text className="info-label">商品描述:</Text>
              <Text className="info-value">{product.description || '暂无描述'}</Text>
            </View>
          </View>
        )}

        <View className="action-buttons">
          <Button className="edit-btn" onClick={this.toggleEdit}>
            {isEditing ? '取消编辑' : '编辑'}
          </Button>
          {!isEditing && (
            <Button className="delete-btn" onClick={this.deleteProduct}>
              删除
            </Button>
          )}
        </View>
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function ProductDetailWrapper() {
  const { products, deleteProduct } = useAppStore();
  return <ProductDetail products={products} deleteProduct={deleteProduct} />;
}

export default ProductDetailWrapper;
