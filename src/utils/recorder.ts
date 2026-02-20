import type { Note } from '../types'

export class Recorder {
  private startTime = 0
  private bpm = 120
  private notes: Note[] = []

  start(bpm: number) {
    this.bpm = bpm
    this.startTime = performance.now()
    this.notes = []
  }

  record(padId: number): Note {
    const elapsed = (performance.now() - this.startTime) / 1000
    const beatDur = 60 / this.bpm
    const startBeat = Math.round(elapsed / beatDur * 4) / 4 // 量化到十六分音符
    const note: Note = { id: crypto.randomUUID(), padId, startBeat, duration: 0.25 }
    this.notes.push(note)
    return note
  }

  stop(): Note[] {
    return this.notes
  }
}
