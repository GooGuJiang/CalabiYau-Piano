import { useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProject, useDispatch } from '../context/ProjectContext'
import { PIANO_ROW_IDS } from '../utils/jianpu'

const SUB = 4

interface Props {
  beatW: number
  gridW: number
  gridH: number
  rowH: number
}

export function NoteGrid({ beatW, gridW, gridH, rowH }: Props) {
  const { project, currentBeat, isPlaying } = useProject()
  const dispatch = useDispatch()
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ noteId: string; startX: number; origBeat: number; origDur: number; mode: 'move' | 'resize' } | null>(null)

  const totalBeats = project.totalBars * project.beatsPerBar

  const toBeatRow = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return null
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const beat = Math.floor(x / beatW * SUB) / SUB
    const rowIdx = Math.floor(y / rowH)
    if (rowIdx < 0 || rowIdx >= 16) return null
    return { beat, padId: PIANO_ROW_IDS[rowIdx] }
  }, [beatW])

  // 左键放置
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    const pos = toBeatRow(e)
    if (!pos) return
    const overlap = project.notes.some(n =>
      n.padId === pos.padId && pos.beat < n.startBeat + n.duration && pos.beat + 0.25 > n.startBeat
    )
    if (!overlap) {
      dispatch({ type: 'ADD_NOTE', note: { id: crypto.randomUUID(), padId: pos.padId, startBeat: pos.beat, duration: 0.25 } })
    }
  }, [toBeatRow, project.notes, dispatch])

  // 右键删除
  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const pos = toBeatRow(e)
    if (!pos) return
    const hit = project.notes.find(n =>
      n.padId === pos.padId && pos.beat >= n.startBeat && pos.beat < n.startBeat + n.duration
    )
    if (hit) dispatch({ type: 'REMOVE_NOTE', id: hit.id })
  }, [toBeatRow, project.notes, dispatch])

  // 音符拖拽
  const onNoteMouseDown = useCallback((e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    if (e.button !== 0) return
    const note = project.notes.find(n => n.id === noteId)
    if (!note) return
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const isResize = e.clientX > rect.right - 8
    dragRef.current = { noteId, startX: e.clientX, origBeat: note.startBeat, origDur: note.duration, mode: isResize ? 'resize' : 'move' }

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dBeats = Math.round(dx / beatW * SUB) / SUB
      const notes = project.notes.map(n => {
        if (n.id !== dragRef.current!.noteId) return n
        if (dragRef.current!.mode === 'resize') return { ...n, duration: Math.max(0.25, dragRef.current!.origDur + dBeats) }
        return { ...n, startBeat: Math.max(0, dragRef.current!.origBeat + dBeats) }
      })
      dispatch({ type: 'SET_NOTES', notes })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [project.notes, beatW, dispatch])

  return (
    <div className="relative" ref={containerRef} style={{ width: gridW, height: gridH }}>
      {/* 网格 */}
      <svg className="absolute inset-0 pointer-events-none" width={gridW} height={gridH}>
        {PIANO_ROW_IDS.map((_, i) => (
          <line key={`r${i}`} x1={0} y1={i * rowH} x2={gridW} y2={i * rowH} stroke="#3a3a3d" />
        ))}
        {Array.from({ length: totalBeats + 1 }, (_, i) => (
          <line key={`b${i}`} x1={i * beatW} y1={0} x2={i * beatW} y2={gridH}
            stroke={i % project.beatsPerBar === 0 ? '#4a4a4e' : '#333336'} strokeWidth={i % project.beatsPerBar === 0 ? 1.5 : 0.5} />
        ))}
        {Array.from({ length: totalBeats * SUB }, (_, i) => {
          if (i % SUB === 0) return null
          return <line key={`s${i}`} x1={i * beatW / SUB} y1={0} x2={i * beatW / SUB} y2={gridH} stroke="#2c2c30" strokeWidth={0.5} />
        })}
      </svg>

      {/* 音符 */}
      <AnimatePresence>
        {project.notes.map(note => {
          const rowIdx = PIANO_ROW_IDS.indexOf(note.padId)
          if (rowIdx === -1) return null
          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.1 }}
              className="absolute rounded-sm bg-[#7a90d0] border border-[#8aa0e0] cursor-grab active:cursor-grabbing hover:brightness-125"
              style={{
                left: note.startBeat * beatW,
                top: rowIdx * rowH + 1,
                width: Math.max(4, note.duration * beatW - 1),
                height: rowH - 2,
              }}
              onMouseDown={e => onNoteMouseDown(e, note.id)}
              onContextMenu={e => { e.preventDefault(); e.stopPropagation(); dispatch({ type: 'REMOVE_NOTE', id: note.id }) }}
            >
              <div className="absolute right-0 top-0 h-full w-2 cursor-e-resize" />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* 播放头 */}
      {isPlaying && (
        <div
          className="absolute top-0 w-0.5 bg-red-400 pointer-events-none z-10"
          style={{ height: gridH, left: currentBeat * beatW }}
        />
      )}

      {/* 点击层 */}
      <div className="absolute inset-0" onMouseDown={onMouseDown} onContextMenu={onContextMenu} />
    </div>
  )
}
