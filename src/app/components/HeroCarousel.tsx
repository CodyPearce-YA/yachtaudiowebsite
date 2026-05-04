import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import yacht1 from 'figma:asset/a84d7dee47851d91023be3638bc0cc20b0ddb63f.png';
import yacht2 from 'figma:asset/cb37afc7af0e5e0d4260c76f1a8614090e6d51cc.png';
import yacht3 from 'figma:asset/5c8be61b9ba34a1e3ebe109a0915f4491e8aef09.png';
import yacht4 from 'figma:asset/e921bc4ebedf64b06e78d105aab1e49f095c9753.png';

const slides = [
  {
    id: 1,
    image: yacht1,
    title: 'Recent Project: 118m M/Y LIVA',
    description: 'Complete audio, video, control, satcom, IT, sec system for all owner/guest/crew areas; Custom designed and custom made high-performance inwall-, inceiling-speaker and subwoofer; High-Performance NVX video and Dante audio distribution.',
  },
  {
    id: 2,
    image: yacht2,
    title: 'Recent Project: 118m M/Y LIVA',
    description: 'Complete audio, video, control, satcom, IT, sec system for all owner/guest/crew areas; Custom designed and custom made high-performance inwall-, inceiling-speaker and subwoofer; High-Performance NVX video and Dante audio distribution.',
  },
  {
    id: 3,
    image: yacht3,
    title: 'Recent Project: 118m M/Y LIVA',
    description: 'Complete audio, video, control, satcom, IT, sec system for all owner/guest/crew areas; Custom designed and custom made high-performance inwall-, inceiling-speaker and subwoofer; High-Performance NVX video and Dante audio distribution.',
  },
  {
    id: 4,
    image: yacht4,
    title: 'Recent Project: 118m M/Y LIVA',
    description: 'Complete audio, video, control, satcom, IT, sec system for all owner/guest/crew areas; Custom designed and custom made high-performance inwall-, inceiling-speaker and subwoofer; High-Performance NVX video and Dante audio distribution.',
  },
];

export function HeroCarousel() {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <div className="relative w-full border-t-4 border-b-4 border-[#A2834E]">
      <div className="relative group overflow-hidden block leading-[0]">
        <Slider ref={sliderRef} {...settings}>
          {slides.map((slide) => (
            <div key={slide.id} className="relative block leading-[0]">
              <div className="relative w-full block" style={{ paddingBottom: '40%' }}> {/* Adjusted height to show content below */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover block"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          ))}
        </Slider>

        {/* Custom Navigation Arrows */}
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 sm:p-4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 sm:p-4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Custom Dots Styling */}
      <style>{`
        .slick-slider {
          display: block;
        }
        .slick-list {
          display: block;
          margin: 0;
          padding: 0;
        }
        .slick-track {
          display: block;
        }
        .slick-dots {
          bottom: 20px;
          z-index: 10;
        }
        @media (min-width: 640px) {
          .slick-dots {
            bottom: 40px;
          }
        }
        .slick-dots li button:before {
          font-size: 12px;
          color: white;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          opacity: 1;
          color: white;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}