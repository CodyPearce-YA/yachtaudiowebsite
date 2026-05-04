import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { Menu, X, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react'
import { useLang } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import { LanguageSelector } from '../components/LanguageSelector'
import { HeroVideo } from '../components/HeroVideo'
import { SectionSidebar } from '../components/SectionSidebar'

const SECTIONS = ['home', 'about', 'different', 'services', 'projects', 'references', 'contact'] as const
type Section = (typeof SECTIONS)[number]

/* ─── Reusable animated section wrapper ─── */
function AnimatedSection({ children, className = '', id, style }: {
  children: React.ReactNode
  className?: string
  id?: string
  style?: CSSProperties
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  )
}

/* ─── Stagger children animation ─── */
function StaggerChildren({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Parallax image ─── */
function ParallaxImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="w-full h-full object-cover scale-110" />
    </div>
  )
}

/* ─── Animated counter ─── */
function AnimatedCounter({ target, label, suffix = '+' }: { target: number; label: string; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      setCount(Math.round(eased * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <p className="text-5xl md:text-7xl font-light text-gold font-[var(--font-display)]">{count}{suffix}</p>
      <p className="text-gray-500 text-sm mt-3 tracking-[0.2em] uppercase">{label}</p>
    </motion.div>
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

  const getActiveSection = useCallback((): Section => {
    let active: Section = 'home'
    let max = 0
    for (const [id, p] of Object.entries(progressRef.current)) {
      if (p > max && p > 0.5) { max = p; active = id as Section }
    }
    return active
  }, [])

  const progressRef = useRef<Record<string, number>>({})

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
      setTimeout(() => { animating.current = false }, 900)
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
      <SectionSidebar items={sidebarItems} progress={progressRef.current} onNavigate={scrollTo} />

      {/* ═══ Header ═══ */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gold/20"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-0 w-72 bg-white border border-gold/20 shadow-xl rounded-bl-lg"
            >
              <ul className="px-4 py-4">
                {navItems.map(s => (
                  <li key={s.id}>
                    <button onClick={() => { scrollTo(s.id); setMenuOpen(false) }} className="w-full text-left px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100">{s.label}</button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ═══ Hero ═══ */}
      <section ref={el => { sectionRefs.current['home'] = el }} className="h-screen">
        <HeroVideo />
      </section>

      {/* ═══ Who We Are ═══ */}
      <AnimatedSection id="about" ref={el => { sectionRefs.current['about'] = el }} className="bg-gray-50 min-h-screen py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.whoWeAre.title}
            </motion.h2>
            <div className="gold-line w-24 mx-auto mt-6" />
          </motion.div>

          {/* Image grid with parallax */}
          <StaggerChildren className="grid grid-cols-3 gap-4 mb-12">
            {[
              { src: 'https://images.unsplash.com/photo-1697124510322-27ef594f67fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', alt: 'Luxury yacht interior' },
              { src: 'https://images.unsplash.com/photo-1743685889437-210ad44b6c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', alt: 'Premium cinema' },
              { src: 'https://images.unsplash.com/photo-1692246427974-c28629e3617e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', alt: 'Audio visual system' },
            ].map((img, i) => (
              <StaggerItem key={i} className="img-zoom rounded-xl shadow-lg h-48 md:h-64">
                <ParallaxImage src={img.src} alt={img.alt} className="w-full h-full rounded-xl" />
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Text content with staggered reveal */}
          <StaggerChildren className="max-w-3xl mx-auto text-center space-y-5">
            {[t.whoWeAre.p1, t.whoWeAre.p2, t.whoWeAre.p3, t.whoWeAre.p4, t.whoWeAre.p5].map((text, i) => (
              <StaggerItem key={i}>
                <p className="text-gray-700 leading-relaxed text-lg">{text}</p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </AnimatedSection>

      {/* ═══ What Makes Us Different ═══ */}
      <AnimatedSection id="different" ref={el => { sectionRefs.current['different'] = el }} className="bg-white min-h-screen py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.different.title}
            </motion.h2>
            <div className="gold-line w-24 mx-auto mt-6" />
          </motion.div>

          <StaggerChildren className="grid md:grid-cols-2 gap-6">
            {[
              { title: t.different.c1Title, text: t.different.c1, icon: '◈' },
              { title: t.different.c2Title, text: t.different.c2, icon: '◆' },
              { title: t.different.c3Title, text: t.different.c3, icon: '◇' },
              { title: t.different.c4Title, text: t.different.c4, icon: '◊' },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="card-lift bg-gray-50 p-8 rounded-xl border border-gray-100 h-full"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-gold text-2xl mb-4 block">{card.icon}</span>
                  <h3 className="text-gold text-xl font-semibold mb-4">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.text}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </AnimatedSection>

      {/* ═══ Skills & Services ═══ */}
      <AnimatedSection id="services" ref={el => { sectionRefs.current['services'] = el }} className="bg-gray-50 min-h-screen py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.services.title}
            </motion.h2>
            <div className="gold-line w-24 mx-auto mt-6" />
          </motion.div>

          <StaggerChildren className="grid md:grid-cols-3 gap-8">
            {[
              { title: t.services.video, text: t.services.videoText, num: '01' },
              { title: t.services.audio, text: t.services.audioText, num: '02' },
              { title: t.services.control, text: t.services.controlText, num: '03' },
              { title: t.services.security, text: t.services.securityText, num: '04' },
              { title: t.services.it, text: t.services.itText, num: '05' },
              { title: t.services.support, text: t.services.supportText, num: '06' },
            ].map((s, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="card-lift text-center p-8 bg-white rounded-xl border border-gray-100 h-full"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-gold/30 text-4xl font-light font-[var(--font-display)] block mb-4">{s.num}</span>
                  <h3 className="text-gold text-lg font-semibold mb-3">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.text}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </AnimatedSection>

      {/* ═══ Projects ═══ */}
      <AnimatedSection id="projects" ref={el => { sectionRefs.current['projects'] = el }} className="bg-white min-h-screen py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.projects.title}
            </motion.h2>
            <div className="gold-line w-24 mx-auto mt-6" />
            <p className="text-gray-500 mt-6 max-w-xl mx-auto">{t.projects.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <AnimatedCounter target={80} label={t.projects.yachts} />
            <AnimatedCounter target={20} label={t.projects.residences} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-3 border border-gold text-gold px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition-all duration-500 group"
            >
              {t.nav.projects}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══ References ═══ */}
      <AnimatedSection id="references" ref={el => { sectionRefs.current['references'] = el }} className="bg-gray-50 min-h-screen py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl text-gold font-[var(--font-display)] tracking-wider"
            >
              {t.references.title}
            </motion.h2>
            <div className="gold-line w-24 mx-auto mt-6" />
            <p className="text-gray-500 mt-4">{t.references.subtitle}</p>
          </motion.div>

          <StaggerChildren className="grid md:grid-cols-2 gap-6">
            {[
              { quote: t.references.t1, name: t.references.t1Name, role: t.references.t1Role },
              { quote: t.references.t2, name: t.references.t2Name, role: '' },
              { quote: t.references.t3, name: t.references.t3Name, role: '' },
              { quote: t.references.t4, name: t.references.t4Name, role: '' },
            ].map((r, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="card-lift bg-white p-8 rounded-xl border border-gray-100 h-full"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 italic leading-relaxed mb-6 text-lg">"{r.quote}"</p>
                  <p className="font-semibold text-gold">{r.name}</p>
                  {r.role && <p className="text-xs text-gray-400 mt-1">{r.role}</p>}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </AnimatedSection>

      {/* ═══ Contact / Footer ═══ */}
      <footer id="contact" ref={el => { sectionRefs.current['contact'] = el }} className="bg-[#111] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid md:grid-cols-3 gap-12 mb-16"
          >
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h4 className="text-lg mb-6 font-semibold tracking-wider font-[var(--font-display)]">YACHT AUDIO LTD</h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                Oberlandstr. 13-14<br />12099 Berlin<br />Germany
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <h5 className="mb-6 font-semibold text-sm tracking-[0.2em] uppercase text-gold">{t.footer.contact}</h5>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>{t.footer.office}: +49 30 547074-75</li>
                <li>{t.footer.fax}: +49 30 547074-76</li>
                <li><a href="mailto:keepusbusy@yachtaudio.com" className="hover:text-gold transition-colors">keepusbusy@yachtaudio.com</a></li>
                <li><a href="http://www.yachtaudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">www.yachtaudio.com</a></li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h5 className="mb-6 font-semibold text-sm tracking-[0.2em] uppercase text-gold">{t.footer.resources}</h5>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#brochure" className="hover:text-gold transition-colors">{t.footer.brochure}</a></li>
                <li><Link to="/legal-notice" className="hover:text-gold transition-colors">{t.footer.legal}</Link></li>
              </ul>
            </motion.div>
          </motion.div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 YACHT AUDIO LTD. {t.footer.rights}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
