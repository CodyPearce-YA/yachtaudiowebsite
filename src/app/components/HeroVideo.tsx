import { useState, useEffect } from 'react'

export function HeroVideo() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-full bg-[#0a0a0a]">
      <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-black/40 z-10" />

      {showIntro && (
        <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-20" style={{ animation: 'fadeOut 3s ease-out forwards' }}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-wider text-gold font-[var(--font-display)]">EXPECT THE IMPOSSIBLE</h1>
        </div>
      )}

      <style>{`@keyframes fadeOut { 0% { opacity:1 } 60% { opacity:1 } 100% { opacity:0 } }`}</style>
    </div>
  )
}
