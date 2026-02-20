import { useCallback, useEffect, useRef, useState } from 'react'
import { IoMusicalNotes } from 'react-icons/io5'
import { LeftPanel } from './components/LeftPanel'
import { PadGrid } from './components/PadGrid'
import { FloatingWindow } from './components/FloatingWindow'
import { PianoRoll } from './components/PianoRoll'
import { PianoRollToolbar } from './components/PianoRollToolbar'
import { ProjectProvider, useProject, useDispatch } from './context/ProjectContext'
import { PlaybackEngine } from './utils/playback'
import { Recorder } from './utils/recorder'

function AppInner() {
  const ctxRef = useRef<AudioContext | null>(null)
  const buffersRef = useRef<Map<number, AudioBuffer>>(new Map())
  const engineRef = useRef<PlaybackEngine | null>(null)
  const recorderRef = useRef<Recorder>(new Recorder())
  const [loaded, setLoaded] = useState(false)
  const { project, isPlaying, isRecording, pianoRollOpen } = useProject()
  const dispatch = useDispatch()

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

  const padPlay = useCallback((id: number) => {
    play(id)
    if (isRecording) {
      const note = recorderRef.current.record(id)
      dispatch({ type: 'ADD_NOTE', note })
    }
  }, [play, isRecording, dispatch])

  useEffect(() => {
    engineRef.current = new PlaybackEngine(
      play,
      (beat) => dispatch({ type: 'SET_CURRENT_BEAT', beat }),
      () => { dispatch({ type: 'SET_PLAYING', value: false }); dispatch({ type: 'SET_CURRENT_BEAT', beat: 0 }) }
    )
    return () => engineRef.current?.stop()
  }, [play, dispatch])

  const onPlayToggle = useCallback(() => {
    if (isPlaying) {
      engineRef.current?.stop()
      dispatch({ type: 'SET_PLAYING', value: false })
    } else {
      const totalBeats = project.totalBars * project.beatsPerBar
      engineRef.current?.start(project.bpm, project.notes, totalBeats)
      dispatch({ type: 'SET_PLAYING', value: true })
    }
  }, [isPlaying, project, dispatch])

  const onStop = useCallback(() => {
    engineRef.current?.stop()
    dispatch({ type: 'SET_PLAYING', value: false })
    dispatch({ type: 'SET_CURRENT_BEAT', beat: 0 })
  }, [dispatch])

  const onRecordToggle = useCallback(() => {
    if (isRecording) {
      recorderRef.current.stop()
      dispatch({ type: 'SET_RECORDING', value: false })
    } else {
      recorderRef.current.start(project.bpm)
      dispatch({ type: 'SET_RECORDING', value: true })
    }
  }, [isRecording, project.bpm, dispatch])

  return (
    <div className="relative min-h-screen w-screen bg-[#3a3540]">
      {/* 左上角钢琴窗按钮 */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_PIANO_ROLL' })}
        className="fixed top-4 left-4 z-40 flex items-center gap-1.5 rounded-lg bg-[#7a90d0] px-3 py-1.5 text-sm text-white hover:bg-[#8aa0e0] transition-colors shadow-lg"
      >
        <IoMusicalNotes /> {pianoRollOpen ? '关闭钢琴窗' : '打开钢琴窗'}
      </button>

      {/* 打击垫主界面 */}
      <div className="flex min-h-screen w-screen items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-[#6b6070] p-4 shadow-2xl sm:max-w-none sm:w-auto sm:flex-row sm:p-5">
          <LeftPanel />
          <PadGrid onPlay={padPlay} loaded={loaded} />
        </div>
      </div>

      {/* 钢琴窗浮动窗口 */}
      <FloatingWindow title="钢琴窗 - Piano Roll" open={pianoRollOpen} onClose={() => dispatch({ type: 'TOGGLE_PIANO_ROLL' })}>
        <div className="flex h-full flex-col">
          <PianoRollToolbar onPlayToggle={onPlayToggle} onStop={onStop} onRecordToggle={onRecordToggle} />
          <div className="flex-1 overflow-hidden">
            <PianoRoll onPlay={play} />
          </div>
        </div>
      </FloatingWindow>
    </div>
  )
}

function App() {
  return (
    <ProjectProvider>
      <AppInner />
    </ProjectProvider>
  )
}

export default App
