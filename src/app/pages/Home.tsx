import { HeroVideo } from "../components/HeroVideo";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ProjectsCarousel } from "../components/ProjectsCarousel";
import { LanguageSelector } from "../components/LanguageSelector";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations/translations";
import { Menu, X } from "lucide-react";
import { SectionSidebar } from "../components/SectionSidebar";

const SECTION_ORDER = ["home", "about-us", "what-makes-different", "skills-services", "projects", "references", "contact"];

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState<{ [key: string]: number }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<{ [key: string]: number }>({});
  const isAnimatingRef = useRef(false);
  const observerRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerHeight = container.clientHeight;
      if (container.scrollTop > 50) setHasScrolled(true);

      const updated: { [key: string]: number } = { ...scrollProgressRef.current };
      Object.entries(observerRefs.current).forEach(([id, element]) => {
        if (!element) return;
        const { top, bottom } = element.getBoundingClientRect();
        let p = 0;
        if (top <= 0 && bottom >= containerHeight) p = 1;
        else if (top > 0 && top < containerHeight) p = Math.max(0, Math.min(1, (1 - top / containerHeight) * 2));
        else if (bottom > 0 && bottom < containerHeight) p = Math.max(0, Math.min(1, (bottom / containerHeight) * 2));
        updated[id] = p;
      });
      scrollProgressRef.current = updated;
      setScrollProgress({ ...updated });
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;

      const progress = scrollProgressRef.current;
      let bestId = "home";
      let bestP = -1;
      Object.entries(progress).forEach(([id, p]) => { if (p > bestP) { bestP = p; bestId = id; } });

      const currentIdx = SECTION_ORDER.indexOf(bestId);
      const dir = e.deltaY > 0 ? 1 : -1;
      const nextIdx = Math.max(0, Math.min(SECTION_ORDER.length - 1, currentIdx + dir));
      if (nextIdx === currentIdx) return;

      isAnimatingRef.current = true;
      const nextId = SECTION_ORDER[nextIdx];
      if (nextId === "home") {
        container.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        observerRefs.current[nextId]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(() => { isAnimatingRef.current = false; }, 900);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const getSectionStyle = (id: string) => {
    const p = Math.max(0, Math.min(1, scrollProgress[id] || 0));
    if (!hasScrolled) {
      return { opacity: 0, transform: "translateY(32px)", filter: "blur(5px)", transition: "none", pointerEvents: "none" as const };
    }
    return {
      opacity: p,
      transform: `translateY(${(1 - p) * 32}px)`,
      filter: `blur(${(1 - p) * 5}px)`,
      transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease",
      pointerEvents: p < 0.1 ? "none" as const : "auto" as const,
    };
  };

  const getActiveSection = () => {
    let activeId = "";
    let maxP = 0;
    Object.entries(scrollProgress).forEach(([id, p]) => {
      if (p > maxP && p > 0.5) { maxP = p; activeId = id; }
    });
    return activeId;
  };

  const sectionOrder = ["home", "about-us", "what-makes-different", "skills-services", "projects", "references", "contact"];
  const sectionTitles: Record<string, string> = {
    "home": t.nav.home,
    "about-us": t.whoWeAre.title,
    "what-makes-different": t.whatMakesDifferent.title,
    "skills-services": t.skillsServices.title,
    "projects": t.projects.title,
    "references": t.references.title,
    "contact": t.footer.contact,
  };

  const activeSection = getActiveSection() || "home";
  const activeIdx = sectionOrder.indexOf(activeSection);
  const nextSectionId = activeIdx >= 0 && activeIdx < sectionOrder.length - 1 ? sectionOrder[activeIdx + 1] : null;
  const nextSectionLabel = nextSectionId ? sectionTitles[nextSectionId] : null;

  const atHero = (scrollProgress["about-us"] ?? 0) < 0.15;

  const sidebarSections = [
    { id: "about-us", label: t.nav.whoWeAre },
    { id: "what-makes-different", label: t.whatMakesDifferent.title },
    { id: "skills-services", label: t.skillsServices.title },
    { id: "projects", label: t.nav.ourProjects },
    { id: "references", label: t.nav.references },
    { id: "contact", label: t.nav.contact },
  ];

  const sectionNames = [
    { id: "home", label: t.nav.home },
    { id: "about-us", label: t.nav.whoWeAre },
    { id: "projects", label: t.nav.ourProjects },
    { id: "references", label: t.nav.references },
    { id: "contact", label: t.nav.contact },
  ];

  const scrollToSection = (id: string) => {
    const container = containerRef.current;
    if (!container) return;
    if (id === "home") { container.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = observerRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [projectCounts, setProjectCounts] = useState({ yachts: 0, residences: 0 });
  const countAnimatedRef = useRef(false);

  useEffect(() => {
    if (scrollProgress["projects"] > 0.5 && !countAnimatedRef.current) {
      countAnimatedRef.current = true;
      const duration = 1400;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProjectCounts({ yachts: Math.round(eased * 80), residences: Math.round(eased * 20) });
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [scrollProgress]);

  const sectionBase = { height: "100vh" };

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll"
      style={{ overscrollBehavior: "none" }}
    >
      {/* Overlays */}
      <SectionSidebar
        sections={sidebarSections}
        scrollProgress={scrollProgress}
        onNavigate={scrollToSection}
        visible={true}
      />

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#A2834E]/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="w-24" />
            <a href="/" className="absolute left-1/2 -translate-x-1/2 flex-shrink-0">
              <span className="text-xl sm:text-2xl tracking-[0.3em] text-[#A2834E] font-light" style={{ fontFamily: "'QuickExpress', 'Cinzel', serif" }}>
                YACHT AUDIO
              </span>
            </a>
            <div className="flex items-center gap-1">
              <LanguageSelector />
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Toggle menu">
                {isMenuOpen ? <X className="w-6 h-6 text-[#A2834E]" /> : <Menu className="w-6 h-6 text-[#A2834E]" />}
              </button>
            </div>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="absolute top-16 right-0 w-72 bg-white border border-[#A2834E]/20 shadow-xl rounded-bl-lg">
            <ul className="px-4 py-4">
              {sectionNames.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => { scrollToSection(section.id); setIsMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${getActiveSection() === section.id ? "bg-[#A2834E]/10 text-[#A2834E] font-semibold" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* ─── Section 1: Hero ─── */}
      <section
        ref={(el) => (observerRefs.current["home"] = el)}
        style={sectionBase}
      >
        <HeroVideo />
      </section>

      {/* ─── Section 2: Who We Are ─── */}
      <section
        id="about-us"
        ref={(el) => (observerRefs.current["about-us"] = el)}
        className="bg-gray-50 overflow-hidden"
        style={{ ...sectionBase, ...getSectionStyle("about-us") }}
      >
        <div className="h-full flex flex-col pt-20">
          <div className="border-b border-[#A2834E]/20 py-5 px-8">
            <h2 className="text-3xl md:text-4xl text-[#A2834E] text-center">{t.whoWeAre.title}</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center py-6 px-8 overflow-hidden">
            <div className="max-w-6xl mx-auto w-full">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { src: "https://images.unsplash.com/photo-1697124510322-27ef594f67fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", alt: "Luxury yacht interior" },
                  { src: "https://images.unsplash.com/photo-1743685889437-210ad44b6c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", alt: "Premium cinema" },
                  { src: "https://images.unsplash.com/photo-1692246427974-c28629e3617e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", alt: "Audio visual system" },
                ].map((img) => (
                  <div key={img.alt} className="rounded-lg overflow-hidden shadow-md h-36">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-center space-y-3 text-gray-800 leading-relaxed">
                <p>{t.whoWeAre.intro1}</p>
                <p>{t.whoWeAre.intro2}</p>
                <p>{t.whoWeAre.intro3}</p>
                <p>{t.whoWeAre.intro4}</p>
                <p>{t.whoWeAre.intro5}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 3: What Makes Us Different ─── */}
      <section
        id="what-makes-different"
        ref={(el) => (observerRefs.current["what-makes-different"] = el)}
        className="bg-gray-50 overflow-hidden"
        style={{ ...sectionBase, ...getSectionStyle("what-makes-different") }}
      >
        <div className="h-full flex flex-col pt-20">
          <div className="border-b border-[#A2834E]/20 py-5 px-8">
            <h2 className="text-3xl md:text-4xl text-[#A2834E] text-center">{t.whatMakesDifferent.title}</h2>
          </div>
          <div className="flex-1 flex items-center py-6 px-8">
            <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-6">
              {[
                { num: "01", title: t.whatMakesDifferent.card1Title, text: t.whatMakesDifferent.card1Text },
                { num: "02", title: t.whatMakesDifferent.card2Title, text: t.whatMakesDifferent.card2Text },
                { num: "03", title: t.whatMakesDifferent.card3Title, text: t.whatMakesDifferent.card3Text },
                { num: "04", title: t.whatMakesDifferent.card4Title, text: t.whatMakesDifferent.card4Text },
              ].map((card) => (
                <div key={card.num} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-[#A2834E] rounded-full mb-4 flex items-center justify-center text-white">{card.num}</div>
                  <h3 className="text-xl mb-2 text-gray-900">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: Skills & Services ─── */}
      <section
        id="skills-services"
        ref={(el) => (observerRefs.current["skills-services"] = el)}
        className="bg-gray-50 overflow-hidden"
        style={{ ...sectionBase, ...getSectionStyle("skills-services") }}
      >
        <div className="h-full flex flex-col pt-20">
          <div className="border-b border-[#A2834E]/20 py-5 px-8">
            <h2 className="text-3xl md:text-4xl text-[#A2834E] text-center">{t.skillsServices.title}</h2>
          </div>
          <div className="flex-1 flex items-center py-6 px-8">
            <div className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-3 gap-10">
              {[
                { title: t.skillsServices.video, text: t.skillsServices.videoText },
                { title: t.skillsServices.audio, text: t.skillsServices.audioText },
                { title: t.skillsServices.control, text: t.skillsServices.controlText },
                { title: t.skillsServices.security, text: t.skillsServices.securityText },
                { title: t.skillsServices.it, text: t.skillsServices.itText },
                { title: t.skillsServices.installation, text: t.skillsServices.installationText },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-2 h-2 bg-[#A2834E] rounded-full mx-auto mb-3" />
                  <h3 className="text-lg mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Projects ─── */}
      <section
        id="projects"
        ref={(el) => (observerRefs.current["projects"] = el)}
        className="bg-[#111] overflow-hidden"
        style={{ ...sectionBase, ...getSectionStyle("projects") }}
      >
        <div className="h-full flex flex-col pt-20">
          <div className="px-8 py-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[#A2834E] text-xs tracking-[0.3em] uppercase mb-2">{t.projects.subtitle}</p>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide text-white">{t.projects.title}</h2>
            </div>
            <div className="flex gap-8 items-center">
              <div>
                <div className="text-3xl font-light text-[#A2834E]">{projectCounts.yachts}+</div>
                <div className="text-xs tracking-widest text-white/40 uppercase mt-1">{t.projects.superYachts}</div>
              </div>
              <div className="w-px h-10 bg-[#A2834E]/30" />
              <div>
                <div className="text-3xl font-light text-[#A2834E]">{projectCounts.residences}+</div>
                <div className="text-xs tracking-widest text-white/40 uppercase mt-1">{t.projects.residences}</div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden px-8 pb-6">
            <ProjectsCarousel />
          </div>
        </div>
      </section>

      {/* ─── Section 6: References ─── */}
      <section
        id="references"
        ref={(el) => (observerRefs.current["references"] = el)}
        className="bg-white overflow-hidden"
        style={{ ...sectionBase, ...getSectionStyle("references") }}
      >
        <div className="h-full flex flex-col pt-20">
          <div className="border-b border-[#A2834E]/20 py-5 px-8">
            <h2 className="text-3xl md:text-4xl text-[#A2834E] text-center">{t.references.title}</h2>
            <p className="text-center text-gray-500 text-sm mt-1">{t.references.subtitle}</p>
          </div>
          <div className="flex-1 flex items-center py-6 px-8">
            <div className="max-w-3xl mx-auto w-full grid md:grid-cols-2 gap-6">
              {[
                { quote: t.references.testimonial1, name: "Brett Smith", role: `${t.references.captain} M/Y Eclipse – 162m Blohm+Voss` },
                { quote: t.references.testimonialB, name: t.references.clientB, role: "" },
                { quote: t.references.testimonialC, name: t.references.clientC, role: "" },
                { quote: t.references.testimonialD, name: t.references.clientD, role: "" },
              ].map((item) => (
                <div key={item.name} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <p className="text-gray-700 italic text-sm leading-relaxed mb-4">"{item.quote}"</p>
                  <p className="font-semibold text-[#A2834E] text-sm">{item.name}</p>
                  {item.role && <p className="text-xs text-gray-400 mt-0.5">{item.role}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 7: Contact ─── */}
      <footer
        id="contact"
        ref={(el) => (observerRefs.current["contact"] = el)}
        className="bg-gray-100"
        style={sectionBase}
      >
        <div className="h-full flex flex-col justify-center pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div>
                <h4 className="text-lg mb-4 font-semibold tracking-wide">YACHT AUDIO LTD</h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Oberlandstr. 13-14<br />12099 Berlin<br />Germany
                </p>
              </div>
              <div>
                <h5 className="mb-4 font-semibold text-sm tracking-widest uppercase">{t.footer.contact}</h5>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>{t.footer.office}: +49 30 547074-75</li>
                  <li>{t.footer.fax}: +49 30 547074-76</li>
                  <li><a href="mailto:keepusbusy@yachtaudio.com" className="hover:text-[#A2834E] transition-colors">keepusbusy@yachtaudio.com</a></li>
                  <li><a href="http://www.yachtaudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A2834E] transition-colors">www.yachtaudio.com</a></li>
                </ul>
              </div>
              <div>
                <h5 className="mb-4 font-semibold text-sm tracking-widest uppercase">{t.footer.resources}</h5>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><a href="#brochure" className="hover:text-[#A2834E] transition-colors">{t.footer.brochure}</a></li>
                  <li><Link to="/legal-notice" className="hover:text-[#A2834E] transition-colors">{t.footer.legal}</Link></li>
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
  );
}
