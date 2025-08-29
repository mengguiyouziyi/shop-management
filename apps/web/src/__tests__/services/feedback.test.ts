import { describe, it, expect, beforeEach } from 'vitest';
import { FeedbackService, Feedback } from '../../services/feedback';

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;

  beforeEach(() => {
    feedbackService = FeedbackService.getInstance();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should get instance', () => {
    expect(feedbackService).toBeDefined();
    const anotherInstance = FeedbackService.getInstance();
    expect(anotherInstance).toBe(feedbackService);
  });

  it('should submit feedback', async () => {
    const feedbackData = {
      userId: 'user1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      type: 'feature' as const,
      title: '新功能建议',
      description: '希望增加库存预警功能',
      priority: 'medium' as const
    };

    const feedback = await feedbackService.submitFeedback(feedbackData);
    
    expect(feedback).toBeDefined();
    expect(feedback.id).toBeDefined();
    expect(feedback.title).toBe(feedbackData.title);
    expect(feedback.status).toBe('submitted');
    expect(feedback.createdAt).toBeDefined();
    expect(feedback.updatedAt).toBeDefined();
  });

  it('should get all feedbacks', async () => {
    // 提交几个反馈
    await feedbackService.submitFeedback({
      userId: 'user1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      type: 'bug',
      title: 'Bug报告1',
      description: '描述1',
      priority: 'high'
    });

    await feedbackService.submitFeedback({
      userId: 'user2',
      userName: '李四',
      userEmail: 'lisi@example.com',
      type: 'feature',
      title: '功能建议1',
      description: '描述2',
      priority: 'medium'
    });

    const feedbacks = await feedbackService.getAllFeedbacks();
    expect(feedbacks).toBeDefined();
    expect(Array.isArray(feedbacks)).toBe(true);
    expect(feedbacks.length).toBeGreaterThanOrEqual(2);
    
    // 验证反馈按时间倒序排列
    const firstFeedbackDate = new Date(feedbacks[0].createdAt).getTime();
    const secondFeedbackDate = new Date(feedbacks[1].createdAt).getTime();
    expect(firstFeedbackDate).toBeGreaterThanOrEqual(secondFeedbackDate);
  });

  it('should get feedbacks by user', async () => {
    // 提交几个反馈
    await feedbackService.submitFeedback({
      userId: 'user1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      type: 'bug',
      title: 'Bug报告1',
      description: '描述1',
      priority: 'high'
    });

    await feedbackService.submitFeedback({
      userId: 'user2',
      userName: '李四',
      userEmail: 'lisi@example.com',
      type: 'feature',
      title: '功能建议1',
      description: '描述2',
      priority: 'medium'
    });

    const userFeedbacks = await feedbackService.getFeedbacksByUser('user1');
    expect(userFeedbacks).toBeDefined();
    expect(Array.isArray(userFeedbacks)).toBe(true);
    expect(userFeedbacks.length).toBe(1);
    expect(userFeedbacks[0].userId).toBe('user1');
  });

  it('should get feedbacks by status', async () => {
    // 提交反馈
    const feedback = await feedbackService.submitFeedback({
      userId: 'user1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      type: 'bug',
      title: 'Bug报告1',
      description: '描述1',
      priority: 'high'
    });

    const statusFeedbacks = await feedbackService.getFeedbacksByStatus('submitted');
    expect(statusFeedbacks).toBeDefined();
    expect(Array.isArray(statusFeedbacks)).toBe(true);
    expect(statusFeedbacks.length).toBeGreaterThanOrEqual(1);
    expect(statusFeedbacks[0].status).toBe('submitted');
  });

  it('should get feedbacks by type', async () => {
    // 提交反馈
    await feedbackService.submitFeedback({
      userId: 'user1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      type: 'bug',
      title: 'Bug报告1',
      description: '描述1',
      priority: 'high'
    });

    const typeFeedbacks = await feedbackService.getFeedbacksByType('bug');
    expect(typeFeedbacks).toBeDefined();
    expect(Array.isArray(typeFeedbacks)).toBe(true);
    expect(typeFeedbacks.length).toBeGreaterThanOrEqual(1);
    expect(typeFeedbacks[0].type).toBe('bug');
  });

  it('should update feedback status', async () => {
    // 提交反馈
    const feedback = await feedbackService.submitFeedback({
      userId: 'user1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      type: 'bug',
      title: 'Bug报告1',
      description: '描述1',
      priority: 'high'
    });

    // 等待一点时间确保时间戳不同
    await new Promise(resolve => setTimeout(resolve, 10));

    // 更新状态
    const updatedFeedback = await feedbackService.updateFeedbackStatus(feedback.id, 'reviewed');
    expect(updatedFeedback).toBeDefined();
    expect(updatedFeedback?.status).toBe('reviewed');
    expect(updatedFeedback?.updatedAt).not.toBe(feedback.updatedAt);
  });

  it('should delete feedback', async () => {
    // 提交反馈
    const feedback = await feedbackService.submitFeedback({
      userId: 'user1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      type: 'bug',
      title: 'Bug报告1',
      description: '描述1',
      priority: 'high'
    });

    // 删除反馈
    const result = await feedbackService.deleteFeedback(feedback.id);
    expect(result).toBe(true);

    // 验证反馈已删除
    const feedbacks = await feedbackService.getAllFeedbacks();
    const deletedFeedback = feedbacks.find(f => f.id === feedback.id);
    expect(deletedFeedback).toBeUndefined();
  });

  it('should get feedback stats', async () => {
    // 提交不同类型和状态的反馈
    await feedbackService.submitFeedback({
      userId: 'user1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      type: 'bug',
      title: 'Bug报告1',
      description: '描述1',
      priority: 'high'
    });

    await feedbackService.submitFeedback({
      userId: 'user2',
      userName: '李四',
      userEmail: 'lisi@example.com',
      type: 'feature',
      title: '功能建议1',
      description: '描述2',
      priority: 'medium'
    });

    const stats = await feedbackService.getFeedbackStats();
    expect(stats).toBeDefined();
    expect(stats.total).toBeGreaterThanOrEqual(2);
    expect(stats.bug).toBeGreaterThanOrEqual(1);
    expect(stats.feature).toBeGreaterThanOrEqual(1);
  });
});