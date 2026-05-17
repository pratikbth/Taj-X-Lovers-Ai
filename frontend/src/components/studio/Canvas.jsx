import { useState } from "react";
import { Sparkles, Download, Loader2, ImageIcon, Plus } from "lucide-react";
import axios from "axios";

const BACKEND_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const API = `${BACKEND_BASE_URL}/api`;

const isHttpUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value);
const isDataUrl = (value) => typeof value === "string" && value.startsWith("data:");

const dataUrlToBase64 = (value) => {
  if (!isDataUrl(value)) return null;
  const commaIndex = value.indexOf(",");
  return commaIndex >= 0 ? value.slice(commaIndex + 1) : null;
};

const urlToBase64 = async (url) => {
  try {
    if (isDataUrl(url)) {
      return dataUrlToBase64(url);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Image request failed with ${response.status}`);
    }

    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          resolve(null);
          return;
        }
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    return null;
  }
};

export default function Canvas({ filters, referenceImage, venueImage, selectedAngle, onAddToMoodboard }) {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedVariants, setGeneratedVariants] = useState([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [highQualityMode, setHighQualityMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceImage, setServiceImage] = useState(null);
  const [showServiceView, setShowServiceView] = useState(false);
  const [error, setError] = useState(null);

  const currentImage = showServiceView && serviceImage ? serviceImage : (generatedVariants[selectedVariantIndex] || generatedImage);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgressText("");
    setError(null);
    setGeneratedImage(null);
    setGeneratedVariants([]);
    setSelectedVariantIndex(0);

    try {
      let fullPrompt = prompt.trim();
      if (selectedAngle) {
        fullPrompt += `. Perspective: ${selectedAngle.angle} of ${selectedAngle.space}`;
      }

      let venueImageBase64 = null;
      if (venueImage) {
        venueImageBase64 = await urlToBase64(venueImage);
      }

      let designImageBase64 = null;
      if (referenceImage?.data) {
        designImageBase64 = referenceImage.data;
      } else if (referenceImage?.thumbnailUrl) {
        designImageBase64 = await urlToBase64(referenceImage.thumbnailUrl);
      } else if (referenceImage?.preview) {
        designImageBase64 = await urlToBase64(referenceImage.preview);
      }

      const designImageSourceUrl = referenceImage?.thumbnailUrl || referenceImage?.preview || null;
      const designImageUrl = isHttpUrl(designImageSourceUrl) ? designImageSourceUrl : null;
      const venueImageUrl = isHttpUrl(venueImage) ? venueImage : null;
      const hasVenueInput = !!venueImageBase64 || !!venueImage;
      const hasDesignInput = !!designImageBase64 || !!designImageUrl;

      if (!hasVenueInput) {
        setError("Venue image missing. Please select a space and angle first.");
        return;
      }

      if (!hasDesignInput) {
        setError("Design reference missing. Please upload/select a reference image.");
        return;
      }

      const targetVariants = highQualityMode ? 3 : 1;
      setProgressText(targetVariants > 1 ? "Generating 3 options in one pass..." : "Generating your design...");

      const payload = {
        prompt: fullPrompt,
        function_type: filters.function_type || null,
        space: filters.space || null,
        venue_image: venueImageBase64,
        design_image: designImageBase64,
        venue_image_url: venueImageBase64 ? null : venueImageUrl,
        design_image_url: designImageUrl,
        reference_image: null,
        high_quality: highQualityMode,
        variant_count: targetVariants,
      };

      const res = await axios.post(`${API}/generate`, payload);
      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to generate image");
      }

      const variants = Array.isArray(res.data.variants)
        ? res.data.variants
            .map((item) => (item && typeof item === "object" ? item.image_data : null))
            .filter(Boolean)
        : [];

      const collected = variants.length > 0 ? variants : res.data.image_data ? [res.data.image_data] : [];
      if (collected.length === 0) {
        throw new Error("No image returned from generation");
      }

      setGeneratedVariants(collected.slice(0, targetVariants));
      setSelectedVariantIndex(0);
      setGeneratedImage(collected[0]);

      // If Services is enabled, request a second image by appending the service-mode brief
      if (selectedService) {
        try {
          setProgressText("Generating services overlay...");

          const servicesAppendText = `CRITICAL INSTRUCTION: This is a SERVICE OVERLAY composition. Composite the following service staff and hospitality elements DIRECTLY ONTO the existing event venue shown. The background, decor, furniture, floral arrangements, lighting, color theme, and all architectural elements MUST remain completely unchanged.

PRIMARY SERVICE REQUIREMENT:
- Add clearly visible waiters throughout the scene without altering the original image composition
- Waiters must be actively attending guests at tables and moving through the venue
- Keep the first image unchanged and only layer service staff onto it

PRIMARY FOCUS - WAITERS AND SERVICE STAFF (these must be prominently visible and actively engaged):
- Multiple professional waiters in pristine white shirts, black waistcoats, and elegant bow ties actively circulating between tables
- Waiters holding silver service trays with graceful posture, leaning in to serve guests at their seats
- Close-up detail on crisp white gloved hands presenting dishes and beverages to seated guests
- Different waiters at different positions throughout the venue (foreground, mid-ground, background) to show full service in action
- Butler staff in formal attire with white gloves presenting plated fine dining courses to elegantly seated guests
- Waiters maintaining impeccable bearing and professional demeanor while attending to guest needs

SUPPORTING SERVICE ELEMENTS:
- Polished champagne and cocktail service station with uniformed bartender in tuxedo arranging crystal glasses and bottles
- Catering and service staff in the background (blurred, supporting roles) managing food stations with silver chafing dishes and floral garnishes
- White-gloved service staff positioning fresh floral centerpieces and adjusting table settings
- Additional sommelier or wine service staff presenting wine selections to diners
- Soft warm candlelight reflecting off polished silverware, crystal glasses, and white linen tablecloths
- Guests in formal evening wear actively being attended to and served at their seats

COMPOSITION REQUIREMENTS:
- All original event decor elements (floral arrangements, lighting fixtures, stage, color palette, furniture, architectural features) remain exactly as they were - NO modifications
- Service staff are composited naturally into the scene, not replacing or covering the original decor
- Lighting, shadows, and reflections of service staff match the ambient lighting of the original venue
- Multiple service moments visible simultaneously to convey full active service mode
- Maintain the exact spatial relationships and perspectives of the original venue

Style: Luxury fine dining event photography, photorealistic, 4K resolution, warm golden ambient lighting with candlelight reflections, wide-angle perspective capturing complete active service experience. Professional Fairmont Hotels standards - five-star hospitality aesthetic with impeccable white-glove service.`;

          const servicePrompt = `${fullPrompt}\n\n${servicesAppendText}`;

          const servicePayload = {
            prompt: servicePrompt,
            function_type: filters.function_type || null,
            space: filters.space || null,
            // Use the generated image as venue — staff are composited onto it
            venue_image: collected[0],
            // No design_image: sending the reference here confuses the model into re-decorating
            design_image: null,
            venue_image_url: null,
            design_image_url: null,
            reference_image: null,
            high_quality: false,
            variant_count: 1,
            service_mode: true,
          };

          const svcRes = await axios.post(`${API}/generate`, servicePayload);
          if (svcRes.data && svcRes.data.success) {
            const svcImg = svcRes.data.image_data || (Array.isArray(svcRes.data.variants) && svcRes.data.variants[0] && svcRes.data.variants[0].image_data) || null;
            if (svcImg) {
              setServiceImage(svcImg);
              setShowServiceView(true);
            }
          }
        } catch (svcErr) {
          console.warn("Service overlay generation failed:", svcErr?.message || svcErr);
        } finally {
          setProgressText("");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
      setProgressText("");
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${currentImage}`;
    link.download = `design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isGenerating) {
      handleGenerate();
    }
  };

  return (
    <div className="h-full flex flex-col gap-4" data-testid="studio-canvas">
      <div className="relative flex items-center w-full" data-testid="prompt-bar">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your dream venue design..."
          className="glass-input w-full rounded-full pl-6 pr-36 py-4 text-sm md:text-base"
          style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          disabled={isGenerating}
          data-testid="prompt-input"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="absolute right-2 glass-button rounded-full px-5 py-2.5 flex items-center gap-2 text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
          data-testid="generate-button"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> : <Sparkles className="w-4 h-4" strokeWidth={1.5} />}
          {isGenerating ? "Generating" : "Generate"}
        </button>
      </div>

      <div className="flex items-center gap-2 px-1">
        <button
          onClick={() => setHighQualityMode((prev) => !prev)}
          disabled={isGenerating}
          className={`glass-button rounded-full px-3 py-1 text-xs uppercase tracking-wider ${highQualityMode ? "glass-pill-active" : ""}`}
          data-testid="toggle-high-quality"
        >
          {highQualityMode ? "High Quality x3" : "Standard x1"}
        </button>

        {/* Services selector button */}
        <div className="relative">
          <button
            onClick={() => setSelectedService((prev) => (prev ? null : "Services"))}
            disabled={isGenerating}
            className={`glass-button rounded-full px-3 py-1 text-xs uppercase tracking-wider ${selectedService ? "glass-pill-active" : ""}`}
            data-testid="toggle-services"
          >
            Services
          </button>
        </div>
      </div>

      {(filters.function_type || filters.space || selectedAngle || referenceImage || venueImage || selectedService) && (
        <div className="flex items-center gap-2 flex-wrap px-1">
          <span className="text-white/40 text-xs" style={{ fontFamily: "var(--font-body)" }}>
            Active:
          </span>
          {filters.function_type && <span className="glass-pill-active rounded-full px-3 py-1 text-xs">{filters.function_type}</span>}
          {filters.space && <span className="glass-pill-active rounded-full px-3 py-1 text-xs">{filters.space}</span>}
          {selectedAngle && <span className="glass-pill-active rounded-full px-3 py-1 text-xs">{selectedAngle.angle}</span>}
          {venueImage && (
            <span className="glass-pill-active rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <ImageIcon className="w-3 h-3" strokeWidth={1.5} /> Venue
            </span>
          )}
          {referenceImage && !venueImage && (
            <span className="glass-pill-active rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <ImageIcon className="w-3 h-3" strokeWidth={1.5} /> Ref
            </span>
          )}
          {selectedService && (
            <span className="glass-pill-active rounded-full px-3 py-1 text-xs">{selectedService}</span>
          )}
        </div>
      )}

      <div className="flex-1 glass-panel rounded-2xl relative flex items-center justify-center overflow-hidden" data-testid="main-canvas">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white/70 animate-spin" strokeWidth={1} />
            </div>
            <p className="text-white/50 text-sm tracking-wide" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
              {progressText || "Creating your vision..."}
            </p>
            <div className="w-48 h-1 rounded-full overflow-hidden bg-white/10">
              <div className="h-full shimmer-loading rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
        ) : currentImage ? (
          <>
            <img
              src={`data:image/png;base64,${currentImage}`}
              alt="Generated venue design"
              className="max-w-full max-h-full object-contain rounded-lg"
              data-testid="generated-image"
            />

            {generatedVariants.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2" data-testid="variant-strip">
                {generatedVariants.map((variant, idx) => (
                  <button
                    key={`variant-${idx}`}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setGeneratedImage(variant);
                    }}
                    className={`rounded-xl overflow-hidden border ${selectedVariantIndex === idx ? "border-white/60" : "border-white/20"}`}
                    title={`Option ${idx + 1}`}
                    data-testid={`variant-option-${idx + 1}`}
                  >
                    <img
                      src={`data:image/png;base64,${variant}`}
                      alt={`Generated option ${idx + 1}`}
                      className="w-16 h-12 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                onClick={() => {
                  if (onAddToMoodboard && currentImage) {
                    onAddToMoodboard(currentImage, prompt);
                  }
                }}
                className="glass-button rounded-full px-4 py-3 flex items-center gap-2 text-sm uppercase tracking-wider"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
                data-testid="add-to-moodboard"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                Add
              </button>
              {serviceImage && (
                <button
                  onClick={() => setShowServiceView((v) => !v)}
                  className="glass-button rounded-full px-4 py-3 flex items-center gap-2 text-sm uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
                  data-testid="toggle-service-view"
                >
                  {showServiceView ? "Main View" : "Services View"}
                </button>
              )}
              <button
                onClick={handleDownload}
                className="glass-button rounded-full px-6 py-3 flex items-center gap-2 text-sm uppercase tracking-wider"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
                data-testid="download-image"
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
                Download
              </button>
            </div>
          </>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 px-8 text-center">
            <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white/40" strokeWidth={1} />
            </div>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              {error}
            </p>
            <button
              onClick={handleGenerate}
              className="glass-button rounded-full px-5 py-2 text-xs uppercase tracking-wider mt-2"
              data-testid="retry-generate"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white/30" strokeWidth={1} />
            </div>
            <p className="text-white/40 text-sm tracking-wide" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
              Describe your dream venue and hit Generate
            </p>
            <p className="text-white/25 text-xs" style={{ fontFamily: "var(--font-body)" }}>
              Select filters on the left for more targeted designs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
