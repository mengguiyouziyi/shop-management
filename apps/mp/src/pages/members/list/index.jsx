import { Component } from 'react';
import { View, Text, Button, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../../store/useAppStore';
import TabBar from '../../../components/tabbar';
import './index.css';

class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      levelFilter: 'all',
    };
  }

  goToCreate = () => {
    Taro.navigateTo({
      url: '/pages/members/create/index',
    });
  };

  goToDetail = (id) => {
    Taro.navigateTo({
      url: '/pages/members/detail/index?id=' + id,
    });
  };

  handleSearch = (e) => {
    const searchTerm = e.detail.value;
    this.setState({ searchTerm });
  };

  handleLevelFilter = (level) => {
    this.setState({ levelFilter: level });
  };

  getMemberLevelText = (level) => {
    const levelMap = {
      normal: '普通会员',
      silver: '银卡会员',
      gold: '金卡会员',
      platinum: '铂金会员',
    };
    return levelMap[level] || level;
  };

  getMemberLevelColor = (level) => {
    const colorMap = {
      normal: '#666',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2',
    };
    return colorMap[level] || '#666';
  };

  onPullDownRefresh = () => {
    // 模拟刷新数据
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({
        title: '刷新成功',
        icon: 'success',
      });
    }, 1000);
  };

  render() {
    const { searchTerm, levelFilter } = this.state;
    const { members } = this.props;

    const filteredMembers = members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm);
      const matchesLevel = levelFilter === 'all' || member.level === levelFilter;
      return matchesSearch && matchesLevel;
    });

    // 计算统计数据
    const totalMembers = members.length;
    const totalPoints = members.reduce((sum, member) => sum + member.points, 0);
    const todayMembers = members.filter((member) => {
      const memberDate = new Date(member.joinDate).toDateString();
      const today = new Date().toDateString();
      return memberDate === today;
    }).length;
    const goldMembers = members.filter(
      (member) => member.level === 'gold' || member.level === 'platinum'
    ).length;

    return (
      <View className="member-list">
        {/* 页面标题和操作栏 */}
        <View className="header-section">
          <Text className="title">会员管理</Text>
          <Button className="create-btn" onClick={this.goToCreate}>
            ➕ 创建会员
          </Button>
        </View>
        {/* 搜索和筛选栏 */}
        <View className="search-filter-container">
          <Input
            className="search-input"
            placeholder="搜索会员姓名或手机号..."
            value={searchTerm}
            onInput={this.handleSearch}
          />

          <View className="filter-tabs">
            <Button
              className={`filter-tab ${levelFilter === 'all' ? 'active' : ''}`}
              onClick={() => this.handleLevelFilter('all')}
            >
              全部
            </Button>
            <Button
              className={`filter-tab ${levelFilter === 'normal' ? 'active' : ''}`}
              onClick={() => this.handleLevelFilter('normal')}
            >
              普通
            </Button>
            <Button
              className={`filter-tab ${levelFilter === 'silver' ? 'active' : ''}`}
              onClick={() => this.handleLevelFilter('silver')}
            >
              银卡
            </Button>
            <Button
              className={`filter-tab ${levelFilter === 'gold' ? 'active' : ''}`}
              onClick={() => this.handleLevelFilter('gold')}
            >
              金卡
            </Button>
            <Button
              className={`filter-tab ${levelFilter === 'platinum' ? 'active' : ''}`}
              onClick={() => this.handleLevelFilter('platinum')}
            >
              铂金
            </Button>
          </View>
        </View>
        {/* 统计卡片 */}
        <View className="stats-grid-enhanced">
          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #1890ff' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(24, 144, 255, 0.1)' }}
              >
                <Text className="stat-icon">👥</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">会员总数</Text>
                <Text className="stat-value-enhanced">{totalMembers}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #52c41a' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(82, 196, 26, 0.1)' }}
              >
                <Text className="stat-icon">⭐</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">总积分</Text>
                <Text className="stat-value-enhanced">{totalPoints}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #fa8c16' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(250, 140, 22, 0.1)' }}
              >
                <Text className="stat-icon">⏰</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">今日新增</Text>
                <Text className="stat-value-enhanced">{todayMembers}</Text>
              </View>
            </View>
          </View>

          <View className="stat-card-enhanced" style={{ borderLeft: '4px solid #ffd700' }}>
            <View className="stat-card-content">
              <View
                className="stat-icon-container"
                style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
              >
                <Text className="stat-icon">🥇</Text>
              </View>
              <View className="stat-info">
                <Text className="stat-label-enhanced">高等级</Text>
                <Text className="stat-value-enhanced">{goldMembers}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* 会员列表 */}
        <ScrollView
          className="member-scroll"
          enablePullDownRefresh
          onPullDownRefresh={this.onPullDownRefresh}
        >
          <View className="member-list-container">
            {filteredMembers.map((member) => (
              <View
                className="member-item-enhanced"
                key={member.id}
                onClick={() => this.goToDetail(member.id)}
              >
                <View className="member-header">
                  <View className="member-avatar">
                    <Text className="avatar-text">{member.name.charAt(0)}</Text>
                  </View>
                  <View className="member-info">
                    <Text className="member-name">{member.name}</Text>
                    <View
                      className="member-level"
                      style={{ color: this.getMemberLevelColor(member.level) }}
                    >
                      {this.getMemberLevelText(member.level)}
                    </View>
                  </View>
                  <View className="member-points">
                    <Text className="points-label">积分</Text>
                    <Text className="points-value">{member.points}</Text>
                  </View>
                </View>

                <View className="member-details">
                  <View className="member-phone">
                    <Text className="label">手机:</Text>
                    <Text className="value">{member.phone || '未填写'}</Text>
                  </View>

                  <View className="member-date">
                    <Text className="label">加入时间:</Text>
                    <Text className="value">{member.joinDate}</Text>
                  </View>

                  <View className="member-spent">
                    <Text className="label">消费金额:</Text>
                    <Text className="value amount">¥{member.totalSpent.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {filteredMembers.length === 0 && (
            <View className="empty-state">
              <Text className="empty-icon">👥</Text>
              <Text className="empty-text">
                {searchTerm || levelFilter !== 'all' ? '没有找到匹配的会员' : '还没有会员记录'}
              </Text>
            </View>
          )}
        </ScrollView>
        <View style={{ height: 60 }}></View> {/* 为TabBar留出空间 */}
        <TabBar currentPath="/pages/members/list/index" />
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function MemberListWrapper() {
  const { members } = useAppStore();
  return <MemberList members={members} />;
}

export default MemberListWrapper;
