// 简谱映射：padId -> 简谱标注
const JIANPU_MAP: Record<number, string> = {
  1: '1̣', 2: '2̣', 3: '3̣', 4: '4̣', 5: '5̣', 6: '6̣', 7: '7̣',
  8: '1', 9: '2', 10: '3', 11: '4', 12: '5', 13: '6', 14: '7',
  15: '1̇', 16: '2̇',
}

// padId -> 显示名
const PAD_NAMES: Record<number, string> = {
  1: '低1', 2: '低2', 3: '低3', 4: '低4', 5: '低5', 6: '低6', 7: '低7',
  8: '中1', 9: '中2', 10: '中3', 11: '中4', 12: '中5', 13: '中6', 14: '中7',
  15: '高1', 16: '高2',
}

export function getJianpu(padId: number): string {
  return JIANPU_MAP[padId] ?? String(padId)
}

export function getPadName(padId: number): string {
  return PAD_NAMES[padId] ?? `PAD ${padId}`
}

// 钢琴窗中从上到下的 padId 排列（高音在上）
export const PIANO_ROW_IDS = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
