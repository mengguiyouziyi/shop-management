import { StorageService } from './storage';

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'submitted' | 'reviewed' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export class FeedbackService {
  private static instance: FeedbackService;
  private storageService: StorageService;
  private readonly FEEDBACK_KEY = 'feedbacks';

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  public static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  // 提交反馈
  async submitFeedback(feedback: Omit<Feedback, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Feedback> {
    try {
      const now = new Date().toISOString();
      const newFeedback: Feedback = {
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...feedback,
        status: 'submitted',
        createdAt: now,
        updatedAt: now
      };

      const existingFeedbacks = await this.getAllFeedbacks();
      existingFeedbacks.push(newFeedback);
      await this.storageService.set(this.FEEDBACK_KEY, existingFeedbacks);
      
      return newFeedback;
    } catch (error) {
      console.error('提交反馈失败:', error);
      throw new Error('提交反馈失败');
    }
  }

  // 获取所有反馈
  async getAllFeedbacks(): Promise<Feedback[]> {
    try {
      const feedbacks = this.storageService.get<Feedback[]>(this.FEEDBACK_KEY) || [];
      return feedbacks.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('获取反馈列表失败:', error);
      return [];
    }
  }

  // 根据用户ID获取反馈
  async getFeedbacksByUser(userId: string): Promise<Feedback[]> {
    try {
      const allFeedbacks = await this.getAllFeedbacks();
      return allFeedbacks
        .filter(feedback => feedback.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('获取用户反馈失败:', error);
      return [];
    }
  }

  // 根据状态获取反馈
  async getFeedbacksByStatus(status: Feedback['status']): Promise<Feedback[]> {
    try {
      const allFeedbacks = await this.getAllFeedbacks();
      return allFeedbacks
        .filter(feedback => feedback.status === status)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('获取指定状态反馈失败:', error);
      return [];
    }
  }

  // 根据类型获取反馈
  async getFeedbacksByType(type: Feedback['type']): Promise<Feedback[]> {
    try {
      const allFeedbacks = await this.getAllFeedbacks();
      return allFeedbacks
        .filter(feedback => feedback.type === type)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('获取指定类型反馈失败:', error);
      return [];
    }
  }

  // 更新反馈状态
  async updateFeedbackStatus(feedbackId: string, status: Feedback['status']): Promise<Feedback | null> {
    try {
      const allFeedbacks = await this.getAllFeedbacks();
      const feedbackIndex = allFeedbacks.findIndex(f => f.id === feedbackId);
      
      if (feedbackIndex === -1) {
        return null;
      }

      allFeedbacks[feedbackIndex] = {
        ...allFeedbacks[feedbackIndex],
        status,
        updatedAt: new Date().toISOString()
      };

      await this.storageService.set(this.FEEDBACK_KEY, allFeedbacks);
      return allFeedbacks[feedbackIndex];
    } catch (error) {
      console.error('更新反馈状态失败:', error);
      throw new Error('更新反馈状态失败');
    }
  }

  // 删除反馈
  async deleteFeedback(feedbackId: string): Promise<boolean> {
    try {
      const allFeedbacks = await this.getAllFeedbacks();
      const filteredFeedbacks = allFeedbacks.filter(f => f.id !== feedbackId);
      
      if (filteredFeedbacks.length === allFeedbacks.length) {
        return false; // 未找到要删除的反馈
      }

      await this.storageService.set(this.FEEDBACK_KEY, filteredFeedbacks);
      return true;
    } catch (error) {
      console.error('删除反馈失败:', error);
      throw new Error('删除反馈失败');
    }
  }

  // 获取反馈统计信息
  async getFeedbackStats(): Promise<Record<string, number>> {
    try {
      const allFeedbacks = await this.getAllFeedbacks();
      
      const stats = {
        total: allFeedbacks.length,
        bug: allFeedbacks.filter(f => f.type === 'bug').length,
        feature: allFeedbacks.filter(f => f.type === 'feature').length,
        improvement: allFeedbacks.filter(f => f.type === 'improvement').length,
        other: allFeedbacks.filter(f => f.type === 'other').length,
        submitted: allFeedbacks.filter(f => f.status === 'submitted').length,
        reviewed: allFeedbacks.filter(f => f.status === 'reviewed').length,
        'in-progress': allFeedbacks.filter(f => f.status === 'in-progress').length,
        resolved: allFeedbacks.filter(f => f.status === 'resolved').length,
        closed: allFeedbacks.filter(f => f.status === 'closed').length
      };

      return stats;
    } catch (error) {
      console.error('获取反馈统计失败:', error);
      return {
        total: 0,
        bug: 0,
        feature: 0,
        improvement: 0,
        other: 0,
        submitted: 0,
        reviewed: 0,
        'in-progress': 0,
        resolved: 0,
        closed: 0
      };
    }
  }
}