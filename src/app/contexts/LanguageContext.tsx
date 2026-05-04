import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Lang } from '../translations/translations'

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void } | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('EN')
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
