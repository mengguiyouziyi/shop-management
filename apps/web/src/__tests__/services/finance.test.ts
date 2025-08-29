import { describe, it, expect } from 'vitest'
import { calculateDailyReport } from '../../services/finance'

describe('财务服务', () => {
  it('应正确计算日报表', () => {
    const transactions = [
      { amount: 100, type: 'income' as const },
      { amount: 50, type: 'income' as const },
      { amount: 30, type: 'expense' as const },
      { amount: 20, type: 'expense' as const }
    ]

    const report = calculateDailyReport(transactions)
    
    expect(report.totalIncome).toBe(150)
    expect(report.totalExpense).toBe(50)
    expect(report.balance).toBe(100)
  })

  it('应正确处理只有收入的情况', () => {
    const transactions = [
      { amount: 100, type: 'income' as const },
      { amount: 50, type: 'income' as const }
    ]

    const report = calculateDailyReport(transactions)
    
    expect(report.totalIncome).toBe(150)
    expect(report.totalExpense).toBe(0)
    expect(report.balance).toBe(150)
  })

  it('应正确处理只有支出的情况', () => {
    const transactions = [
      { amount: 30, type: 'expense' as const },
      { amount: 20, type: 'expense' as const }
    ]

    const report = calculateDailyReport(transactions)
    
    expect(report.totalIncome).toBe(0)
    expect(report.totalExpense).toBe(50)
    expect(report.balance).toBe(-50)
  })

  it('应正确处理空交易列表', () => {
    const transactions: Array<{amount: number, type: 'income' | 'expense'}> = []

    const report = calculateDailyReport(transactions)
    
    expect(report.totalIncome).toBe(0)
    expect(report.totalExpense).toBe(0)
    expect(report.balance).toBe(0)
  })
})