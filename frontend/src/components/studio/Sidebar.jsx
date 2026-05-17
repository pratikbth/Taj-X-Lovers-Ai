import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Monitor, LayoutTemplate, ChevronDown } from "lucide-react";

const ASSET = "https://customer-assets.emergentagent.com/job_luxe-design-studio-2/artifacts";
const MAX_REFERENCE_IMAGE_SIZE = 1800;
const REFERENCE_IMAGE_QUALITY = 0.86;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const resizeImageFile = async (file) => {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = objectUrl;
    });

    const largestSide = Math.max(image.naturalWidth, image.naturalHeight);
    if (largestSide <= MAX_REFERENCE_IMAGE_SIZE) {
      return await readFileAsDataUrl(file);
    }

    const scale = MAX_REFERENCE_IMAGE_SIZE / largestSide;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", REFERENCE_IMAGE_QUALITY);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const SPACE_OPTIONS = [
  {
    name: "Banquet Hall",
    type: "BANQUET",
    thumbnail: "/Assets/new-venue-1.jpg",
    angles: [
      { label: "Front View", image: "/Assets/new-venue-1.jpg" },
    ],
  },
  {
    name: "Conference Hall",
    type: "CONFERENCE",
    thumbnail: "/Assets/new-venue-2.jpg",
    angles: [
      { label: "Front View", image: "/Assets/new-venue-2.jpg" },
    ],
  },
  {
    name: "Terminus",
    type: "TERMINUS",
    thumbnail: "/Assets/terminus-venue.jpg",
    angles: [
      { label: "Front View", image: "/Assets/terminus-venue.jpg" },
    ],
  },
  {
    name: "Ballroom",
    type: "BALLROOM",
    thumbnail: "/Assets/ballroom-venue.jpg",
    angles: [
      { label: "Front View", image: "/Assets/ballroom-venue.jpg" },
    ],
  },
];

const EVENT_OPTIONS = [
  { name: "Ultra-Luxury Wedding", desc: "Opulent destination wedding with international luxury standards", thumbnail: "/Assets/Ultra-Luxury.jpg" },
  { name: "Indian Destination Wedding", desc: "Grand Indian wedding with traditional elements and modern luxury", thumbnail: "/Assets/Destination-wedding.jpg" },
  { name: "Corporate Conference", desc: "Professional business event with modern staging and technology", thumbnail: "/Assets/Corparate.jpg" },
  { name: "Global Exhibition", desc: "International trade show or product showcase", thumbnail: "/Assets/Gloabal-Exhibiton.jpg" },
  { name: "Fashion Show", desc: "High-fashion runway event with dramatic staging", thumbnail: "/Assets/Fashion-Show.jpg" },
  { name: "Product Launch", desc: "Premium brand product unveiling event", thumbnail: "/Assets/Product-Launch.jpg" },
  { name: "Cultural Festival", desc: "Vibrant cultural celebration with diverse elements", thumbnail: "/Assets/Cultural-Festival.jpg" },
];

export { SPACE_OPTIONS, EVENT_OPTIONS };

