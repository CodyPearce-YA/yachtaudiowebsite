import { useState } from 'react';

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
  scrollProgress: { [key: string]: number };
  onNavigate: (id: string) => void;
  visible: boolean;
}

export function SectionSidebar({ sections, scrollProgress, onNavigate, visible }: Props) {
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="fixed right-8 top-1/2 z-40 pointer-events-none"
      style={{
        transform: `translateY(-50%) translateX(${visible ? '0' : '3rem'})`,
        opacity: sidebarHovered ? 1 : 0.25,
        transition: 'opacity 0.5s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="pointer-events-auto flex flex-col gap-5 items-end"
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => { setSidebarHovered(false); setHoveredId(null); }}
      >
        {sections.map((section) => {
          const progress = scrollProgress[section.id] ?? 0;
          const isActive = progress > 0.5;
          const isHovered = hoveredId === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              onMouseEnter={() => setHoveredId(section.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex items-center gap-3 group"
            >
              {/* Label */}
              <span
                className="text-right uppercase tracking-widest leading-none"
                style={{
                  color: isActive ? '#A2834E' : '#9ca3af',
                  fontSize: isActive ? '0.85rem' : isHovered ? '0.85rem' : '0.72rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.18em',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {section.label}
              </span>

              {/* Dot */}
              <div
                style={{
                  width: isActive ? '8px' : isHovered ? '6px' : '4px',
                  height: isActive ? '8px' : isHovered ? '6px' : '4px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#A2834E' : '#d1d5db',
                  boxShadow: isActive ? '0 0 8px rgba(162,131,78,0.55)' : 'none',
                  flexShrink: 0,
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
