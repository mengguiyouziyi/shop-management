import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PosPage from '../../components/POS/PosPage';

describe('PosPage', () => {
  it('should update input when pressing keys', () => {
    render(<PosPage />);
    
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));
    
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    expect(input.value).toContain('123');
  });

  it('should clear input', () => {
    render(<PosPage />);
    
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('清除'));
    
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    expect(input.value).toBe('');
  });
});