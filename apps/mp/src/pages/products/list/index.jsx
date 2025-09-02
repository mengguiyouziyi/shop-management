import { Component } from 'react'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import TabBar from '../../../components/tabbar'
import './index.css'

export default class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        { id: '1', name: '商品1', price: 100, stock: 50 },
        { id: '2', name: '商品2', price: 200, stock: 30 },
        { id: '3', name: '商品3', price: 150, stock: 20 }
      ]
    };
  }

  goToCreate = () => {
    // 跳转到创建商品页面
    console.log('跳转到创建商品页面');
  }

  goToDetail = (id) => {
    // 跳转到商品详情页面
    console.log('跳转到商品详情页面，商品ID:', id);
  }

  render() {
    const { products } = this.state;
    
    return (
      <View className='product-list'>
        <View className='header'>
          <Text className='title'>商品管理</Text>
          <Button className='create-btn' onClick={this.goToCreate}>新增商品</Button>
        </View>
        
        <ScrollView className='product-scroll'>
          {products.map(product => (
            <View 
              className='product-item' 
              key={product.id} 
              onClick={() => this.goToDetail(product.id)}
            >
              <View className='product-info'>
                <Text className='product-name'>{product.name}</Text>
                <Text className='product-price'>¥{product.price}</Text>
              </View>
              <View className='product-stock'>
                <Text>库存: {product.stock}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
        <TabBar currentPath='/pages/products/list/index' />
      </View>
    )
  }
}