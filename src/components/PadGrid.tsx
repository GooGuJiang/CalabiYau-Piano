import { Pad } from './Pad'

const PAD_IDS = [13, 14, 15, 16, 9, 10, 11, 12, 5, 6, 7, 8, 1, 2, 3, 4]

export function PadGrid({ onPlay, loaded }: { onPlay: (id: number) => void; loaded: boolean }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {PAD_IDS.map(id => (
        <Pad key={id} id={id} onPlay={onPlay} loaded={loaded} />
      ))}
    </div>
  )
}
