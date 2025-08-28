interface Transaction {
  amount: number
  type: 'income' | 'expense'
}

export function calculateDailyReport(transactions: Transaction[]) {
  const report = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  }

  transactions.forEach(t => {
    if (t.type === 'income') {
      report.totalIncome += t.amount
    } else {
      report.totalExpense += t.amount
    }
  })

  report.balance = report.totalIncome - report.totalExpense
  return report
}