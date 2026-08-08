import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { ScrollTrigger } from "../animation/gsap";
import EntryExperience from "../components/EntryExperience";
import Archive from "../components/Archive";
import Journey from "../components/Journey";
import MotionDirector from "../components/foundation/MotionDirector";
import Contact from "./Contact";
import Projects from "./Projects";

export default function Home() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const returnY = location.state?.projectReturnY;
    if (location.pathname === "/" && navigationType === "POP" && Number.isFinite(returnY)) {
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        window.scrollTo(0, returnY);
      }, 80);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      const routeSections = { "/resume": "experience", "/about": "about" };
      const sectionId = location.hash
        ? location.hash.slice(1)
        : routeSections[location.pathname] || (location.pathname === "/" ? "home" : location.pathname.replace("/", ""));
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 60);

    return () => window.clearTimeout(timer);
  }, [location, navigationType]);

  return (
    <>
      <EntryExperience />
      <Projects />
      <Archive />
      <Journey />
      <section id="contact"><Contact /></section>
      <MotionDirector />
    </>
  );
}
