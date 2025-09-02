import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.css'

export default class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
        id: '1',
        name: '示例商品',
        price: 199,
        stock: 50,
        category: '电子产品',
        description: '这是一件高质量的商品，适用于各种场景'
      }
    };
  }

  editProduct = () => {
    // 编辑商品
    console.log('编辑商品');
  }

  deleteProduct = () => {
    // 删除商品
    console.log('删除商品');
  }

  render() {
    const { product } = this.state;
    
    return (
      <View className='product-detail'>
        <View className='product-header'>
          <Text className='product-name'>{product.name}</Text>
          <Text className='product-price'>¥{product.price}</Text>
        </View>
        
        <View className='product-info'>
          <View className='info-item'>
            <Text className='info-label'>分类:</Text>
            <Text className='info-value'>{product.category}</Text>
          </View>
          
          <View className='info-item'>
            <Text className='info-label'>库存:</Text>
            <Text className='info-value'>{product.stock}</Text>
          </View>
          
          <View className='info-item'>
            <Text className='info-label'>描述:</Text>
            <Text className='info-value'>{product.description}</Text>
          </View>
        </View>
        
        <View className='action-buttons'>
          <Button className='edit-btn' onClick={this.editProduct}>编辑</Button>
          <Button className='delete-btn' onClick={this.deleteProduct}>删除</Button>
        </View>
      </View>
    )
  }
}