export default function Sidebar({
  filters,
  setFilters,
  referenceImage,
  setReferenceImage,
  onSpaceClick,
  onHoverItem,
  onOpenTemplateRef,
}) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await resizeImageFile(file);
      const base64 = dataUrl.split(",")[1];
      setReferenceImage({ data: base64, preview: dataUrl, name: file.name });
      setShowUploadMenu(false);
    } catch (error) {
      console.error("Error loading design reference:", error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleMouseMove = (e, item) => {
    const sidebar = e.currentTarget.closest("[data-testid='studio-sidebar']");
    const sidebarRect = sidebar.getBoundingClientRect();
    onHoverItem({
      ...item,
      x: sidebarRect.right + 12,
      y: Math.min(e.clientY - 60, window.innerHeight - 200),
    });
  };

  return (
    <div
      className="glass-panel rounded-2xl h-full flex flex-col p-5 overflow-y-auto glass-scroll relative"
      data-testid="studio-sidebar"
      onMouseLeave={() => onHoverItem(null)}
    >
      {/* Upload Design Reference */}
      <div className="mb-6">
        <h3
          className="text-white/80 text-sm uppercase tracking-widest mb-3"
          style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
        >
          Design Reference
        </h3>

        {referenceImage ? (
          <div className="relative rounded-xl overflow-hidden border border-white/20">
            <img src={referenceImage.preview} alt="Reference" className="w-full h-32 object-cover" />
            <button
              onClick={() => setReferenceImage(null)}
              className="absolute top-2 right-2 glass-button rounded-full p-1.5"
              data-testid="remove-reference"
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-3 py-1.5">
              <p className="text-white/70 text-sm truncate" style={{ fontFamily: "var(--font-body)" }}>
                {referenceImage.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Upload button — click shows dropdown */}
            <button
              onClick={() => setShowUploadMenu((v) => !v)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                dragOver
                  ? "border-white/50 bg-white/10"
                  : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
              }`}
              data-testid="upload-design-reference"
            >
              <Upload className="w-5 h-5 text-white/50" strokeWidth={1.5} />
              <span className="text-white/60 text-sm tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                Upload Design Reference
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${showUploadMenu ? "rotate-180" : ""}`} strokeWidth={1.5} />
            </button>

            {/* Dropdown menu */}
            {showUploadMenu && (
              <div
                className="mt-2 rounded-xl overflow-hidden"
                style={{
                  backdropFilter: "blur(24px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
                }}
                data-testid="upload-menu"
              >
                <button
                  onClick={() => { fileInputRef.current?.click(); setShowUploadMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200"
                  data-testid="upload-from-computer"
                >
                  <Monitor className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <div>
                    <span className="block text-white/90 text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>Upload from Computer</span>
                    <span className="block text-white/40 text-xs" style={{ fontFamily: "var(--font-body)" }}>Browse your files</span>
                  </div>
                </button>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                <button
                  onClick={() => { onOpenTemplateRef(); setShowUploadMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200"
                  data-testid="take-template-reference"
                >
                  <LayoutTemplate className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <div>
                    <span className="block text-white/90 text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>Take Template Reference</span>
                    <span className="block text-white/40 text-xs" style={{ fontFamily: "var(--font-body)" }}>Select from luxury templates</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          data-testid="file-input"
        />
      </div>

      {/* Separator */}
      <div className="border-t border-white/10 mb-5" />

      {/* Select Space */}
      <div className="mb-5">
        <h3 className="text-white/90 text-sm mb-1" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
          Select Space
        </h3>
        <p className="text-white/40 text-sm mb-3" style={{ fontFamily: "var(--font-body)" }}>
          Click to explore angles
        </p>
        <div className="flex flex-col gap-2">
          {SPACE_OPTIONS.map((space) => (
            <button
              key={space.name}
              onClick={() => onSpaceClick(space)}
              onMouseMove={(e) => handleMouseMove(e, { thumbnail: space.thumbnail, name: space.name })}
              onMouseLeave={() => onHoverItem(null)}
              className={`text-left rounded-xl px-4 py-3 transition-all duration-300 ${
                filters.space === space.name ? "glass-pill-active border-white/40" : "glass-pill"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
              data-testid={`filter-space-${space.name.toLowerCase().replace(/[\s+]/g, "-")}`}
            >
                <span className="block text-sm font-medium text-white/90">{space.name}</span>
                <span className="block text-xs uppercase tracking-wider text-white/40 mt-0.5">{space.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-white/10 mb-5" />

      {/* Event Type */}
      <div className="mb-5">
        <h3 className="text-white/90 text-sm mb-1" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
          Event Type
        </h3>
        <p className="text-white/40 text-sm mb-3" style={{ fontFamily: "var(--font-body)" }}>
          Choose your occasion
        </p>
        <div className="flex flex-col gap-2">
          {EVENT_OPTIONS.map((event) => (
            <button
              key={event.name}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  function_type: prev.function_type === event.name ? null : event.name,
                }))
              }
              onMouseMove={(e) => handleMouseMove(e, { thumbnail: event.thumbnail, name: event.name })}
              onMouseLeave={() => onHoverItem(null)}
              className={`text-left rounded-xl px-4 py-3 transition-all duration-300 ${
                filters.function_type === event.name ? "glass-pill-active border-white/40" : "glass-pill"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
              data-testid={`filter-event-${event.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
                <span className="block text-sm font-medium text-white/90">{event.name}</span>
                <span className="block text-xs text-white/35 mt-0.5 leading-relaxed">{event.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {referenceImage && (
        <div className="mt-4 flex items-center gap-2 text-white/40 text-sm">
          <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span style={{ fontFamily: "var(--font-body)" }}>Reference loaded</span>
        </div>
      )}
    </div>
  );
}
