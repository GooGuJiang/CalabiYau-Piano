import type { Note } from '../types'

export class PlaybackEngine {
  private timer: number | null = null
  private startTime = 0
  private bpm = 120
  private notes: Note[] = []
  private playFn: (padId: number) => void
  private onBeat: (beat: number) => void
  private onEnd: () => void
  private played = new Set<string>()
  private totalBeats = 32

  constructor(playFn: (id: number) => void, onBeat: (b: number) => void, onEnd: () => void) {
    this.playFn = playFn
    this.onBeat = onBeat
    this.onEnd = onEnd
  }

  start(bpm: number, notes: Note[], totalBeats: number, startBeat = 0) {
    this.stop()
    this.bpm = bpm
    this.notes = notes
    this.totalBeats = totalBeats
    this.played.clear()
    const beatDur = 60 / bpm
    this.startTime = performance.now() - startBeat * beatDur * 1000

    const tick = () => {
      const elapsed = (performance.now() - this.startTime) / 1000
      const beat = elapsed / beatDur
      if (beat >= this.totalBeats) { this.stop(); this.onEnd(); return }
      this.onBeat(beat)
      // 触发该拍范围内的音符
      for (const n of this.notes) {
        if (!this.played.has(n.id) && beat >= n.startBeat) {
          this.played.add(n.id)
          this.playFn(n.padId)
        }
      }
      this.timer = requestAnimationFrame(tick)
    }
    this.timer = requestAnimationFrame(tick)
  }

  stop() {
    if (this.timer !== null) { cancelAnimationFrame(this.timer); this.timer = null }
  }
}
