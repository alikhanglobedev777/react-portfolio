import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Cursor from "./components/Cursor";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Nav from "./components/Nav";
import ScrollProgress from "./components/ScrollProgress";
import ScrollTopRing from "./components/ScrollTopRing";
import { ScrollTrigger, startSmoothScroll } from "./lib/motion";
import CaseStudy from "./pages/CaseStudy";
import Home from "./pages/Home";

function Shell() {
  const location = useLocation();

  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Loader />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main id="main" key={location.pathname} className="page">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ScrollTopRing />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
