import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import HelpPage from '../../pages/help/index';

describe('HelpPage', () => {
  it('should render help page', () => {
    render(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    );

    expect(screen.getByText('系统帮助文档')).toBeInTheDocument();
  });

  it('should display all tabs', () => {
    render(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    );

    expect(screen.getByText('系统介绍')).toBeInTheDocument();
    expect(screen.getByText('店铺管理')).toBeInTheDocument();
    expect(screen.getByText('店铺层级')).toBeInTheDocument();
    expect(screen.getByText('跨店铺报表')).toBeInTheDocument();
    expect(screen.getByText('资源共享')).toBeInTheDocument();
    expect(screen.getByText('总部-分店管理')).toBeInTheDocument();
  });

  it('should display introduction content', () => {
    render(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    );

    expect(screen.getByText('多店铺管理系统介绍')).toBeInTheDocument();
    expect(screen.getByText('主要功能')).toBeInTheDocument();
    expect(screen.getByText('系统特点')).toBeInTheDocument();
  });

  it('should display store management content', () => {
    render(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    );

    // Click on the store management tab
    const storeTab = screen.getByText('店铺管理');
    storeTab.click();

    expect(screen.getByText('店铺管理')).toBeInTheDocument();
    expect(screen.getByText('创建店铺')).toBeInTheDocument();
    expect(screen.getByText('编辑店铺')).toBeInTheDocument();
    expect(screen.getByText('删除店铺')).toBeInTheDocument();
  });

  it('should display hierarchy content', () => {
    render(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    );

    // Click on the hierarchy tab
    const hierarchyTab = screen.getByText('店铺层级');
    hierarchyTab.click();

    expect(screen.getByText('店铺层级管理')).toBeInTheDocument();
    expect(screen.getByText('层级结构')).toBeInTheDocument();
    expect(screen.getByText('查看层级')).toBeInTheDocument();
  });
});