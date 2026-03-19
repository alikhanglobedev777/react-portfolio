import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  const [activeSection, setActiveSection] = React.useState("home");

  React.useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    if (!elements.length) return;

    elements.forEach((el) => el.classList.add("visible"));

    if (!window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [location]);

  React.useEffect(() => {
    // First, set active section based on the current pathname immediately
    let sectionId = "home";
    if (location.pathname === "/") {
      sectionId = "home";
    } else {
      sectionId = location.pathname.replace("/", "");
    }
    setActiveSection(sectionId);

    // Then set up the IntersectionObserver for fine-tuning when scrolling
    const sections = Array.from(document.querySelectorAll("section[id]"));
    if (!sections.length) return;

    const nav = document.querySelector(".navbar");
    const navHeight = nav ? nav.offsetHeight : 70;

    if (!window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!visible?.target?.id) return;
        setActiveSection(visible.target.id);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        // shift the "active" area down to account for navbar
        rootMargin: `-${navHeight + 8}px 0px -55% 0px`,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <>
      <Navbar activeSection={activeSection} />
      <main key={location.pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/blogs" element={<Home />} />
          <Route path="/projects" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/resume" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
