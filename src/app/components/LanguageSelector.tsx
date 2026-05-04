import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'
import type { Lang } from '../translations/translations'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'EN', label: 'EN' },
  { code: 'DE', label: 'DE' },
  { code: 'FR', label: 'FR' },
  { code: 'IT', label: 'IT' },
]

export function LanguageSelector() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 text-sm text-gold hover:bg-gold/10 rounded transition-colors tracking-wider"
      >
        {lang}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gold/20 shadow-lg rounded-lg overflow-hidden z-50">
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false) }}
                className={`block w-full px-4 py-2 text-sm text-left transition-colors ${lang === l.code ? 'bg-gold/10 text-gold font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
