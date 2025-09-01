import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Message, Card, Tabs, Tag, Timeline } from 'tdesign-react';
import { FeedbackService, Feedback } from '../../services/feedback';
import { PermissionService } from '../../services/permission';

export default function FeedbackPage() {
  const [form] = Form.useForm();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('submit');
  const feedbackService = FeedbackService.getInstance();
  const permissionService = PermissionService.getInstance();
  const currentUser = permissionService.getCurrentUser();

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const userFeedbacks = await feedbackService.getFeedbacksByUser(currentUser?.id || '');
      setFeedbacks(userFeedbacks);
    } catch (error) {
      Message.error('加载反馈列表失败');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      await feedbackService.submitFeedback({
        userId: currentUser?.id || '',
        userName: currentUser?.name || '',
        userEmail: currentUser?.email || '',
        type: values.type,
        title: values.title,
        description: values.description,
        priority: values.priority
      });
      
      Message.success('反馈提交成功');
      form.reset();
      loadFeedbacks();
    } catch (error) {
      Message.error('提交反馈失败');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusLabel = (status: Feedback['status']) => {
    switch (status) {
      case 'submitted': return '已提交';
      case 'reviewed': return '已审核';
      case 'in-progress': return '处理中';
      case 'resolved': return '已解决';
      case 'closed': return '已关闭';
      default: return status;
    }
  };

  const getStatusTheme = (status: Feedback['status']) => {
    switch (status) {
      case 'submitted': return 'default';
      case 'reviewed': return 'warning';
      case 'in-progress': return 'primary';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: Feedback['type']) => {
    switch (type) {
      case 'bug': return '问题';
      case 'feature': return '功能建议';
      case 'improvement': return '改进';
      case 'other': return '其他';
      default: return type;
    }
  };

  const getTypeTheme = (type: Feedback['type']) => {
    switch (type) {
      case 'bug': return 'danger';
      case 'feature': return 'success';
      case 'improvement': return 'warning';
      case 'other': return 'default';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        用户反馈
      </h1>
      
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
        <Tabs.TabPanel value="submit" label="提交反馈">
          <Card style={{ maxWidth: '800px' }}>
            <Form form={form} onSubmit={onSubmit} labelWidth={100}>
              <Form.FormItem label="反馈类型" name="type" rules={[{ required: true, message: '请选择反馈类型' }]}>
                <Select>
                  <Select.Option value="bug">问题</Select.Option>
                  <Select.Option value="feature">功能建议</Select.Option>
                  <Select.Option value="improvement">改进建议</Select.Option>
                  <Select.Option value="other">其他</Select.Option>
                </Select>
              </Form.FormItem>
              
              <Form.FormItem label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select>
                  <Select.Option value="low">低</Select.Option>
                  <Select.Option value="medium">中</Select.Option>
                  <Select.Option value="high">高</Select.Option>
                </Select>
              </Form.FormItem>
              
              <Form.FormItem label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                <Input placeholder="请输入反馈标题" />
              </Form.FormItem>
              
              <Form.FormItem label="详细描述" name="description" rules={[{ required: true, message: '请输入详细描述' }]}>
                <TextArea placeholder="请详细描述您的反馈内容" />
              </Form.FormItem>
              
              <Form.FormItem style={{ textAlign: 'center' }}>
                <Button theme="primary" type="submit" loading={submitting}>
                  提交反馈
                </Button>
                <Button variant="outline" onClick={() => form.reset()} style={{ marginLeft: '10px' }}>
                  重置
                </Button>
              </Form.FormItem>
            </Form>
          </Card>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="my-feedback" label="我的反馈">
          <Card>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>加载中...</div>
            ) : feedbacks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>暂无反馈记录</p>
              </div>
            ) : (
              <Timeline>
                {feedbacks.map(feedback => (
                  <Timeline.Item key={feedback.id} label={feedback.createdAt}>
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>{feedback.title}</h3>
                        <Tag theme={getTypeTheme(feedback.type)} variant="light">
                          {getTypeLabel(feedback.type)}
                        </Tag>
                        <Tag theme={getStatusTheme(feedback.status)} variant="light">
                          {getStatusLabel(feedback.status)}
                        </Tag>
                        <Tag variant="light">
                          优先级: {feedback.priority === 'high' ? '高' : feedback.priority === 'medium' ? '中' : '低'}
                        </Tag>
                      </div>
                      <p style={{ margin: '10px 0', color: '#666' }}>{feedback.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
                        <span>提交时间: {feedback.createdAt}</span>
                        <span>更新时间: {feedback.updatedAt}</span>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Card>
        </Tabs.TabPanel>
      </Tabs>
    </div>
  );
}