import { useCallback, useRef, useState } from 'react'
import { PianoKeys } from './PianoKeys'
import { NoteGrid } from './NoteGrid'
import { useProject } from '../context/ProjectContext'

const BASE_BEAT_W = 40
const DEFAULT_ROW_H = 24

export function PianoRoll({ onPlay }: { onPlay: (id: number) => void }) {
  const { project } = useProject()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [rowH, setRowH] = useState(DEFAULT_ROW_H)
  const midDragRef = useRef<{ sx: number; sy: number; slx: number; sly: number } | null>(null)
  const heightDragRef = useRef<{ startY: number; origH: number } | null>(null)

  const beatW = BASE_BEAT_W * zoom
  const totalBeats = project.totalBars * project.beatsPerBar
  const gridW = totalBeats * beatW
  const gridH = rowH * 16

  // Alt+滚轮=缩放, Shift+滚轮=水平滚动, 普通滚轮=垂直滚动
  const onWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollRef.current
    if (!el) return
    if (e.altKey) {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const mouseX = e.clientX - rect.left + el.scrollLeft
      const oldZoom = zoom
      const newZoom = Math.min(4, Math.max(0.25, oldZoom * (e.deltaY < 0 ? 1.15 : 0.87)))
      setZoom(newZoom)
      requestAnimationFrame(() => {
        el.scrollLeft = mouseX * (newZoom / oldZoom) - (e.clientX - rect.left)
      })
    } else if (e.shiftKey) {
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
  }, [zoom])

  // 中键拖动
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 1) return
    e.preventDefault()
    const el = scrollRef.current
    if (!el) return
    midDragRef.current = { sx: e.clientX, sy: e.clientY, slx: el.scrollLeft, sly: el.scrollTop }
    const onMove = (ev: MouseEvent) => {
      if (!midDragRef.current || !el) return
      el.scrollLeft = midDragRef.current.slx - (ev.clientX - midDragRef.current.sx)
      el.scrollTop = midDragRef.current.sly - (ev.clientY - midDragRef.current.sy)
    }
    const onUp = () => {
      midDragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [])

  // 右上角行高拖动
  const onHeightDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    heightDragRef.current = { startY: e.clientY, origH: rowH }
    const onMove = (ev: MouseEvent) => {
      if (!heightDragRef.current) return
      const dy = ev.clientY - heightDragRef.current.startY
      setRowH(Math.min(60, Math.max(12, heightDragRef.current.origH + dy * 0.3)))
    }
    const onUp = () => {
      heightDragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [rowH])

  const [, forceUpdate] = useState(0)
  const barNumbers = Array.from({ length: project.totalBars }, (_, i) => i + 1)

  return (
    <div className="flex h-full flex-col bg-[#1e1e20]">
      {/* 标尺行 */}
      <div className="flex shrink-0">
        <div className="shrink-0 bg-[#2b2b2e] border-b border-r border-[#3f3f46]" style={{ width: 64, height: 20 }} />
        <div className="relative flex-1 overflow-hidden bg-[#2b2b2e] border-b border-[#3f3f46]" style={{ height: 20 }}>
          <div style={{ width: gridW, marginLeft: -(scrollRef.current?.scrollLeft ?? 0) }} className="flex">
            {barNumbers.map(n => (
              <div key={n} className="shrink-0 text-[10px] text-[#888] pl-1 border-l border-[#3f3f46]" style={{ width: project.beatsPerBar * beatW }}>
                {n}
              </div>
            ))}
          </div>
          {/* 右上角行高调节手柄 */}
          <div
            className="absolute right-0 top-0 h-full w-5 cursor-ns-resize flex items-center justify-center bg-[#333] hover:bg-[#444] border-l border-[#3f3f46]"
            onMouseDown={onHeightDragStart}
            title="拖动调整行高"
          >
            <svg width="8" height="10" viewBox="0 0 8 10" className="text-[#888]">
              <path d="M0 3L4 0L8 3M0 7L4 10L8 7" stroke="currentColor" fill="none" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* 主体 */}
      <div className="flex flex-1 overflow-hidden">
        <div className="shrink-0 overflow-hidden bg-[#2b2b2e]" style={{ width: 64 }}>
          <div style={{ marginTop: -(scrollRef.current?.scrollTop ?? 0) }}>
            <PianoKeys onPlay={onPlay} rowH={rowH} />
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 overflow-auto piano-scroll"
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onScroll={() => forceUpdate(n => n + 1)}
        >
          <NoteGrid beatW={beatW} gridW={gridW} gridH={gridH} rowH={rowH} />
        </div>
      </div>
    </div>
  )
}
