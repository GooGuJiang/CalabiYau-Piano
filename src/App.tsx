import { useCallback, useEffect, useRef, useState } from 'react'
import { LeftPanel } from './components/LeftPanel'
import { PadGrid } from './components/PadGrid'

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
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#3a3540] p-4">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-[#6b6070] p-4 shadow-2xl sm:max-w-none sm:w-auto sm:flex-row sm:p-5">
        <LeftPanel />
        <PadGrid onPlay={play} loaded={loaded} />
      </div>
    </div>
  )
}

export default App
