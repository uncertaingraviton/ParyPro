import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { loadCms, loadPrefs, saveCms, savePrefs } from './lib/cms'
import type { CmsState, GuestPrefs } from './types'

type Store = {
  cms: CmsState
  prefs: GuestPrefs
  setCms: (next: CmsState) => void
  setPrefs: (next: GuestPrefs) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cms, setCmsState] = useState(loadCms)
  const [prefs, setPrefsState] = useState(loadPrefs)

  const value = useMemo<Store>(
    () => ({
      cms,
      prefs,
      setCms: (next) => {
        setCmsState(next)
        saveCms(next)
      },
      setPrefs: (next) => {
        setPrefsState(next)
        savePrefs(next)
      },
    }),
    [cms, prefs],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Store missing')
  return ctx
}
