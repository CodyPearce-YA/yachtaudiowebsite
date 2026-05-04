import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'

const projects = [
  {
    id: 'superyacht',
    title: 'SUPER YACHT',
    location: 'Mediterranean & Worldwide',
    description: 'A complete AV and control ecosystem built for life at sea. Engineered to withstand the marine environment while delivering luxury entertainment across every deck.',
    image: 'https://images.unsplash.com/photo-1697124510322-27ef594f67fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    features: ['Video Distribution', 'Audio Distribution', 'Cinema System Out- & Indoor', 'Yacht Experience Center', 'High End Audio', 'Party Setup', 'Control System', 'Steward Call System', 'IT & Cyber Security', 'Telephone System', 'Security System', 'DAS System'],
  },
  {
    id: 'residence',
    title: 'PRIVATE RESIDENCE',
    location: 'Geneva, Monaco & Beyond',
    description: 'From lakeside retreats to countryside estates — seamless control, premium audio and cinema-quality entertainment for the most discerning private homes.',
    image: 'https://images.unsplash.com/photo-1758448755952-42b404bc6f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    features: ['Video & Audio Distribution', 'Cinema System', 'High End Audio', 'Control System', 'Car Parking & Lift', 'Greenkeeper & Irrigation', 'Greenlight X-Storage & Charging', 'Butler Call System', 'IT & Cyber Security', 'Telephone System', 'Security & Smoke Detection', 'DAS System'],
  },
  {
    id: 'penthouse',
    title: 'PRIVATE PENTHOUSE',
    location: 'Monaco, Paris & Major Cities',
    description: 'Urban luxury redefined. Smart home technology, premium cinema and multi-room audio integrated into architecturally striking spaces — all from a single interface.',
    image: 'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    features: ['Video Distribution', 'Audio Distribution', 'Cinema System', 'High End Audio', 'Control System', 'Lift Control', 'Butler Call System', 'IT & Cyber Security', 'Telephone System', 'Security System'],
  },
]

export default function Projects() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gold/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-gold hover:opacity-70 transition-opacity text-sm tracking-widest uppercase">
            <ArrowLeft className="w-4 h-4" />Back
          </Link>
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-xl sm:text-2xl tracking-[0.3em] text-gold font-light font-[var(--font-display)]">YACHT AUDIO</Link>
          <div className="w-16" />
        </nav>
      </header>

      <div className="pt-16 bg-[#111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Our Work</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-wide">OUR PROJECTS</h1>
        </div>
      </div>

      <main>
        {projects.map((p, i) => (
          <section key={p.id} id={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
              <div className="w-full lg:w-1/2 overflow-hidden rounded-lg shadow-2xl">
                <img src={p.image} alt={p.title} className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full lg:w-1/2">
                <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">{p.location}</p>
                <h2 className="text-4xl md:text-5xl font-light tracking-wider text-gray-900 mb-6">{p.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-10 text-lg">{p.description}</p>
                <div className="border-t border-gold/20 pt-8">
                  <p className="text-xs tracking-[0.25em] uppercase text-gold mb-5">Typical Installation</p>
                  <ul className="grid grid-cols-2 gap-y-3 gap-x-6">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-gray-700 text-sm">
                        <span className="text-gold mt-0.5">—</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {i < projects.length - 1 && <div className="h-px bg-gold/15 mx-auto max-w-7xl" />}
          </section>
        ))}
      </main>

      <div className="bg-[#111] text-white py-20 text-center">
        <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Ready to Begin?</p>
        <h2 className="text-4xl font-light tracking-wide mb-8">Let's Build Something Exceptional</h2>
        <a href="mailto:keepusbusy@yachtaudio.com" className="inline-block border border-gold text-gold px-10 py-3 text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition-all duration-300">Get in Touch</a>
      </div>
    </div>
  )
}
