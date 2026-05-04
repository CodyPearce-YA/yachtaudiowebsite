import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring, useMotionValue } from 'motion/react'
import { useLang } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import { LanguageSelector } from '../components/LanguageSelector'
import { HeroVideo } from '../components/HeroVideo'
import { SectionSidebar } from '../components/SectionSidebar'

const SECTIONS = ['home', 'about', 'different', 'services', 'projects', 'references', 'contact'] as const
type Section = (typeof SECTIONS)[number]

/* ─── Animated counter ─── */
function AnimatedCounter({ target, label, suffix = '+' }: { target: number; label: string; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useSpring(count, { stiffness: 40, damping: 20 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      count.set(Math.round(eased * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target, count])

  useEffect(() => {
    const unsub = rounded.on('change', v => setDisplay(Math.round(v)))
    return unsub
  }, [rounded])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <p className="text-6xl md:text-8xl font-light text-gold font-[var(--font-display)]">{display}{suffix}</p>
      <p className="text-gray-500 text-sm mt-3 tracking-[0.2em] uppercase">{label}</p>
    </motion.div>
  )
}

/* ─── Floating particles background ─── */
function ParticlesBackground() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/10"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN HOME COMPONENT
   ═══════════════════════════════════════════ */

export default function Home() {
  const { lang } = useLang()
  const t = translations[lang]
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animating = useRef(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [progress, setProgress] = useState<Record<string, number>>({})
  const progressRef = useRef<Record<string, number>>({})

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
        const rect = node.getBoundingClientRect()
        const top = rect.top
        const bottom = rect.bottom
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
      const idx = SECTIONS.indexOf(current)
      const dir = e.deltaY > 0 ? 1 : -1
      const next = Math.max(0, Math.min(SECTIONS.length - 1, idx + dir))
      if (next === idx) return
      animating.current = true
      const target = SECTIONS[next]
      if (target === 'home') el.scrollTo({ top: 0, behavior: 'smooth' })
      else sectionRefs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => { animating.current = false }, 1000)
    }

    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => { el.removeEventListener('scroll', onScroll); el.removeEventListener('wheel', onWheel) }
  }, [getActiveSection])

  const scrollTo = (id: string) => {
    if (id === 'home') containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    else sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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

      {/* ═══ Header ═══ */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gold/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
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
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-16 right-0 w-80 bg-white/95 backdrop-blur-xl border border-gold/20 shadow-2xl rounded-bl-2xl origin-top"
            >
              <ul className="px-4 py-6">
                {navItems.map((s, i) => (
                  <motion.li key={s.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button onClick={() => { scrollTo(s.id); setMenuOpen(false) }} className="w-full text-left px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-gold/5 hover:text-gold hover:translate-x-1">{s.label}</button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ═══ Hero ═══ */}
      <section ref={el => { sectionRefs.current['home'] = el }} className="h-screen relative">
        <HeroVideo />
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-white/60 cursor-pointer"
            onClick={() => scrollTo('about')}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ Who We Are ═══ */}
      <section ref={el => { sectionRefs.current['about'] = el }} className="h-screen bg-gray-50 relative overflow-hidden">
        <ParticlesBackground />
        <div className="h-full flex flex-col relative z-10">
          <div className="pt-24 pb-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.whoWeAre.title}
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-32 mx-auto mt-6"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center px-8 pb-12 overflow-hidden">
            <div className="max-w-6xl mx-auto w-full">
              {/* Image grid */}
              <motion.div
                className="grid grid-cols-3 gap-4 mb-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              >
                {[
                  { src: 'https://images.unsplash.com/photo-1697124510322-27ef594f67fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', alt: 'Luxury yacht' },
                  { src: 'https://images.unsplash.com/photo-1743685889437-210ad44b6c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', alt: 'Premium cinema' },
                  { src: 'https://images.unsplash.com/photo-1692246427974-c28629e3617e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', alt: 'AV system' },
                ].map((img, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 40, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
                    className="rounded-xl overflow-hidden shadow-xl h-40 md:h-56 group"
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Text */}
              <motion.div
                className="max-w-3xl mx-auto text-center space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
              >
                {[t.whoWeAre.p1, t.whoWeAre.p2, t.whoWeAre.p3, t.whoWeAre.p4, t.whoWeAre.p5].map((text, i) => (
                  <motion.p
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
                    className="text-gray-700 leading-relaxed text-base md:text-lg"
                  >
                    {text}
                  </motion.p>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ What Makes Us Different ═══ */}
      <section ref={el => { sectionRefs.current['different'] = el }} className="h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="h-full flex flex-col">
          <div className="pt-24 pb-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.different.title}
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-32 mx-auto mt-6"
            />
          </div>

          <div className="flex-1 flex items-center px-8 pb-12">
            <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-6">
              {[
                { title: t.different.c1Title, text: t.different.c1, icon: '◈', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                { title: t.different.c2Title, text: t.different.c2, icon: '◆', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                { title: t.different.c3Title, text: t.different.c3, icon: '◇', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                { title: t.different.c4Title, text: t.different.c4, icon: '◊', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gold/10 transition-shadow duration-500"
                >
                  <div className="h-32 overflow-hidden">
                    <img src={card.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="p-6">
                    <span className="text-gold text-xl mb-3 block">{card.icon}</span>
                    <h3 className="text-gold text-lg font-semibold mb-3">{card.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{card.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Skills & Services ═══ */}
      <section ref={el => { sectionRefs.current['services'] = el }} className="h-screen bg-gray-50 relative overflow-hidden">
        <ParticlesBackground />
        <div className="h-full flex flex-col relative z-10">
          <div className="pt-24 pb-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.services.title}
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-32 mx-auto mt-6"
            />
          </div>

          <div className="flex-1 flex items-center px-8 pb-12">
            <div className="max-w-5xl mx-auto w-full grid md:grid-cols-3 gap-6">
              {[
                { title: t.services.video, text: t.services.videoText, num: '01', img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                { title: t.services.audio, text: t.services.audioText, num: '02', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                { title: t.services.control, text: t.services.controlText, num: '03', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                { title: t.services.security, text: t.services.securityText, num: '04', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                { title: t.services.it, text: t.services.itText, num: '05', img: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                { title: t.services.support, text: t.services.supportText, num: '06', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gold/10 transition-all duration-500 border border-gray-100"
                >
                  <div className="h-28 overflow-hidden">
                    <img src={s.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="p-6 text-center">
                    <span className="text-gold/20 text-3xl font-light font-[var(--font-display)] block mb-2">{s.num}</span>
                    <h3 className="text-gold text-base font-semibold mb-2">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Projects ═══ */}
      <section ref={el => { sectionRefs.current['projects'] = el }} className="h-screen bg-white relative overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="pt-24 pb-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.projects.title}
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-32 mx-auto mt-6"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 mt-4 max-w-xl mx-auto"
            >
              {t.projects.subtitle}
            </motion.p>
          </div>

          <div className="flex-1 flex flex-col justify-center px-8 pb-12">
            <div className="max-w-4xl mx-auto w-full">
              {/* Counters */}
              <motion.div
                className="grid grid-cols-2 gap-12 mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
              >
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
                  <AnimatedCounter target={80} label={t.projects.yachts} />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
                  <AnimatedCounter target={20} label={t.projects.residences} />
                </motion.div>
              </motion.div>

              {/* Project preview images */}
              <motion.div
                className="grid grid-cols-3 gap-4 mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }}
              >
                {[
                  'https://images.unsplash.com/photo-1697124510322-27ef594f67fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
                  'https://images.unsplash.com/photo-1758448755952-42b404bc6f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
                  'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
                    className="rounded-xl overflow-hidden shadow-lg h-32 md:h-40 group"
                  >
                    <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center"
              >
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-3 border-2 border-gold text-gold px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition-all duration-500 group rounded-full"
                >
                  {t.nav.projects}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ References ═══ */}
      <section ref={el => { sectionRefs.current['references'] = el }} className="h-screen bg-gray-50 relative overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="pt-24 pb-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.references.title}
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-32 mx-auto mt-6"
            />
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="text-gray-500 mt-4">{t.references.subtitle}</motion.p>
          </div>

          <div className="flex-1 flex items-center px-8 pb-12">
            <div className="max-w-4xl mx-auto w-full grid md:grid-cols-2 gap-6">
              {[
                { quote: t.references.t1, name: t.references.t1Name, role: t.references.t1Role, img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
                { quote: t.references.t2, name: t.references.t2Name, role: '', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
                { quote: t.references.t3, name: t.references.t3Name, role: '', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
                { quote: t.references.t4, name: t.references.t4Name, role: '', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
              ].map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gold/5 transition-all duration-500"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/20" />
                    <div>
                      <p className="font-semibold text-gold text-sm">{r.name}</p>
                      {r.role && <p className="text-xs text-gray-400">{r.role}</p>}
                    </div>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">"{r.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Contact / Footer ═══ */}
      <footer id="contact" ref={el => { sectionRefs.current['contact'] = el }} className="h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#0a0a0a]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="h-full flex flex-col justify-center relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-3 gap-12 mb-16"
            >
              <div>
                <h4 className="text-xl mb-6 font-semibold tracking-wider font-[var(--font-display)] text-gold">YACHT AUDIO LTD</h4>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Oberlandstr. 13-14<br />12099 Berlin<br />Germany
                </p>
              </div>
              <div>
                <h5 className="mb-6 font-semibold text-sm tracking-[0.2em] uppercase text-gold">{t.footer.contact}</h5>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li className="hover:text-gold transition-colors">{t.footer.office}: +49 30 547074-75</li>
                  <li className="hover:text-gold transition-colors">{t.footer.fax}: +49 30 547074-76</li>
                  <li><a href="mailto:keepusbusy@yachtaudio.com" className="hover:text-gold transition-colors">keepusbusy@yachtaudio.com</a></li>
                  <li><a href="http://www.yachtaudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">www.yachtaudio.com</a></li>
                </ul>
              </div>
              <div>
                <h5 className="mb-6 font-semibold text-sm tracking-[0.2em] uppercase text-gold">{t.footer.resources}</h5>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li><a href="#brochure" className="hover:text-gold transition-colors">{t.footer.brochure}</a></li>
                  <li><Link to="/legal-notice" className="hover:text-gold transition-colors">{t.footer.legal}</Link></li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="border-t border-gray-800 pt-8 text-center"
            >
              <p className="text-gray-500 text-sm">© 2026 YACHT AUDIO LTD. {t.footer.rights}.</p>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}
