import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import FeedbackPage from '../../pages/feedback/index';

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    currentUser: {
      id: 'user1',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'admin'
    }
  })
}));

describe('FeedbackPage', () => {
  it('should render feedback page', () => {
    render(
      <MemoryRouter>
        <FeedbackPage />
      </MemoryRouter>
    );

    expect(screen.getByText('用户反馈')).toBeInTheDocument();
  });

  it('should display tabs', () => {
    render(
      <MemoryRouter>
        <FeedbackPage />
      </MemoryRouter>
    );

    expect(screen.getByText('提交反馈')).toBeInTheDocument();
    expect(screen.getByText('我的反馈')).toBeInTheDocument();
  });

  it('should display feedback form', () => {
    render(
      <MemoryRouter>
        <FeedbackPage />
      </MemoryRouter>
    );

    expect(screen.getByText('反馈类型')).toBeInTheDocument();
    expect(screen.getByText('优先级')).toBeInTheDocument();
    expect(screen.getByText('标题')).toBeInTheDocument();
    expect(screen.getByText('详细描述')).toBeInTheDocument();
    expect(screen.getByText('提交反馈')).toBeInTheDocument();
    expect(screen.getByText('重置')).toBeInTheDocument();
  });

  it('should display feedback options', () => {
    render(
      <MemoryRouter>
        <FeedbackPage />
      </MemoryRouter>
    );

    // 反馈类型选项
    expect(screen.getByText('问题')).toBeInTheDocument();
    expect(screen.getByText('功能建议')).toBeInTheDocument();
    expect(screen.getByText('改进建议')).toBeInTheDocument();
    expect(screen.getByText('其他')).toBeInTheDocument();

    // 优先级选项
    expect(screen.getByText('低')).toBeInTheDocument();
    expect(screen.getByText('中')).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();
  });
});