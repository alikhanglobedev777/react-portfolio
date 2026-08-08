import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { ScrollTrigger } from "../animation/gsap";
import { scrollToTarget } from "../animation/scrollController";
import EntryExperience from "../components/EntryExperience";
import Archive from "../components/Archive";
import Journey from "../components/Journey";
import MotionDirector from "../components/foundation/MotionDirector";
import ResumeDownload from "../components/ResumeDownload";
import Contact from "./Contact";
import Projects from "./Projects";

export default function Home() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    const returnY = location.state?.projectReturnY;
    if (Number.isFinite(returnY)) return;
    scrollToTarget(0, { immediate: true });
    window.history.replaceState(window.history.state, "", "/");
  }, [location.state]);

  useEffect(() => {
    const returnY = location.state?.projectReturnY;
    if (location.pathname === "/" && navigationType === "POP" && Number.isFinite(returnY)) {
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        scrollToTarget(returnY, { immediate: true });
      }, 80);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [location, navigationType]);

  return (
    <>
      <EntryExperience />
      <Projects />
      <Archive />
      <Journey />
      <ResumeDownload />
      <section id="contact"><Contact /></section>
      <MotionDirector />
    </>
  );
}
