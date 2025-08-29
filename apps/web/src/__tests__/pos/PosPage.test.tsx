import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PosPage from '../../components/POS/PosPage'

describe('PosPage', () => {
  it('should update amount when keys are pressed', () => {
    render(<PosPage />)
    
    // 点击数字键
    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('3'))
    
    // 检查金额显示
    expect(screen.getByText('¥ 123.00')).toBeInTheDocument()
  })

  it('should clear amount when clear button is pressed', () => {
    render(<PosPage />)
    
    // 输入一些数字
    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('2'))
    
    // 点击清除按钮
    fireEvent.click(screen.getByText('清除'))
    
    // 检查金额是否被清除
    expect(screen.getByText('¥ 0.00')).toBeInTheDocument()
  })
})