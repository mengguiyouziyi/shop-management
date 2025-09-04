import { Component } from 'react';
import { View, Text, Button, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import TabBar from '../../components/tabbar';
import './index.css';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: true,
      darkMode: false,
      autoSync: true,
      sound: true,
    };
  }

  handleSwitchChange = (field, e) => {
    const value = e.detail.value;
    this.setState({
      [field]: value,
    });

    // 保存设置到本地存储
    Taro.setStorage({
      key: `setting_${field}`,
      data: value,
    });
  };

  clearCache = () => {
    Taro.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？这将删除所有本地存储的数据。',
      success: (res) => {
        if (res.confirm) {
          Taro.clearStorage({
            success: () => {
              Taro.showToast({
                title: '缓存已清除',
                icon: 'success',
              });
            },
          });
        }
      },
    });
  };

  checkForUpdates = () => {
    Taro.showToast({
      title: '正在检查更新...',
      icon: 'loading',
      duration: 1000,
    });

    // 模拟检查更新
    setTimeout(() => {
      Taro.showToast({
        title: '已是最新版本',
        icon: 'success',
      });
    }, 1500);
  };

  goToFeedback = () => {
    Taro.navigateTo({
      url: '/pages/settings/feedback/index',
    });
  };

  goToAbout = () => {
    Taro.navigateTo({
      url: '/pages/settings/about/index',
    });
  };

  render() {
    const { notifications, darkMode, autoSync, sound } = this.state;

    return (
      <View className="settings">
        {/* 页面标题 */}
        <View className="header-section">
          <Text className="title">系统设置</Text>
          <Text className="subtitle">管理应用设置和偏好</Text>
        </View>
        {/* 设置项列表 */}
        <View className="settings-section">
          <Text className="section-title">通用设置</Text>

          <View className="setting-item">
            <View className="setting-info">
              <Text className="setting-label">消息通知</Text>
              <Text className="setting-desc">接收订单、库存等相关通知</Text>
            </View>
            <Switch
              checked={notifications}
              onChange={(e) => this.handleSwitchChange('notifications', e)}
              color="#1890ff"
            />
          </View>

          <View className="setting-item">
            <View className="setting-info">
              <Text className="setting-label">深色模式</Text>
              <Text className="setting-desc">使用深色主题界面</Text>
            </View>
            <Switch
              checked={darkMode}
              onChange={(e) => this.handleSwitchChange('darkMode', e)}
              color="#1890ff"
            />
          </View>

          <View className="setting-item">
            <View className="setting-info">
              <Text className="setting-label">自动同步</Text>
              <Text className="setting-desc">自动同步数据到云端</Text>
            </View>
            <Switch
              checked={autoSync}
              onChange={(e) => this.handleSwitchChange('autoSync', e)}
              color="#1890ff"
            />
          </View>

          <View className="setting-item">
            <View className="setting-info">
              <Text className="setting-label">声音提醒</Text>
              <Text className="setting-desc">操作完成时播放提示音</Text>
            </View>
            <Switch
              checked={sound}
              onChange={(e) => this.handleSwitchChange('sound', e)}
              color="#1890ff"
            />
          </View>
        </View>
        {/* 功能操作 */}
        <View className="settings-section">
          <Text className="section-title">功能操作</Text>

          <View className="action-item" onClick={this.clearCache}>
            <View className="action-info">
              <Text className="action-label">清除缓存</Text>
              <Text className="action-desc">清除本地存储的缓存数据</Text>
            </View>
            <Text className="action-arrow">›</Text>
          </View>

          <View className="action-item" onClick={this.checkForUpdates}>
            <View className="action-info">
              <Text className="action-label">检查更新</Text>
              <Text className="action-desc">检查并更新到最新版本</Text>
            </View>
            <Text className="action-arrow">›</Text>
          </View>

          <View className="action-item" onClick={this.goToFeedback}>
            <View className="action-info">
              <Text className="action-label">意见反馈</Text>
              <Text className="action-desc">提交您的使用反馈和建议</Text>
            </View>
            <Text className="action-arrow">›</Text>
          </View>

          <View className="action-item" onClick={this.goToAbout}>
            <View className="action-info">
              <Text className="action-label">关于我们</Text>
              <Text className="action-desc">查看应用版本和相关信息</Text>
            </View>
            <Text className="action-arrow">›</Text>
          </View>
        </View>
        {/* 版本信息 */}
        <View className="version-info">
          <Text className="version-text">版本号: 1.0.0</Text>
          <Text className="copyright-text">© 2023 店铺管理系统. 保留所有权利.</Text>
        </View>
        <View style={{ height: 60 }}></View> {/* 为TabBar留出空间 */}
        <TabBar currentPath="/pages/settings/index" />
      </View>
    );
  }
}

export default Settings;
