import { Component } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '../../../store/useAppStore';
import './index.css';

class MemberDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: null,
      pointsChange: '',
      isEditing: false,
      editForm: {
        name: '',
        phone: '',
        birthday: '',
        balance: '',
      },
    };
  }

  componentDidMount() {
    // 获取会员详情
    const { members } = this.props;
    const memberId = Taro.getCurrentInstance().router.params.id;
    const member = members.find((m) => m.id === memberId);
    if (member) {
      this.setState({
        member,
        editForm: {
          name: member.name,
          phone: member.phone,
          birthday: member.birthday || '',
          balance: member.balance.toString(),
        },
      });
    }
  }

  handlePointsChange = (e) => {
    this.setState({ pointsChange: e.detail.value });
  };

  handleEditChange = (e, field) => {
    const { value } = e.detail;
    this.setState((prevState) => ({
      editForm: {
        ...prevState.editForm,
        [field]: value,
      },
    }));
  };

  toggleEdit = () => {
    const { isEditing, member } = this.state;
    if (isEditing) {
      // 取消编辑，恢复原始数据
      this.setState({
        isEditing: false,
        editForm: {
          name: member.name,
          phone: member.phone,
          birthday: member.birthday || '',
          balance: member.balance.toString(),
        },
      });
    } else {
      // 开始编辑
      this.setState({ isEditing: true });
    }
  };

  saveEdit = () => {
    const { editForm } = this.state;
    const { updateMember } = this.props;
    const { member } = this.state;

    // 表单验证
    if (!editForm.name.trim()) {
      Taro.showToast({
        title: '请输入会员姓名',
        icon: 'none',
      });
      return;
    }

    if (!editForm.phone.trim()) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none',
      });
      return;
    }

    const balance = parseFloat(editForm.balance);
    if (isNaN(balance) || balance < 0) {
      Taro.showToast({
        title: '请输入有效的余额',
        icon: 'none',
      });
      return;
    }

    // 更新会员信息
    updateMember(member.id, {
      ...member,
      name: editForm.name,
      phone: editForm.phone,
      birthday: editForm.birthday,
      balance: balance,
    });

    this.setState({
      isEditing: false,
      member: {
        ...member,
        name: editForm.name,
        phone: editForm.phone,
        birthday: editForm.birthday,
        balance: balance,
      },
    });

    Taro.showToast({
      title: '保存成功',
      icon: 'success',
    });
  };

  contactMember = () => {
    Taro.makePhoneCall({
      phoneNumber: this.state.member.phone,
    }).catch(() => {
      Taro.showToast({
        title: '无法联系会员',
        icon: 'none',
      });
    });
  };

  addPoints = () => {
    const { pointsChange, member } = this.state;
    const { updateMember } = this.props;
    const points = parseInt(pointsChange);

    if (isNaN(points) || points <= 0) {
      Taro.showToast({
        title: '请输入有效的积分数量',
        icon: 'none',
      });
      return;
    }

    updateMember(member.id, {
      ...member,
      points: member.points + points,
    });

    this.setState({
      member: {
        ...member,
        points: member.points + points,
      },
      pointsChange: '',
    });

    Taro.showToast({
      title: '积分增加成功',
      icon: 'success',
    });
  };

  reducePoints = () => {
    const { pointsChange, member } = this.state;
    const { updateMember } = this.props;
    const points = parseInt(pointsChange);

    if (isNaN(points) || points <= 0) {
      Taro.showToast({
        title: '请输入有效的积分数量',
        icon: 'none',
      });
      return;
    }

    if (points > member.points) {
      Taro.showToast({
        title: '积分不足',
        icon: 'none',
      });
      return;
    }

    updateMember(member.id, {
      ...member,
      points: member.points - points,
    });

    this.setState({
      member: {
        ...member,
        points: member.points - points,
      },
      pointsChange: '',
    });

    Taro.showToast({
      title: '积分减少成功',
      icon: 'success',
    });
  };

  getLevelName = (level) => {
    switch (level) {
      case 1:
        return '普通会员';
      case 2:
        return '银卡会员';
      case 3:
        return '金卡会员';
      case 4:
        return '钻石会员';
      default:
        return '普通会员';
    }
  };

  getLevelColor = (level) => {
    switch (level) {
      case 1:
        return '#ccc'; // 普通会员 - 灰色
      case 2:
        return '#c0c0c0'; // 银卡会员 - 银色
      case 3:
        return '#FFD700'; // 金卡会员 - 金色
      case 4:
        return '#00FFFF'; // 钻石会员 - 青色
      default:
        return '#ccc';
    }
  };

  render() {
    const { member, pointsChange, isEditing, editForm } = this.state;

    if (!member) {
      return (
        <View className="member-detail">
          <Text>会员不存在</Text>
        </View>
      );
    }

    return (
      <View className="member-detail">
        <View className="member-header">
          <Text className="member-name">{member.name}</Text>
          <Text className="member-level" style={{ borderColor: this.getLevelColor(member.level) }}>
            {this.getLevelName(member.level)}
          </Text>
        </View>

        {isEditing ? (
          <View className="edit-form">
            <View className="form-item">
              <Text className="label">姓名</Text>
              <Input
                className="input"
                value={editForm.name}
                onInput={(e) => this.handleEditChange(e, 'name')}
              />
            </View>

            <View className="form-item">
              <Text className="label">手机号</Text>
              <Input
                className="input"
                value={editForm.phone}
                onInput={(e) => this.handleEditChange(e, 'phone')}
              />
            </View>

            <View className="form-item">
              <Text className="label">生日</Text>
              <Input
                className="input"
                value={editForm.birthday}
                onInput={(e) => this.handleEditChange(e, 'birthday')}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View className="form-item">
              <Text className="label">余额</Text>
              <Input
                className="input"
                type="digit"
                value={editForm.balance}
                onInput={(e) => this.handleEditChange(e, 'balance')}
              />
            </View>

            <View className="form-actions">
              <Button className="cancel-btn" onClick={this.toggleEdit}>
                取消
              </Button>
              <Button className="save-btn" onClick={this.saveEdit}>
                保存
              </Button>
            </View>
          </View>
        ) : (
          <View className="member-info">
            <View className="info-item">
              <Text className="info-label">手机号:</Text>
              <Text className="info-value">{member.phone}</Text>
            </View>

            <View className="info-item">
              <Text className="info-label">加入时间:</Text>
              <Text className="info-value">{member.joinDate || '未知'}</Text>
            </View>

            <View className="info-item">
              <Text className="info-label">生日:</Text>
              <Text className="info-value">{member.birthday || '未知'}</Text>
            </View>

            <View className="info-item">
              <Text className="info-label">累计消费:</Text>
              <Text className="info-value">¥{member.totalSpent}</Text>
            </View>

            <View className="info-item">
              <Text className="info-label">账户余额:</Text>
              <Text className="info-value">¥{member.balance}</Text>
            </View>

            <View className="info-item">
              <Text className="info-label">会员等级:</Text>
              <Text className="info-value">{this.getLevelName(member.level)}</Text>
            </View>
          </View>
        )}

        <View className="points-section">
          <Text className="section-title">积分管理</Text>
          <View className="points-info">
            <Text className="points-label">当前积分:</Text>
            <Text className="points-value">{member.points}</Text>
          </View>

          <View className="points-input-container">
            <Input
              className="points-input"
              type="number"
              placeholder="输入积分数量"
              value={pointsChange}
              onInput={this.handlePointsChange}
            />
          </View>

          <View className="points-actions">
            <Button className="add-points-btn" onClick={this.addPoints}>
              增加积分
            </Button>
            <Button className="reduce-points-btn" onClick={this.reducePoints}>
              减少积分
            </Button>
          </View>
        </View>

        <View className="action-buttons">
          <Button className="contact-btn" onClick={this.contactMember}>
            联系会员
          </Button>
          <Button className="edit-btn" onClick={this.toggleEdit}>
            {isEditing ? '取消编辑' : '编辑信息'}
          </Button>
        </View>
      </View>
    );
  }
}

// 使用函数组件包装类组件以使用hooks
function MemberDetailWrapper() {
  const { members, updateMember } = useAppStore();
  return <MemberDetail members={members} updateMember={updateMember} />;
}

export default MemberDetailWrapper;
