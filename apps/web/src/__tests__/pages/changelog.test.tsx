import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import ChangelogPage from '../../pages/changelog/index';

describe('ChangelogPage', () => {
  it('should render changelog page', () => {
    render(
      <MemoryRouter>
        <ChangelogPage />
      </MemoryRouter>
    );

    expect(screen.getByText('系统更新日志')).toBeInTheDocument();
  });

  it('should display tabs', () => {
    render(
      <MemoryRouter>
        <ChangelogPage />
      </MemoryRouter>
    );

    expect(screen.getByText('全部更新')).toBeInTheDocument();
    expect(screen.getByText('新功能')).toBeInTheDocument();
    expect(screen.getByText('功能改进')).toBeInTheDocument();
    expect(screen.getByText('问题修复')).toBeInTheDocument();
  });

  it('should display changelog entries', () => {
    render(
      <MemoryRouter>
        <ChangelogPage />
      </MemoryRouter>
    );

    // Check for default entries
    expect(screen.getByText('多店铺管理系统上线')).toBeInTheDocument();
    expect(screen.getByText('系统帮助文档')).toBeInTheDocument();
    expect(screen.getByText('系统设置功能')).toBeInTheDocument();
  });

  it('should display category tags', () => {
    render(
      <MemoryRouter>
        <ChangelogPage />
      </MemoryRouter>
    );

    // Check for category tags
    expect(screen.getByText('新功能')).toBeInTheDocument();
  });

  it('should display filter options', () => {
    render(
      <MemoryRouter>
        <ChangelogPage />
      </MemoryRouter>
    );

    // Check for filter options
    expect(screen.getByText('版本:')).toBeInTheDocument();
    expect(screen.getByText('类型:')).toBeInTheDocument();
    expect(screen.getByText('全部版本')).toBeInTheDocument();
    expect(screen.getByText('全部类型')).toBeInTheDocument();
  });
});