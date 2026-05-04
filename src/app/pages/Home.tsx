import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { Menu, X } from 'lucide-react'
import { useLang } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import { LanguageSelector } from '../components/LanguageSelector'
import { HeroVideo } from '../components/HeroVideo'
import { SectionSidebar } from '../components/SectionSidebar'

const SECTIONS = ['home', 'about', 'different', 'services', 'projects', 'references', 'contact'] as const
type Section = typeof SECTIONS[number]

export default function Home() {
  const { lang } = useLang()
  const t = translations[lang]
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const animating = useRef(false)
  const progressRef = useRef<Record<string, number>>({})
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const getActiveSection = useCallback((): Section => {
    let active: Section = 'home'
    let max = 0
    for (const [id, p] of Object.entries(progressRef.current)) {
      if (p > max && p > 0.5) { max = p; active = id as Section }
    }
    return active
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onScroll = () => {
      setScrolled(el.scrollTop > 50)
      const h = el.clientHeight
      const updated: Record<string, number> = { ...progressRef.current }
      for (const [id, node] of Object.entries(sectionRefs.current)) {
        if (!node) continue
        const { top, bottom } = node.getBoundingClientRect()
        if (top <= 0 && bottom >= h) updated[id] = 1
        else if (top > 0 && top < h) updated[id] = Math.max(0, Math.min(1, (1 - top / h) * 2))
        else if (bottom > 0 && bottom < h) updated[id] = Math.max(0, Math.min(1, (bottom / h) * 2))
        else updated[id] = 0
      }
      progressRef.current = updated
      setProgress({ ...updated })
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (animating.current) return
      const current = getActiveSection()
      const idx = SECTIONS.indexOf(current as Section)
      const dir = e.deltaY > 0 ? 1 : -1
      const next = Math.max(0, Math.min(SECTIONS.length - 1, idx + dir))
      if (next === idx) return
      animating.current = true
      const target = SECTIONS[next]
      if (target === 'home') el.scrollTo({ top: 0, behavior: 'smooth' })
      else sectionRefs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => { animating.current = false }, 900)
    }

    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => { el.removeEventListener('scroll', onScroll); el.removeEventListener('wheel', onWheel) }
  }, [getActiveSection])

  const sectionStyle = (id: string) => {
    const p = Math.max(0, Math.min(1, progress[id] || 0))
    if (!scrolled) return { opacity: 0, transform: 'translateY(32px)', filter: 'blur(5px)', transition: 'none', pointerEvents: 'none' as const }
    return { opacity: p, transform: `translateY(${(1 - p) * 32}px)`, filter: `blur(${(1 - p) * 5}px)`, transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease', pointerEvents: p < 0.1 ? 'none' as const : 'auto' as const }
  }

  const scrollTo = (id: string) => {
    if (id === 'home') containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    else sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const active = getActiveSection()

  const sidebarItems = [
    { id: 'about', label: t.nav.whoWeAre },
    { id: 'different', label: t.different.title },
    { id: 'services', label: t.services.title },
    { id: 'projects', label: t.nav.projects },
    { id: 'references', label: t.nav.references },
    { id: 'contact', label: t.nav.contact },
  ]

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.whoWeAre },
    { id: 'projects', label: t.nav.projects },
    { id: 'references', label: t.nav.references },
    { id: 'contact', label: t.nav.contact },
  ]

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll" style={{ overscrollBehavior: 'none' }}>
      <SectionSidebar items={sidebarItems} progress={progress} onNavigate={scrollTo} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gold/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="w-24" />
          <a href="/" className="absolute left-1/2 -translate-x-1/2 text-xl sm:text-2xl tracking-[0.3em] text-gold font-light font-[var(--font-display)]">YACHT AUDIO</a>
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Menu">
              {menuOpen ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6 text-gold" />}
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="absolute top-16 right-0 w-72 bg-white border border-gold/20 shadow-xl rounded-bl-lg">
            <ul className="px-4 py-4">
              {navItems.map(s => (
                <li key={s.id}>
                  <button onClick={() => { scrollTo(s.id); setMenuOpen(false) }} className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${active === s.id ? 'bg-gold/10 text-gold font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>{s.label}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Hero */}
      <section ref={el => { sectionRefs.current['home'] = el }} className="h-screen">
        <HeroVideo />
      </section>

      {/* Who We Are */}
      <section id="about" ref={el => { sectionRefs.current['about'] = el }} className="bg-gray-50 overflow-hidden h-screen" style={sectionStyle('about')}>
        <div className="h-full flex flex-col pt-20">
          <div className="border-b border-gold/20 py-5 px-8">
            <h2 className="text-3xl md:text-4xl text-gold text-center">{t.whoWeAre.title}</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center py-6 px-8 overflow-hidden">
            <div className="max-w-6xl mx-auto w-full">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {['https://images.unsplash.com/photo-1697124510322-27ef594f67fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', 'https://images.unsplash.com/photo-1743685889437-210ad44b6c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', 'https://images.unsplash.com/photo-1692246427974-c28629e3617e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'].map((src, i) => (
                  <div key={i} className="rounded-lg overflow-hidden shadow-md h-36">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-center space-y-3 text-gray-800 leading-relaxed">
                <p>{t.whoWeAre.p1}</p><p>{t.whoWeAre.p2}</p><p>{t.whoWeAre.p3}</p><p>{t.whoWeAre.p4}</p><p>{t.whoWeAre.p5}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section id="different" ref={el => { sectionRefs.current['different'] = el }} className="bg-gray-50 overflow-hidden h-screen" style={sectionStyle('different')}>
        <div className="h-full flex flex-col pt-20">
          <div className="border-b border-gold/20 py-5 px-8">
            <h2 className="text-3xl md:text-4xl text-gold text-center">{t.different.title}</h2>
          </div>
          <div className="flex-1 flex items-center py-6 px-8">
            <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-6">
              {[
                { title: t.different.c1Title, text: t.different.c1 },
                { title: t.different.c2Title, text: t.different.c2 },
                { title: t.different.c3Title, text: t.different.c3 },
                { title: t.different.c4Title, text: t.different.c4 },
              ].map(card => (
                <div key={card.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-gold text-lg font-semibold mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Services */}
      <section id="services" ref={el => { sectionRefs.current['services'] = el }} className="bg-white overflow-hidden h-screen" style={sectionStyle('services')}>
        <div className="h-full flex flex-col pt-20">
          <div className="border-b border-gold/20 py-5 px-8">
            <h2 className="text-3xl md:text-4xl text-gold text-center">{t.services.title}</h2>
          </div>
          <div className="flex-1 flex items-center py-6 px-8">
            <div className="max-w-5xl mx-auto w-full grid md:grid-cols-3 gap-6">
              {[
                { title: t.services.video, text: t.services.videoText },
                { title: t.services.audio, text: t.services.audioText },
                { title: t.services.control, text: t.services.controlText },
                { title: t.services.security, text: t.services.securityText },
                { title: t.services.it, text: t.services.itText },
                { title: t.services.support, text: t.services.supportText },
              ].map(s => (
                <div key={s.title} className="text-center p-6">
                  <h3 className="text-gold text-lg font-semibold mb-3">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <ProjectsSection progress={progress} sectionStyle={sectionStyle} sectionRefs={sectionRefs} t={t} />

      {/* References */}
      <section id="references" ref={el => { sectionRefs.current['references'] = el }} className="bg-white overflow-hidden h-screen" style={sectionStyle('references')}>
        <div className="h-full flex flex-col pt-20">
          <div className="border-b border-gold/20 py-5 px-8">
            <h2 className="text-3xl md:text-4xl text-gold text-center">{t.references.title}</h2>
            <p className="text-center text-gray-500 text-sm mt-1">{t.references.subtitle}</p>
          </div>
          <div className="flex-1 flex items-center py-6 px-8">
            <div className="max-w-3xl mx-auto w-full grid md:grid-cols-2 gap-6">
              {[
                { quote: t.references.t1, name: t.references.t1Name, role: t.references.t1Role },
                { quote: t.references.t2, name: t.references.t2Name, role: '' },
                { quote: t.references.t3, name: t.references.t3Name, role: '' },
                { quote: t.references.t4, name: t.references.t4Name, role: '' },
              ].map(r => (
                <div key={r.name} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <p className="text-gray-700 italic text-sm leading-relaxed mb-4">"{r.quote}"</p>
                  <p className="font-semibold text-gold text-sm">{r.name}</p>
                  {r.role && <p className="text-xs text-gray-400 mt-0.5">{r.role}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="contact" ref={el => { sectionRefs.current['contact'] = el }} className="bg-gray-100 h-screen">
        <div className="h-full flex flex-col justify-center pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div>
                <h4 className="text-lg mb-4 font-semibold tracking-wide">YACHT AUDIO LTD</h4>
                <p className="text-gray-600 leading-relaxed text-sm">Oberlandstr. 13-14<br />12099 Berlin<br />Germany</p>
              </div>
              <div>
                <h5 className="mb-4 font-semibold text-sm tracking-widest uppercase">{t.footer.contact}</h5>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>{t.footer.office}: +49 30 547074-75</li>
                  <li>{t.footer.fax}: +49 30 547074-76</li>
                  <li><a href="mailto:keepusbusy@yachtaudio.com" className="hover:text-gold transition-colors">keepusbusy@yachtaudio.com</a></li>
                  <li><a href="http://www.yachtaudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">www.yachtaudio.com</a></li>
                </ul>
              </div>
              <div>
                <h5 className="mb-4 font-semibold text-sm tracking-widest uppercase">{t.footer.resources}</h5>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><a href="#brochure" className="hover:text-gold transition-colors">{t.footer.brochure}</a></li>
                  <li><Link to="/legal-notice" className="hover:text-gold transition-colors">{t.footer.legal}</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-6 text-center text-gray-500 text-sm">
              <p>© 2026 YACHT AUDIO LTD. {t.footer.rights}.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ── Projects section with animated counters ── */

function ProjectsSection({ progress, sectionStyle, sectionRefs, t }: {
  progress: Record<string, number>
  sectionStyle: (id: string) => React.CSSProperties
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
  t: typeof translations['EN']
}) {
  const [counts, setCounts] = useState({ yachts: 0, residences: 0 })
  const animated = useRef(false)

  useEffect(() => {
    if (progress['projects'] > 0.5 && !animated.current) {
      animated.current = true
      const dur = 1400
      const start = performance.now()
      const tick = (now: number) => {
        const e = Math.min((now - start) / dur, 1)
        const ease = 1 - Math.pow(1 - e, 3)
        setCounts({ yachts: Math.round(ease * 80), residences: Math.round(ease * 20) })
        if (e < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  }, [progress])

  return (
    <section id="projects" ref={el => { sectionRefs.current['projects'] = el }} className="bg-gray-50 overflow-hidden h-screen" style={sectionStyle('projects')}>
      <div className="h-full flex flex-col pt-20">
        <div className="border-b border-gold/20 py-5 px-8">
          <h2 className="text-3xl md:text-4xl text-gold text-center">{t.projects.title}</h2>
          <p className="text-center text-gray-500 text-sm mt-1">{t.projects.subtitle}</p>
        </div>
        <div className="flex-1 flex flex-col justify-center py-6 px-8">
          <div className="max-w-4xl mx-auto w-full text-center">
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-5xl md:text-6xl text-gold font-light">{counts.yachts}+</p>
                <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">{t.projects.yachts}</p>
              </div>
              <div>
                <p className="text-5xl md:text-6xl text-gold font-light">{counts.residences}+</p>
                <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">{t.projects.residences}</p>
              </div>
            </div>
            <Link to="/projects" className="inline-block border border-gold text-gold px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition-all duration-300">
              {t.nav.projects}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
