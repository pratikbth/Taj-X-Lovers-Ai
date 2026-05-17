import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CarFront, ChevronLeft, ChevronRight } from "lucide-react";

const BG_IMAGE = "/Assets/taj-background.png";

const airportPickupImages = [
  {
    src: "/Assets/airport-pickup/airport-pickup-1.jpeg",
    title: "Airport Welcome",
  },
  {
    src: "/Assets/airport-pickup/airport-pickup-2.jpeg",
    title: "Transfer Escort",
  },
  {
    src: "/Assets/airport-pickup/airport-pickup-3.jpeg",
    title: "Vehicle Boarding",
  },
  {
    src: "/Assets/airport-pickup/airport-pickup-4.jpeg",
    title: "In-Car Comfort",
  },
  {
    src: "/Assets/airport-pickup/airport-pickup-5.jpeg",
    title: "Private Departure",
  },
  {
    src: "/Assets/airport-pickup/airport-pickup-6.jpeg",
    title: "Hotel Arrival",
  },
];

export default function AirportPickupPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = airportPickupImages[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? airportPickupImages.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === airportPickupImages.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative min-h-screen text-white" data-testid="airport-pickup-page">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(34px) saturate(1.15)",
            WebkitBackdropFilter: "blur(34px) saturate(1.15)",
            background:
              "linear-gradient(135deg, rgba(4, 5, 6, 0.86), rgba(24, 18, 13, 0.7) 48%, rgba(5, 5, 6, 0.9))",
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <button
            onClick={() => navigate("/concierge")}
            className="glass-button rounded-full px-4 py-2 flex items-center gap-2 text-sm"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
            data-testid="back-to-concierge"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Concierge</span>
          </button>

          <h1
            className="text-xl md:text-2xl text-white/90"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
          >
            Airport Pickup
          </h1>

          <div className="w-[112px]" />
        </div>

        <main className="flex-1 px-4 md:px-8 pb-8 max-w-7xl mx-auto w-full flex flex-col gap-5">
          <section className="pt-5">
            <p
              className="text-white/50 text-xs uppercase tracking-[0.35em] mb-3"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
            >
              Arrival Service
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl text-white leading-tight max-w-3xl"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}
              >
                Chauffeur pickup, shown step by step.
              </h2>
              <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-2 w-fit">
                <CarFront className="w-4 h-4 text-white/70" strokeWidth={1.4} />
                <span
                  className="text-white/70 text-xs uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  {activeIndex + 1} / {airportPickupImages.length}
                </span>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-2xl overflow-hidden flex-1 min-h-[520px] relative">
            <img
              src={activeImage.src}
              alt={activeImage.title}
              className="absolute inset-0 w-full h-full object-cover"
              data-testid="airport-pickup-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/12 to-black/20" />

            <div className="absolute left-4 right-4 bottom-4 md:left-6 md:right-6 md:bottom-6 flex items-end justify-between gap-4">
              <div>
                <p
                  className="text-white/55 text-[11px] uppercase tracking-[0.28em]"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  Image {activeIndex + 1}
                </p>
                <h3
                  className="text-3xl md:text-4xl text-white"
                  style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}
                >
                  {activeImage.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  className="glass-button rounded-full w-11 h-11 flex items-center justify-center"
                  aria-label="Previous image"
                  data-testid="airport-pickup-prev"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <button
                  onClick={goToNext}
                  className="glass-button rounded-full px-4 py-3 flex items-center gap-2 text-sm uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                  data-testid="airport-pickup-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-center gap-2" data-testid="airport-pickup-dots">
            {airportPickupImages.map((image, index) => (
              <button
                key={image.title}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-8 bg-white/80" : "w-2 bg-white/30"}`}
                aria-label={`Show ${image.title}`}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
