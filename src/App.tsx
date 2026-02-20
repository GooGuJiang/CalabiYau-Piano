import { useCallback, useEffect, useRef, useState } from 'react'
import { IoMusicalNotes } from 'react-icons/io5'

function App() {
  const ctxRef = useRef<AudioContext | null>(null)
  const buffersRef = useRef<Map<number, AudioBuffer>>(new Map())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const ctx = new AudioContext()
    ctxRef.current = ctx
    Promise.all(
      Array.from({ length: 16 }, (_, i) => {
        const id = i + 1
        return fetch(`/ogg/${id}.ogg`)
          .then(r => r.arrayBuffer())
          .then(buf => ctx.decodeAudioData(buf))
          .then(decoded => buffersRef.current.set(id, decoded))
      })
    ).then(() => setLoaded(true))
    return () => { ctx.close() }
  }, [])

  const play = useCallback((id: number) => {
    const ctx = ctxRef.current
    const buffer = buffersRef.current.get(id)
    if (!ctx || !buffer) return
    if (ctx.state === 'suspended') ctx.resume()
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(ctx.destination)
    source.start(0)
  }, [])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#3a3540]">
      <div className="flex gap-4 rounded-2xl bg-[#6b6070] p-5 shadow-2xl">
        {/* Left Panel */}
        <div className="flex w-28 flex-col gap-3">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-[#8a7e90]/40 p-3">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-[#4a4050] shadow-inner border-2 border-[#5a5060]" />
              <div className="h-8 w-3 rounded bg-[#4a4050] shadow-inner" />
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-[#4a4050] shadow-inner border-2 border-[#5a5060]" />
              <div className="h-8 w-3 rounded bg-[#4a4050] shadow-inner" />
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-[#8a7e90]/40 p-3">
            <div className="h-7 rounded bg-[#9a7080]" />
            <div className="h-7 rounded bg-[#8a8070]" />
            <div className="h-7 rounded bg-[#7a8a70]" />
          </div>
          <div className="flex flex-1 items-center justify-center rounded-xl bg-[#8a7e90]/40 p-3">
            <IoMusicalNotes className="text-5xl text-[#7a7080]" />
          </div>
        </div>

        {/* 4x4 Pad Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[13,14,15,16,9,10,11,12,5,6,7,8,1,2,3,4].map(id => (
            <Pad key={id} id={id} onPlay={play} loaded={loaded} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Pad({ id, onPlay, loaded }: { id: number; onPlay: (id: number) => void; loaded: boolean }) {
  return (
    <button
      onMouseDown={() => onPlay(id)}
      disabled={!loaded}
      className="group relative h-24 w-24 cursor-pointer select-none rounded-lg bg-[#6a5560] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3),4px_4px_8px_rgba(0,0,0,0.4)] transition-all duration-75 active:scale-95 active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] active:bg-[#7a6570] hover:bg-[#7a6068] disabled:opacity-50"
    >
      <span className="absolute bottom-1.5 left-2 text-xs font-medium text-[#8a7580] select-none">
        PAD {id}
      </span>
    </button>
  )
}

export default App
