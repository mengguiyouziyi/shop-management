import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.css'

export default class MemberDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: {
        id: '1',
        name: '张三',
        phone: '13800138000',
        points: 1200,
        level: '金牌会员',
        joinDate: '2022-01-01',
        birthday: '1990-01-01',
        consumption: 5000
      }
    };
  }

  addPoints = () => {
    // 增加积分
    console.log('增加积分');
  }

  reducePoints = () => {
    // 减少积分
    console.log('减少积分');
  }

  render() {
    const { member } = this.state;
    
    return (
      <View className='member-detail'>
        <View className='member-header'>
          <Text className='member-name'>{member.name}</Text>
          <Text className='member-level'>{member.level}</Text>
        </View>
        
        <View className='member-info'>
          <View className='info-item'>
            <Text className='info-label'>手机号:</Text>
            <Text className='info-value'>{member.phone}</Text>
          </View>
          
          <View className='info-item'>
            <Text className='info-label'>加入时间:</Text>
            <Text className='info-value'>{member.joinDate}</Text>
          </View>
          
          <View className='info-item'>
            <Text className='info-label'>生日:</Text>
            <Text className='info-value'>{member.birthday}</Text>
          </View>
          
          <View className='info-item'>
            <Text className='info-label'>累计消费:</Text>
            <Text className='info-value'>¥{member.consumption}</Text>
          </View>
        </View>
        
        <View className='points-section'>
          <Text className='section-title'>积分管理</Text>
          <View className='points-info'>
            <Text className='points-label'>当前积分:</Text>
            <Text className='points-value'>{member.points}</Text>
          </View>
          <View className='points-actions'>
            <Button className='add-points-btn' onClick={this.addPoints}>增加积分</Button>
            <Button className='reduce-points-btn' onClick={this.reducePoints}>减少积分</Button>
          </View>
        </View>
      </View>
    )
  }
}