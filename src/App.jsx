import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import InteractionLayer from "./components/foundation/InteractionLayer";
import Home from "./pages/Home";
import ProjectCaseStudy from "./pages/ProjectCaseStudy";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { ProjectTransitionProvider } from "./transitions/ProjectTransitionContext";

function AppContent() {
  const location = useLocation();
  const isCaseStudy = location.pathname.startsWith("/projects/");

  useSmoothScroll();

  return (
    <>
      <InteractionLayer />
      {!isCaseStudy && <Navbar />}
      <main key={isCaseStudy ? location.pathname : "portfolio-home"} className="page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:projectId" element={<ProjectCaseStudy />} />
          <Route path="/projects" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<Navigate to="/" replace />} />
          <Route path="/experience" element={<Navigate to="/" replace />} />
          <Route path="/archive" element={<Navigate to="/" replace />} />
          <Route path="/resume" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<Navigate to="/" replace />} />
          <Route path="/blogs" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isCaseStudy && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ProjectTransitionProvider>
        <AppContent />
      </ProjectTransitionProvider>
    </Router>
  );
}
