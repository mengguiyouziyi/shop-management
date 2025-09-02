import { Component } from 'react'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import './index.css'

export default class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [
        { id: '1', name: '张三', phone: '13800138000', points: 1200, level: '金牌会员' },
        { id: '2', name: '李四', phone: '13800138001', points: 800, level: '银牌会员' },
        { id: '3', name: '王五', phone: '13800138002', points: 300, level: '普通会员' }
      ]
    };
  }

  goToDetail = (id) => {
    // 跳转到会员详情页面
    console.log('跳转到会员详情页面，会员ID:', id);
  }

  render() {
    const { members } = this.state;
    
    return (
      <View className='member-list'>
        <View className='header'>
          <Text className='title'>会员管理</Text>
        </View>
        
        <ScrollView className='member-scroll'>
          {members.map(member => (
            <View 
              className='member-item' 
              key={member.id} 
              onClick={() => this.goToDetail(member.id)}
            >
              <View className='member-info'>
                <Text className='member-name'>{member.name}</Text>
                <Text className='member-phone'>{member.phone}</Text>
              </View>
              <View className='member-details'>
                <Text className='member-points'>{member.points}积分</Text>
                <Text className='member-level'>{member.level}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}