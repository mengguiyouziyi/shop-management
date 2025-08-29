import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import AboutPage from '../../pages/about/index';

describe('AboutPage', () => {
  it('should render about page', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('关于系统')).toBeInTheDocument();
  });

  it('should display system information', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('系统信息')).toBeInTheDocument();
    expect(screen.getByText('多店铺管理系统')).toBeInTheDocument();
    expect(screen.getByText('专为连锁店铺设计的综合管理系统，支持总部-分店管理模式，提供统一的管理界面和分散的操作权限。')).toBeInTheDocument();
    expect(screen.getByText('版本 v1.0.0')).toBeInTheDocument();
  });

  it('should display system features', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('主要功能')).toBeInTheDocument();
    expect(screen.getByText('店铺层级管理')).toBeInTheDocument();
    expect(screen.getByText('权限控制')).toBeInTheDocument();
    expect(screen.getByText('跨店铺报表')).toBeInTheDocument();
    expect(screen.getByText('资源共享')).toBeInTheDocument();
  });

  it('should display technologies', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('技术栈')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('TDesign')).toBeInTheDocument();
  });

  it('should display system status', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('系统状态')).toBeInTheDocument();
    expect(screen.getByText('运行状态')).toBeInTheDocument();
    expect(screen.getByText('连接状态')).toBeInTheDocument();
    expect(screen.getByText('数据状态')).toBeInTheDocument();
  });

  it('should display team members', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('开发团队')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('项目经理')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
    expect(screen.getByText('前端开发')).toBeInTheDocument();
  });

  it('should display contact information', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('联系我们')).toBeInTheDocument();
    expect(screen.getByText('客服电话:')).toBeInTheDocument();
    expect(screen.getByText('技术支持:')).toBeInTheDocument();
    expect(screen.getByText('官方网站:')).toBeInTheDocument();
  });
});