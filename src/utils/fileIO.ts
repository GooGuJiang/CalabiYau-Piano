import type { Project } from '../types'

export function exportProject(project: Project) {
  const json = JSON.stringify(project, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${project.name || 'project'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importProject(onLoad: (p: Project) => void) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const p = JSON.parse(reader.result as string) as Project
        onLoad(p)
      } catch { /* ignore invalid */ }
    }
    reader.readAsText(file)
  }
  input.click()
}
