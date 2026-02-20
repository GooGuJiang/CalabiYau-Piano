import { IoMusicalNotes } from 'react-icons/io5'

export function LeftPanel() {
  return (
    <div className="flex w-full flex-row gap-3 sm:w-28 sm:flex-col">
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
  )
}
