export interface Note {
  id: string
  padId: number        // 1-16
  startBeat: number    // 起始拍（支持小数，0.25=十六分音符）
  duration: number     // 持续拍数
}

export interface Project {
  name: string
  bpm: number
  beatsPerBar: number
  totalBars: number
  notes: Note[]
}

export type Tool = 'draw' | 'erase'
