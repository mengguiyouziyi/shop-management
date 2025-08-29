export interface Member {
  id: string
  level: number
  points: number
  balance: number
}

export function calculatePoints(member: Member, pointsToAdd: number) {
  const newPoints = member.points + pointsToAdd
  // 升级阈值为200分
  const newLevel = newPoints >= 200 ? 2 : 1
  
  return {
    ...member,
    points: newPoints,
    level: newLevel
  }
}