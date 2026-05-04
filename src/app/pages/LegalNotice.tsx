import { Link } from 'react-router'

export default function LegalNotice() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gold/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-16">
          <Link to="/" className="text-xl sm:text-2xl tracking-[0.3em] text-gold font-light font-[Cinzel,serif]">YACHT AUDIO</Link>
        </nav>
      </header>

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl mb-12 text-gray-900">Legal Notice</h1>

          <div className="space-y-8 text-gray-800">
            <div>
              <h2 className="text-2xl mb-4 text-gray-900">Yacht Audio LTD</h2>
              <p className="leading-relaxed">
                Centris Business Gateway<br />
                Level 4 Triq Is-Salib Tal-Imriehel<br />
                Central Business District<br />
                Zone 3 Birkirkara CBD3020<br />
                Malta
              </p>
            </div>

            <div>
              <h2 className="text-2xl mb-4 text-gray-900">Contact</h2>
              <p className="leading-relaxed">
                Phone: +49 (0) 30 - 54 70 74 75<br />
                E-Mail: <a href="mailto:keepusbusy@yachtaudio.com" className="text-gold hover:underline">keepusbusy@yachtaudio.com</a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl mb-4 text-gray-900">Registration</h2>
              <p className="leading-relaxed">
                Company Registration Number: C77443<br />
                VAT Number: MT23652717
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
