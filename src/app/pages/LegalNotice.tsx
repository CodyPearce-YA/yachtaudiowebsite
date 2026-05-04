import logoImage from 'figma:asset/627b243c133f57164f5fbced833a197efa97830d.png';
import { Link } from 'react-router';

export default function LegalNotice() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#A2834E]/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            {/* Centered Logo */}
            <Link to="/" className="flex-shrink-0 max-w-[60%] sm:max-w-[40%] md:max-w-xs">
              <img src={logoImage} alt="Yacht Audio Logo" className="w-full h-auto object-contain" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
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
                E-Mail: <a href="mailto:keepusbusy@yachtaudio.com" className="text-[#A2834E] hover:underline">keepusbusy@yachtaudio.com</a>
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
  );
}