import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import TabBar from '../../components/tabbar'
import './index.css'

export default class Index extends Component {
  render() {
    return (
      <View className='index'>
        <Text>欢迎使用店铺管理系统小程序</Text>
        <TabBar currentPath='/pages/index/index' />
      </View>
    )
  }
}