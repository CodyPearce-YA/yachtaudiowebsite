import { useState } from 'react'

interface Props {
  items: { id: string; label: string }[]
  progress: Record<string, number>
  onNavigate: (id: string) => void
}

export function SectionSidebar({ items, progress, onNavigate }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="fixed right-8 top-1/2 z-40 pointer-events-none" style={{ transform: 'translateY(-50%)' }}>
      <div className="pointer-events-auto flex flex-col gap-5 items-end opacity-30 hover:opacity-100 transition-opacity duration-500" onMouseLeave={() => setHovered(null)}>
        {items.map(item => {
          const p = progress[item.id] ?? 0
          const active = p > 0.5
          const isHovered = hovered === item.id
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} onMouseEnter={() => setHovered(item.id)} className="flex items-center gap-3 group">
              <span className="text-right uppercase tracking-widest leading-none transition-all duration-350" style={{ color: active ? '#A2834E' : '#9ca3af', fontSize: active ? '0.85rem' : isHovered ? '0.85rem' : '0.72rem', fontWeight: active ? 600 : 400, letterSpacing: '0.18em' }}>
                {item.label}
              </span>
              <div style={{ width: active ? 10 : isHovered ? 7 : 4, height: active ? 10 : isHovered ? 7 : 4, borderRadius: '50%', backgroundColor: active ? '#A2834E' : '#d1d5db', boxShadow: active ? '0 0 12px rgba(162,131,78,0.6)' : 'none', flexShrink: 0, transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
