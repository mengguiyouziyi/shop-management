import { Component } from 'react'
import { View, Text, Input, Button, Form } from '@tarojs/components'
import './index.css'

export default class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        price: '',
        stock: '',
        category: ''
      }
    };
  }

  handleInputChange = (e, field) => {
    const { value } = e.detail;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [field]: value
      }
    }));
  }

  handleSubmit = () => {
    const { formData } = this.state;
    console.log('提交商品数据:', formData);
    // 这里可以调用创建商品的API
  }

  render() {
    const { formData } = this.state;
    
    return (
      <View className='create-product'>
        <Text className='title'>新增商品</Text>
        
        <Form onSubmit={this.handleSubmit}>
          <View className='form-item'>
            <Text className='label'>商品名称</Text>
            <Input
              className='input'
              value={formData.name}
              onInput={(e) => this.handleInputChange(e, 'name')}
              placeholder='请输入商品名称'
            />
          </View>
          
          <View className='form-item'>
            <Text className='label'>价格</Text>
            <Input
              className='input'
              type='digit'
              value={formData.price}
              onInput={(e) => this.handleInputChange(e, 'price')}
              placeholder='请输入商品价格'
            />
          </View>
          
          <View className='form-item'>
            <Text className='label'>库存</Text>
            <Input
              className='input'
              type='number'
              value={formData.stock}
              onInput={(e) => this.handleInputChange(e, 'stock')}
              placeholder='请输入商品库存'
            />
          </View>
          
          <View className='form-item'>
            <Text className='label'>分类</Text>
            <Input
              className='input'
              value={formData.category}
              onInput={(e) => this.handleInputChange(e, 'category')}
              placeholder='请输入商品分类'
            />
          </View>
          
          <Button className='submit-btn' onClick={this.handleSubmit}>保存</Button>
        </Form>
      </View>
    )
  }
}