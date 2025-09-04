import { Component } from 'react';
import { View, Text, Input, Button, Form, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../../store/useAppStore';
import './index.css';

class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        category: '默认分类',
        price: '',
        stock: '',
        minStock: '',
        description: '',
      },
      categoryOptions: ['默认分类', '手机', '平板', '配件', '其他'],
    };
  }

  handleInputChange = (e, field) => {
    const { value } = e.detail;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
    }));
  };

  handleCategoryChange = (e) => {
    const { categoryOptions } = this.state;
    const selectedIndex = e.detail.value;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        category: categoryOptions[selectedIndex],
      },
    }));
  };

  handleSubmit = () => {
    const { formData } = this.state;
    const { addProduct } = this.props;

    // 表单验证
    if (!formData.name.trim()) {
      Taro.showToast({
        title: '请输入商品名称',
        icon: 'none',
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      Taro.showToast({
        title: '请输入有效的商品价格',
        icon: 'none',
      });
      return;
    }

    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      Taro.showToast({
        title: '请输入有效的商品库存',
        icon: 'none',
      });
      return;
    }

    const minStock = parseInt(formData.minStock) || 0;
    if (minStock < 0) {
      Taro.showToast({
        title: '请输入有效的最低库存',
        icon: 'none',
      });
      return;
    }

    // 提交数据
    addProduct({
      name: formData.name.trim(),
      category: formData.category,
      price: price,
      stock: stock,
      minStock: minStock,
      description: formData.description.trim(),
    });

    // 显示成功提示
    Taro.showToast({
      title: '商品创建成功',
      icon: 'success',
    });

    // 重置表单
    this.setState({
      formData: {
        name: '',
        category: '默认分类',
        price: '',
        stock: '',
        minStock: '',
        description: '',
      },
    });

    // 返回商品列表页面
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  handleReset = () => {
    this.setState({
      formData: {
        name: '',
        category: '默认分类',
        price: '',
        stock: '',
        minStock: '',
        description: '',
      },
    });

    Taro.showToast({
      title: '表单已重置',
      icon: 'none',
    });
  };

  render() {
    const { formData, categoryOptions } = this.state;
    const categoryIndex = categoryOptions.indexOf(formData.category);

    return (
      <View className="create-product">
        <View className="header-section">
          <Text className="title">创建新商品</Text>
          <Text className="subtitle">填写以下信息来创建新商品</Text>
        </View>

        <Form onSubmit={this.handleSubmit}>
          <View className="form-container">
            <View className="form-section">
              <Text className="section-title">基本信息</Text>

              <View className="form-item">
                <Text className="label">商品名称 *</Text>
                <Input
                  className="input"
                  value={formData.name}
                  onInput={(e) => this.handleInputChange(e, 'name')}
                  placeholder="请输入商品名称"
                />
              </View>

              <View className="form-item">
                <Text className="label">商品分类</Text>
                <Picker
                  mode="selector"
                  range={categoryOptions}
                  value={categoryIndex}
                  onChange={this.handleCategoryChange}
                >
                  <View className="picker">{formData.category || '请选择分类'}</View>
                </Picker>
              </View>

              <View className="form-item">
                <Text className="label">商品价格 *</Text>
                <Input
                  className="input"
                  type="digit"
                  value={formData.price}
                  onInput={(e) => this.handleInputChange(e, 'price')}
                  placeholder="请输入商品价格"
                />
              </View>
            </View>

            <View className="form-section">
              <Text className="section-title">库存信息</Text>

              <View className="form-item">
                <Text className="label">商品库存 *</Text>
                <Input
                  className="input"
                  type="number"
                  value={formData.stock}
                  onInput={(e) => this.handleInputChange(e, 'stock')}
                  placeholder="请输入商品库存"
                />
              </View>

              <View className="form-item">
                <Text className="label">最低库存</Text>
                <Input
                  className="input"
                  type="number"
                  value={formData.minStock}
                  onInput={(e) => this.handleInputChange(e, 'minStock')}
                  placeholder="请输入最低库存预警值"
                />
              </View>
            </View>

            <View className="form-section">
              <Text className="section-title">商品描述</Text>

              <View className="form-item">
                <Text className="label">商品描述</Text>
                <Input
                  className="input textarea"
                  value={formData.description}
                  onInput={(e) => this.handleInputChange(e, 'description')}
                  placeholder="请输入商品描述"
                />
              </View>
            </View>

            <View className="form-actions">
              <Button className="submit-btn" onClick={this.handleSubmit}>
                创建商品
              </Button>
              <Button className="reset-btn" onClick={this.handleReset}>
                重置表单
              </Button>
              <Button className="cancel-btn" onClick={() => Taro.navigateBack()}>
                取消
              </Button>
            </View>
          </View>
        </Form>
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function CreateProductWrapper() {
  const { addProduct } = useAppStore();
  return <CreateProduct addProduct={addProduct} />;
}

export default CreateProductWrapper;
