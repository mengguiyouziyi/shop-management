import { render, screen, fireEvent } from '@testing-library/react';
import Numpad from '../../components/POS/NumPad';
import { describe, it, expect, vi } from 'vitest';

describe('Numpad', () => {
  it('should render all keys', () => {
    const mockFn = vi.fn();
    render(<Numpad onPress={mockFn} />);
    
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('.')).toBeInTheDocument();
    expect(screen.getByText('清除')).toBeInTheDocument();
  });

  it('should trigger onPress', () => {
    const mockFn = vi.fn();
    render(<div data-testid="numpad-container"><Numpad onPress={mockFn} /></div>);
    
    const container = screen.getByTestId('numpad-container');
    const buttons = container.querySelectorAll('button');
    
    // 找到包含'5'的按钮
    const button5 = Array.from(buttons).find(button => button.textContent === '5');
    
    if (button5) {
      fireEvent.click(button5);
      expect(mockFn).toHaveBeenCalledWith('5');
    } else {
      throw new Error('Button with text "5" not found');
    }
  });
});