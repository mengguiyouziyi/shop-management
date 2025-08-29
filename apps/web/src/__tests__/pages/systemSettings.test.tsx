import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import SystemSettingsPage from '../../pages/system-settings/index';
import { SystemSettingsService } from '../../services/systemSettings';

describe('SystemSettingsPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render system settings page', async () => {
    render(
      <MemoryRouter>
        <SystemSettingsPage />
      </MemoryRouter>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('系统设置')).toBeInTheDocument();
    });

    // Check that all sections are rendered
    expect(screen.getByText('公司信息')).toBeInTheDocument();
    expect(screen.getByText('货币设置')).toBeInTheDocument();
    expect(screen.getByText('打印设置')).toBeInTheDocument();
    expect(screen.getByText('税收设置')).toBeInTheDocument();
    expect(screen.getByText('库存设置')).toBeInTheDocument();
    expect(screen.getByText('会员设置')).toBeInTheDocument();
    expect(screen.getByText('多店铺设置')).toBeInTheDocument();
  });

  it('should display form fields', async () => {
    render(
      <MemoryRouter>
        <SystemSettingsPage />
      </MemoryRouter>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('系统设置')).toBeInTheDocument();
    });

    // Check company info fields
    expect(screen.getByPlaceholderText('请输入公司名称')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入公司地址')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入联系电话')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入电子邮箱')).toBeInTheDocument();

    // Check currency fields
    expect(screen.getByPlaceholderText('例如: CNY')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('例如: ¥')).toBeInTheDocument();

    // Check switch fields
    expect(screen.getByRole('switch', { name: '打印小票' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: '打印发票' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: '启用税收' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: '启用库存跟踪' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: '启用会员计划' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: '启用多店铺' })).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText('保存设置')).toBeInTheDocument();
    expect(screen.getByText('重置')).toBeInTheDocument();
  });

  it('should load default settings', async () => {
    render(
      <MemoryRouter>
        <SystemSettingsPage />
      </MemoryRouter>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('系统设置')).toBeInTheDocument();
    });

    // Check default values
    const currencyInput = screen.getByPlaceholderText('例如: CNY') as HTMLInputElement;
    expect(currencyInput.value).toBe('CNY');

    const currencySymbolInput = screen.getByPlaceholderText('例如: ¥') as HTMLInputElement;
    expect(currencySymbolInput.value).toBe('¥');

    // Check default switches
    const printReceiptSwitch = screen.getByRole('switch', { name: '打印小票' }) as HTMLInputElement;
    expect(printReceiptSwitch.checked).toBe(true);
  });

  it('should save settings', async () => {
    render(
      <MemoryRouter>
        <SystemSettingsPage />
      </MemoryRouter>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('系统设置')).toBeInTheDocument();
    });

    // Fill in some values
    const companyNameInput = screen.getByPlaceholderText('请输入公司名称') as HTMLInputElement;
    companyNameInput.value = 'Test Company';

    // Click save button
    const saveButton = screen.getByText('保存设置');
    saveButton.click();

    // Check that settings were saved
    await waitFor(() => {
      const settingsService = SystemSettingsService.getInstance();
      const settings = settingsService.getSystemSettings();
      expect(settings).not.toBeNull();
    });
  });
});