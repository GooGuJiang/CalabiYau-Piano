import { getJianpu, PIANO_ROW_IDS } from '../utils/jianpu'

export function PianoKeys({ onPlay, rowH }: { onPlay: (id: number) => void; rowH: number }) {
  return (
    <div className="flex flex-col border-r border-[#3f3f46]" style={{ width: 64 }}>
      {PIANO_ROW_IDS.map(id => (
        <div
          key={id}
          className="flex items-center justify-between border-b border-[#333336] px-1.5 text-xs cursor-pointer hover:bg-[#3e3e40] select-none"
          style={{ height: rowH }}
          onMouseDown={() => onPlay(id)}
        >
          <span className="text-[#a090b0]">{getJianpu(id)}</span>
          <span className="text-[10px] text-[#666]">{id}</span>
        </div>
      ))}
    </div>
  )
}
