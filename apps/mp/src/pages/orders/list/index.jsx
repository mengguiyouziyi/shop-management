import { Component } from 'react'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import './index.css'

export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [
        { id: '1001', customer: '张三', amount: 299, status: '已完成', date: '2023-05-01' },
        { id: '1002', customer: '李四', amount: 599, status: '待发货', date: '2023-05-02' },
        { id: '1003', customer: '王五', amount: 199, status: '已取消', date: '2023-05-03' }
      ]
    };
  }

  goToDetail = (id) => {
    // 跳转到订单详情页面
    console.log('跳转到订单详情页面，订单ID:', id);
  }

  render() {
    const { orders } = this.state;
    
    return (
      <View className='order-list'>
        <View className='header'>
          <Text className='title'>订单管理</Text>
        </View>
        
        <ScrollView className='order-scroll'>
          {orders.map(order => (
            <View 
              className='order-item' 
              key={order.id} 
              onClick={() => this.goToDetail(order.id)}
            >
              <View className='order-info'>
                <Text className='order-id'>订单号: {order.id}</Text>
                <Text className='order-customer'>{order.customer}</Text>
              </View>
              <View className='order-details'>
                <Text className='order-amount'>¥{order.amount}</Text>
                <Text className={`order-status ${order.status === '已完成' ? 'completed' : order.status === '待发货' ? 'pending' : 'cancelled'}`}>
                  {order.status}
                </Text>
                <Text className='order-date'>{order.date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}