import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CtaBand from "../components/CtaBand";
import { scrollToId } from "../lib/motion";
import { useReveal } from "../lib/useReveal";
import About from "../sections/About";
import Automation from "../sections/Automation";
import Capabilities from "../sections/Capabilities";
import Contact from "../sections/Contact";
import Experience from "../sections/Experience";
import Expertise from "../sections/Expertise";
import Hero from "../sections/Hero";
import Next from "../sections/Next";
import Numbers from "../sections/Numbers";
import Work from "../sections/Work";

export default function Home() {
  const rootRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useReveal(rootRef);

  useEffect(() => {
    document.title = "Muhammad Ali — Software Engineer";
  }, []);

  // Arriving from another page with a section target (e.g. nav on a case study).
  useEffect(() => {
    const target = location.state?.scrollTo || location.hash.replace("#", "");
    if (!target) return undefined;
    const timer = window.setTimeout(() => {
      scrollToId(target, { immediate: target !== "contact" && target !== "work" });
      navigate(location.pathname, { replace: true, state: null });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div ref={rootRef}>
      <Hero />
      <Work />
      <Numbers />
      <Capabilities />
      <Automation />
      <Experience />
      <About />
      <Expertise />
      <Next />
      <CtaBand />
      <Contact />
    </div>
  );
}
