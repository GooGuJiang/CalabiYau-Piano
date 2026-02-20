import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react'
import type { Note, Project, Tool } from '../types'

interface AppState {
  project: Project
  isPlaying: boolean
  isRecording: boolean
  currentBeat: number
  tool: Tool
  pianoRollOpen: boolean
}

const defaultProject: Project = {
  name: '未命名',
  bpm: 120,
  beatsPerBar: 4,
  totalBars: 8,
  notes: [],
}

const initialState: AppState = {
  project: defaultProject,
  isPlaying: false,
  isRecording: false,
  currentBeat: 0,
  tool: 'draw',
  pianoRollOpen: false,
}

type Action =
  | { type: 'SET_BPM'; bpm: number }
  | { type: 'SET_TOTAL_BARS'; totalBars: number }
  | { type: 'ADD_NOTE'; note: Note }
  | { type: 'REMOVE_NOTE'; id: string }
  | { type: 'SET_NOTES'; notes: Note[] }
  | { type: 'LOAD_PROJECT'; project: Project }
  | { type: 'SET_PLAYING'; value: boolean }
  | { type: 'SET_RECORDING'; value: boolean }
  | { type: 'SET_CURRENT_BEAT'; beat: number }
  | { type: 'SET_TOOL'; tool: Tool }
  | { type: 'TOGGLE_PIANO_ROLL' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_BPM':
      return { ...state, project: { ...state.project, bpm: action.bpm } }
    case 'SET_TOTAL_BARS':
      return { ...state, project: { ...state.project, totalBars: action.totalBars } }
    case 'ADD_NOTE':
      return { ...state, project: { ...state.project, notes: [...state.project.notes, action.note] } }
    case 'REMOVE_NOTE':
      return { ...state, project: { ...state.project, notes: state.project.notes.filter(n => n.id !== action.id) } }
    case 'SET_NOTES':
      return { ...state, project: { ...state.project, notes: action.notes } }
    case 'LOAD_PROJECT':
      return { ...state, project: action.project }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.value }
    case 'SET_RECORDING':
      return { ...state, isRecording: action.value }
    case 'SET_CURRENT_BEAT':
      return { ...state, currentBeat: action.beat }
    case 'SET_TOOL':
      return { ...state, tool: action.tool }
    case 'TOGGLE_PIANO_ROLL':
      return { ...state, pianoRollOpen: !state.pianoRollOpen }
    default:
      return state
  }
}

const Ctx = createContext<AppState>(initialState)
const DispatchCtx = createContext<Dispatch<Action>>(() => {})

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Ctx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        {children}
      </DispatchCtx.Provider>
    </Ctx.Provider>
  )
}

export function useProject() { return useContext(Ctx) }
export function useDispatch() { return useContext(DispatchCtx) }
