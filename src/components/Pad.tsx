export function Pad({ id, onPlay, loaded }: { id: number; onPlay: (id: number) => void; loaded: boolean }) {
  return (
    <button
      onMouseDown={() => onPlay(id)}
      disabled={!loaded}
      className="group relative aspect-square w-full sm:w-24 cursor-pointer select-none rounded-lg bg-[#6a5560] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3),4px_4px_8px_rgba(0,0,0,0.4)] transition-all duration-75 active:scale-95 active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] active:bg-[#7a6570] hover:bg-[#7a6068] disabled:opacity-50"
    >
      <span className="absolute bottom-1.5 left-2 text-xs font-medium text-[#8a7580] select-none">
        PAD {id}
      </span>
    </button>
  )
}
