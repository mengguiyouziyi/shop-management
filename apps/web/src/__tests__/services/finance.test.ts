import { describe, it, expect } from 'vitest'
import { calculateDailyReport } from '../../services/finance'

describe('财务服务', () => {
  it('应正确计算日报表', () => {
    const testData = [
      { amount: 100, type: 'income' },
      { amount: 50, type: 'expense' }
    ]
    const result = calculateDailyReport(testData)
    expect(result.totalIncome).toBe(100)
    expect(result.totalExpense).toBe(50)
    expect(result.balance).toBe(50)
  })
})