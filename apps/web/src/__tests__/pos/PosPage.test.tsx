import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PosPage from '../../components/POS/PosPage'

describe('PosPage', () => {
  it('should update amount when keys are pressed', () => {
    render(<PosPage />)
    
    // 点击数字键
    const button1 = screen.getAllByText('1')[0];
    const button2 = screen.getAllByText('2')[0];
    const button3 = screen.getAllByText('3')[0];
    
    fireEvent.click(button1)
    fireEvent.click(button2)
    fireEvent.click(button3)
    
    // 检查金额显示
    expect(screen.getByText('¥ 123.00')).toBeInTheDocument()
  })

  it('should clear amount when clear button is pressed', () => {
    render(<PosPage />)
    
    // 输入一些数字
    const button1 = screen.getAllByText('1')[0];
    const button2 = screen.getAllByText('2')[0];
    
    fireEvent.click(button1)
    fireEvent.click(button2)
    
    // 点击清除按钮
    const clearButtons = screen.getAllByText('清除');
    fireEvent.click(clearButtons[0])
    
    // 检查金额是否被清除
    const amountDisplays = screen.getAllByText('¥ 0.00');
    expect(amountDisplays[0]).toBeInTheDocument()
  })
})