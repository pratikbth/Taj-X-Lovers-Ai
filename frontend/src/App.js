import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import StudioPage from "@/pages/StudioPage";
import TemplatesPage from "@/pages/TemplatesPage";
import ConciergePage from "@/pages/ConciergePage";
import AirportPickupPage from "@/pages/AirportPickupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/concierge" element={<ConciergePage />} />
        <Route path="/concierge/airport-pickup" element={<AirportPickupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
