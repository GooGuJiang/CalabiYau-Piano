import { IoPlay, IoPause, IoStop, IoRadioButtonOn, IoPencil, IoTrash, IoDownload, IoFolderOpen } from 'react-icons/io5'
import { useProject, useDispatch } from '../context/ProjectContext'
import { exportProject, importProject } from '../utils/fileIO'
import type { Project } from '../types'

export function PianoRollToolbar({ onPlayToggle, onStop, onRecordToggle }: {
  onPlayToggle: () => void
  onStop: () => void
  onRecordToggle: () => void
}) {
  const { project, isPlaying, isRecording, tool } = useProject()
  const dispatch = useDispatch()

  return (
    <div className="flex items-center gap-2 border-b border-[#4a4050] bg-[#322e38] px-3 py-1.5 text-xs">
      {/* BPM */}
      <label className="text-[#a090b0]">BPM</label>
      <input
        type="number" min={30} max={300} value={project.bpm}
        onChange={e => dispatch({ type: 'SET_BPM', bpm: Number(e.target.value) || 120 })}
        className="w-14 rounded bg-[#1e1a24] px-1.5 py-0.5 text-center text-[#c0b0c8] border border-[#4a4050]"
      />

      {/* 小节数 */}
      <label className="text-[#a090b0] ml-2">小节</label>
      <input
        type="number" min={1} max={64} value={project.totalBars}
        onChange={e => dispatch({ type: 'SET_TOTAL_BARS', totalBars: Number(e.target.value) || 8 })}
        className="w-12 rounded bg-[#1e1a24] px-1.5 py-0.5 text-center text-[#c0b0c8] border border-[#4a4050]"
      />

      <div className="mx-2 h-4 w-px bg-[#4a4050]" />

      {/* 播放控制 */}
      <button onClick={onPlayToggle} className={`rounded p-1 ${isPlaying ? 'bg-[#7a90d0] text-white' : 'bg-[#4a4050] text-[#c0b0c8] hover:bg-[#5a5060]'}`}>
        {isPlaying ? <IoPause /> : <IoPlay />}
      </button>
      <button onClick={onStop} className="rounded p-1 bg-[#4a4050] text-[#c0b0c8] hover:bg-[#5a5060]"><IoStop /></button>

      {/* 录制 */}
      <button onClick={onRecordToggle} className={`rounded p-1 ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-[#4a4050] text-[#c0b0c8] hover:bg-[#5a5060]'}`}>
        <IoRadioButtonOn />
      </button>

      <div className="mx-2 h-4 w-px bg-[#4a4050]" />

      {/* 工具 */}
      <button onClick={() => dispatch({ type: 'SET_TOOL', tool: 'draw' })} className={`rounded p-1 ${tool === 'draw' ? 'bg-[#7a90d0] text-white' : 'bg-[#4a4050] text-[#c0b0c8]'}`}><IoPencil /></button>
      <button onClick={() => dispatch({ type: 'SET_TOOL', tool: 'erase' })} className={`rounded p-1 ${tool === 'erase' ? 'bg-[#d07a7a] text-white' : 'bg-[#4a4050] text-[#c0b0c8]'}`}><IoTrash /></button>

      <div className="flex-1" />

      {/* 导入导出 */}
      <button onClick={() => exportProject(project)} className="flex items-center gap-1 rounded bg-[#4a4050] px-2 py-0.5 text-[#c0b0c8] hover:bg-[#5a5060]"><IoDownload /> 导出</button>
      <button onClick={() => importProject((p: Project) => dispatch({ type: 'LOAD_PROJECT', project: p }))} className="flex items-center gap-1 rounded bg-[#4a4050] px-2 py-0.5 text-[#c0b0c8] hover:bg-[#5a5060]"><IoFolderOpen /> 导入</button>
    </div>
  )
}
