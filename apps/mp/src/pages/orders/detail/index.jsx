import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.css'

export default class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {
        id: '1001',
        customer: '张三',
        phone: '13800138000',
        address: '北京市朝阳区某某街道某某号',
        amount: 299,
        status: '已完成',
        date: '2023-05-01',
        items: [
          { id: '1', name: '商品1', price: 100, quantity: 2 },
          { id: '2', name: '商品2', price: 99, quantity: 1 }
        ]
      }
    };
  }

  updateStatus = (newStatus) => {
    // 更新订单状态
    console.log('更新订单状态为:', newStatus);
  }

  render() {
    const { order } = this.state;
    
    return (
      <View className='order-detail'>
        <View className='order-header'>
          <Text className='order-id'>订单号: {order.id}</Text>
          <Text className={`order-status ${order.status === '已完成' ? 'completed' : order.status === '待发货' ? 'pending' : 'cancelled'}`}>
            {order.status}
          </Text>
        </View>
        
        <View className='customer-info'>
          <View className='info-item'>
            <Text className='info-label'>客户:</Text>
            <Text className='info-value'>{order.customer}</Text>
          </View>
          
          <View className='info-item'>
            <Text className='info-label'>电话:</Text>
            <Text className='info-value'>{order.phone}</Text>
          </View>
          
          <View className='info-item'>
            <Text className='info-label'>地址:</Text>
            <Text className='info-value'>{order.address}</Text>
          </View>
          
          <View className='info-item'>
            <Text className='info-label'>下单时间:</Text>
            <Text className='info-value'>{order.date}</Text>
          </View>
        </View>
        
        <View className='order-items'>
          <Text className='section-title'>商品信息</Text>
          {order.items.map(item => (
            <View className='item' key={item.id}>
              <Text className='item-name'>{item.name}</Text>
              <Text className='item-price'>¥{item.price} × {item.quantity}</Text>
            </View>
          ))}
        </View>
        
        <View className='order-summary'>
          <View className='summary-item'>
            <Text className='summary-label'>总金额:</Text>
            <Text className='summary-value'>¥{order.amount}</Text>
          </View>
        </View>
        
        {order.status === '待发货' && (
          <View className='action-buttons'>
            <Button className='ship-btn' onClick={() => this.updateStatus('已发货')}>发货</Button>
          </View>
        )}
      </View>
    )
  }
}