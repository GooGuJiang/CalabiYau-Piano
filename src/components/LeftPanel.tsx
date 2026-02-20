import { IoMusicalNotes } from 'react-icons/io5'

export function LeftPanel() {
  return (
    <div className="flex w-full flex-row items-center gap-2 sm:w-28 sm:flex-col sm:gap-3">
      <div className="flex items-center gap-2 rounded-xl bg-[#8a7e90]/40 p-2 sm:w-full sm:flex-col sm:items-center sm:gap-3 sm:p-3">
        <div className="flex gap-2 sm:gap-3">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[#4a4050] shadow-inner border-2 border-[#5a5060]" />
          <div className="h-6 w-2 sm:h-8 sm:w-3 rounded bg-[#4a4050] shadow-inner" />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[#4a4050] shadow-inner border-2 border-[#5a5060]" />
          <div className="h-6 w-2 sm:h-8 sm:w-3 rounded bg-[#4a4050] shadow-inner" />
        </div>
      </div>
      <div className="flex flex-row gap-1.5 rounded-xl bg-[#8a7e90]/40 p-2 sm:w-full sm:flex-col sm:gap-2 sm:p-3">
        <div className="h-5 w-10 sm:h-7 sm:w-auto rounded bg-[#9a7080]" />
        <div className="h-5 w-10 sm:h-7 sm:w-auto rounded bg-[#8a8070]" />
        <div className="h-5 w-10 sm:h-7 sm:w-auto rounded bg-[#7a8a70]" />
      </div>
      <div className="flex items-center justify-center rounded-xl bg-[#8a7e90]/40 p-2 sm:flex-1 sm:w-full sm:p-3">
        <IoMusicalNotes className="text-2xl sm:text-5xl text-[#7a7080]" />
      </div>
    </div>
  )
}
