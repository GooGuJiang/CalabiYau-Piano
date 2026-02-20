import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoRemove, IoClose, IoSquareOutline } from 'react-icons/io5'

interface Props {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
  defaultWidth?: number
  defaultHeight?: number
}

export function FloatingWindow({ title, open, onClose, children, defaultWidth = 800, defaultHeight = 450 }: Props) {
  const [pos, setPos] = useState({ x: 100, y: 60 })
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight })
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const prevRef = useRef({ x: 100, y: 60, w: defaultWidth, h: defaultHeight })
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; ow: number; oh: number } | null>(null)

  const onDragStart = useCallback((e: MouseEvent) => {
    if (maximized) return
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: pos.x, oy: pos.y }
    const onMove = (ev: globalThis.MouseEvent) => {
      if (!dragRef.current) return
      setPos({
        x: dragRef.current.ox + ev.clientX - dragRef.current.startX,
        y: dragRef.current.oy + ev.clientY - dragRef.current.startY,
      })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos, maximized])

  const onResizeStart = useCallback((e: MouseEvent) => {
    if (maximized) return
    e.preventDefault()
    e.stopPropagation()
    resizeRef.current = { startX: e.clientX, startY: e.clientY, ow: size.w, oh: size.h }
    const onMove = (ev: globalThis.MouseEvent) => {
      if (!resizeRef.current) return
      setSize({
        w: Math.max(400, resizeRef.current.ow + ev.clientX - resizeRef.current.startX),
        h: Math.max(250, resizeRef.current.oh + ev.clientY - resizeRef.current.startY),
      })
    }
    const onUp = () => {
      resizeRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [size, maximized])

  const toggleMaximize = useCallback(() => {
    if (maximized) {
      setPos({ x: prevRef.current.x, y: prevRef.current.y })
      setSize({ w: prevRef.current.w, h: prevRef.current.h })
    } else {
      prevRef.current = { x: pos.x, y: pos.y, w: size.w, h: size.h }
      setPos({ x: 0, y: 0 })
      setSize({ w: window.innerWidth, h: window.innerHeight })
    }
    setMaximized(v => !v)
  }, [maximized, pos, size])

  const style = maximized
    ? { left: 0, top: 0, width: '100vw', height: '100vh' }
    : { left: pos.x, top: pos.y, width: size.w, height: minimized ? 'auto' : size.h }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 flex flex-col bg-[#2d2d30] shadow-2xl"
          style={{
            ...style,
            borderRadius: maximized ? 0 : 6,
            border: maximized ? 'none' : '1px solid #3f3f46',
          }}
        >
          {/* Windows 风格标题栏 */}
          <div
            className="flex items-center justify-between bg-[#323233] select-none"
            style={{ borderRadius: maximized ? 0 : '6px 6px 0 0' }}
            onMouseDown={onDragStart}
            onDoubleClick={toggleMaximize}
          >
            <span className="px-3 py-1 text-xs text-[#cccccc]">{title}</span>
            <div className="flex h-7">
              <button
                title="最小化"
                onClick={() => setMinimized(v => !v)}
                className="flex h-full w-11 items-center justify-center text-[#cccccc] hover:bg-[#3e3e40]"
              >
                <IoRemove className="text-sm" />
              </button>
              <button
                title="最大化"
                onClick={toggleMaximize}
                className="flex h-full w-11 items-center justify-center text-[#cccccc] hover:bg-[#3e3e40]"
              >
                <IoSquareOutline className="text-xs" />
              </button>
              <button
                title="关闭"
                onClick={onClose}
                className="flex h-full w-11 items-center justify-center text-[#cccccc] hover:bg-[#e81123] hover:text-white"
                style={{ borderRadius: maximized ? 0 : '0 6px 0 0' }}
              >
                <IoClose className="text-sm" />
              </button>
            </div>
          </div>

          {/* 内容区 */}
          {!minimized && (
            <div className="relative flex-1 overflow-hidden">
              {children}
              {!maximized && (
                <div className="absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize" onMouseDown={onResizeStart}>
                  <svg viewBox="0 0 16 16" className="h-full w-full text-[#555]">
                    <path d="M14 14L8 14L14 8Z" fill="currentColor" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
