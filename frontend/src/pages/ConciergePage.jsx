import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BriefcaseBusiness,
  CarFront,
  Coffee,
  Hotel,
  Luggage,
  Scissors,
  Shirt,
  Sparkles,
} from "lucide-react";

const BG_IMAGE = "/Assets/taj-background.png";

const conciergeSections = [
  {
    id: "airport-pickup",
    eyebrow: "Arrival Service",
    title: "Airport Pickup",
    image: "/Assets/airport-pickup/airport-pickup-1.jpeg",
    icon: CarFront,
    description:
      "Guests are welcomed at Chhatrapati Shivaji Maharaj International Airport and escorted to the hotel in a chauffeur-driven Mercedes-Benz.",
    highlights: [
      { icon: Luggage, label: "Luggage is received, tagged, and delivered directly to the guest room" },
      { icon: Hotel, label: "Reception team coordinates arrival timing with the concierge desk" },
    ],
  },
  {
    id: "smooth-checkin",
    eyebrow: "Lobby Experience",
    title: "Smooth Check-In",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85",
    icon: Hotel,
    description:
      "A polished check-in journey with calm hosting, reserved arrival seating, welcome refreshments, and room readiness handled before the guest reaches the desk.",
    highlights: [
      { icon: Sparkles, label: "Priority arrival flow for wedding, social, and corporate guests" },
      { icon: Coffee, label: "Welcome beverages served while documents and keys are prepared" },
    ],
  },
  {
    id: "amenities",
    eyebrow: "Guest Amenities",
    title: "Signature Amenities",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85",
    icon: Bath,
    description:
      "A refined collection of hotel services designed around comfort, grooming, wellness, and effortless daily care throughout the stay.",
    highlights: [
      { icon: Bath, label: "Spa services and wellness appointments" },
      { icon: Coffee, label: "Complimentary breakfast service" },
      { icon: Shirt, label: "Laundry and garment care" },
      { icon: Scissors, label: "Beauty salon and grooming assistance" },
    ],
  },
  {
    id: "business-centre",
    eyebrow: "Corporate Hosting",
    title: "Business Centre",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=85",
    icon: BriefcaseBusiness,
    description:
      "A grand business centre experience inspired by Grand Terminus, prepared for board meetings, executive gatherings, launches, and corporate events.",
    highlights: [
      { icon: BriefcaseBusiness, label: "Flexible corporate event hosting with premium hospitality support" },
      { icon: Sparkles, label: "Elegant setup for presentations, networking, and private dining" },
    ],
  },
];

export default function ConciergePage() {
  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    if (section.id === "airport-pickup") {
      navigate("/concierge/airport-pickup");
    }
  };

  const handleSectionKeyDown = (event, section) => {
    if (section.id !== "airport-pickup") return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate("/concierge/airport-pickup");
    }
  };

  return (
    <div className="relative min-h-screen text-white" data-testid="concierge-page">
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
              "linear-gradient(135deg, rgba(4, 5, 6, 0.82), rgba(22, 18, 14, 0.72) 48%, rgba(5, 5, 6, 0.86))",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <button
            onClick={() => navigate("/studio")}
            className="glass-button rounded-full px-4 py-2 flex items-center gap-2 text-sm"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
            data-testid="back-to-studio"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Studio</span>
          </button>

          <h1
            className="text-xl md:text-2xl text-white/90"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
          >
            Concierge
          </h1>

          <div className="w-[84px]" />
        </div>

        <section className="px-5 md:px-8 pt-8 pb-10 max-w-5xl mx-auto">
          <p
            className="text-white/50 text-xs uppercase tracking-[0.35em] mb-3"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
          >
            Fairmont Hospitality
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white leading-tight max-w-3xl"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}
          >
            Concierge services crafted for seamless luxury arrivals and stays.
          </h2>
        </section>

        <main className="px-4 md:px-8 pb-14 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
          {conciergeSections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.id}
                onClick={() => handleSectionClick(section)}
                onKeyDown={(event) => handleSectionKeyDown(event, section)}
                role={section.id === "airport-pickup" ? "button" : undefined}
                tabIndex={section.id === "airport-pickup" ? 0 : undefined}
                className={`glass-panel rounded-2xl overflow-hidden min-h-[520px] flex flex-col ${section.id === "airport-pickup" ? "cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60" : ""}`}
                data-testid={`concierge-${section.id}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-5 bottom-5 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full glass-panel flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white/85" strokeWidth={1.4} />
                    </div>
                    <div>
                      <p
                        className="text-white/55 text-[11px] uppercase tracking-[0.25em]"
                        style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                      >
                        {section.eyebrow}
                      </p>
                      <h3
                        className="text-2xl text-white"
                        style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}
                      >
                        {section.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-5 md:p-6 flex flex-col gap-5">
                  <p
                    className="text-white/68 text-sm md:text-base leading-relaxed"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                  >
                    {section.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                    {section.highlights.map((item) => {
                      const HighlightIcon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="rounded-xl px-4 py-3"
                          style={{
                            background: "rgba(255, 255, 255, 0.055)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <HighlightIcon className="w-4 h-4 text-white/70 mb-2" strokeWidth={1.4} />
                          <p
                            className="text-white/62 text-xs leading-relaxed"
                            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                          >
                            {item.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </main>
      </div>
    </div>
  );
}
