import { describe, it, expect } from 'vitest'
import { calculatePoints, Member } from '../../services/member'

describe('会员服务', () => {
  const testMember: Member = {
    id: 'm001',
    level: 1,
    points: 100,
    balance: 500
  }

  it('应正确计算积分', () => {
    const result = calculatePoints(testMember, 50)
    expect(result.points).toBe(150)
  })

  it('应正确升级会员等级', () => {
    const result = calculatePoints(testMember, 200)
    expect(result.level).toBe(2)
  })
})