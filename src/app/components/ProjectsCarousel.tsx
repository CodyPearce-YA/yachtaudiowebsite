import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    id: "superyacht",
    title: "SUPER YACHT",
    subtitle: "80+ Super Yachts worldwide",
    image:
      "https://images.unsplash.com/photo-1697124510322-27ef594f67fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGx1eHVyeSUyMGxvdW5nZSUyMGVudGVydGFpbm1lbnR8ZW58MXx8fHwxNzczMTU3MjI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Super Yacht luxury lounge",
  },
  {
    id: "residence",
    title: "PRIVATE RESIDENCE",
    subtitle: "Lakeside & countryside luxury homes",
    image:
      "https://images.unsplash.com/photo-1758448755952-42b404bc6f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNpZGVuY2UlMjBzbWFydCUyMGhvbWUlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzczMTU3MjI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Private Residence Installation",
  },
  {
    id: "penthouse",
    title: "PRIVATE PENTHOUSE",
    subtitle: "Penthouses in Monaco, Geneva & beyond",
    image:
      "https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjBob21lJTIwdGhlYXRlciUyMGluc3RhbGxhdGlvbnxlbnwxfHx8fDE3NzMxNTcyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Private Penthouse Installation",
  },
];

export function ProjectsCarousel() {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <div
                  className="relative cursor-pointer overflow-hidden"
                  style={{ height: "calc(100vh - 260px)" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => navigate(`/projects#${slide.id}`)}
                >
                  {/* Image */}
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                    style={{
                      transform: isHovered ? "scale(1.04)" : "scale(1)",
                      transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isHovered
                        ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)",
                      transition: "background 0.6s ease",
                    }}
                  />

                  {/* Gold accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-[3px] bg-[#A2834E]"
                    style={{
                      width: isHovered ? "100%" : "0%",
                      transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />

                  {/* Text content */}
                  <div className="absolute inset-0 flex flex-col justify-end px-12 pb-14">
                    <p
                      className="text-[#A2834E] text-sm tracking-[0.3em] uppercase mb-3"
                      style={{
                        opacity: isHovered ? 1 : 0.7,
                        transition: "opacity 0.4s ease",
                      }}
                    >
                      {slide.subtitle}
                    </p>
                    <h3 className="text-5xl md:text-7xl font-light text-white tracking-wider mb-6">
                      {slide.title}
                    </h3>
                    <div
                      className="flex items-center gap-3 text-white/90"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "translateY(0)" : "translateY(12px)",
                        transition: "opacity 0.4s ease, transform 0.4s ease",
                      }}
                    >
                      <span className="text-sm tracking-[0.2em] uppercase">View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side navigation arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/40 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/40 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-3 mt-6">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="group flex items-center gap-2 transition-all"
            aria-label={`Go to ${slide.title}`}
          >
            <div
              className="h-px bg-[#A2834E] transition-all duration-500"
              style={{ width: index === selectedIndex ? "2rem" : "0.75rem", opacity: index === selectedIndex ? 1 : 0.4 }}
            />
            <span
              className="text-xs tracking-widest uppercase transition-all duration-300"
              style={{ color: "#A2834E", opacity: index === selectedIndex ? 1 : 0.4 }}
            >
              {slide.title.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
