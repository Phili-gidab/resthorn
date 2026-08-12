import { useMemo } from 'react'

interface NetInfo { saveData?: boolean; effectiveType?: string }

/** Motion / data-saving preferences, sampled once per mount. */
export function usePrefs() {
  return useMemo(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const conn = (navigator as Navigator & { connection?: NetInfo }).connection
    const saveData = !!conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g'
    return { reduced, saveData, lowPower: reduced || saveData }
  }, [])
}

let webglOk: boolean | null = null
export function hasWebGL(): boolean {
  if (webglOk !== null) return webglOk
  try {
    const c = document.createElement('canvas')
    webglOk = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webglOk = false
  }
  return webglOk
}
