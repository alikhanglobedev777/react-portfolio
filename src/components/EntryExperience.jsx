import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "../animation/gsap";
import { createMobileReveal } from "../animation/mobileReveal";
import { useGSAPContext } from "../hooks/useGSAPContext";
import BrandMark from "./BrandMark";
import Manifesto from "./Manifesto";
import "../styles/EntryExperience.css";

const technologies = ["REACT", "TYPESCRIPT", "NODE", "POSTGRESQL", "FASTIFY", "TRPC"];
const HeroSculpture = lazy(() => import("./HeroSculpture"));

export default function EntryExperience() {
  const rootRef = useRef(null);
  const [enableWebGL, setEnableWebGL] = useState(false);

  useEffect(() => {
    // Use the same Three.js hero sculpture on desktop and mobile. The
    // sculpture itself adapts its geometry/DPR on small screens, so mobile no
    // longer falls back to a visually different CSS-only set of rings.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => {
      const saveData = navigator.connection?.saveData === true;
      setEnableWebGL(motionQuery.matches && !saveData);
    };

    update();
    motionQuery.addEventListener("change", update);
    return () => motionQuery.removeEventListener("change", update);
  }, []);

  const runEntry = useCallback(() => {
    const root = rootRef.current;
    const loader = root?.querySelector(".entry-loader");
    const nav = document.querySelector(".navbar");
    if (!root || !loader) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = window.sessionStorage.getItem("ma-entry-played") === "true";
    const hero = root.querySelector(".entry-hero");
    const heroLines = root.querySelectorAll(".entry-hero__line > span");
    const heroDetails = root.querySelectorAll(".entry-hero__meta, .entry-hero__secondary, .entry-hero__status, .entry-hero__scroll");
    const statementLines = root.querySelectorAll(".entry-hero__statement span > i");
    const sculpture = root.querySelector(".entry-hero__visual");
    const manifesto = root.querySelector(".manifesto");
    const manifestoStage = root.querySelector(".manifesto__stage");
    const manifestoLead = root.querySelectorAll(".manifesto__lead-line > i");
    const manifestoSystem = root.querySelectorAll(".manifesto__system-line > i");
    const manifestoSupport = root.querySelector(".manifesto__support");
    const manifestoDisciplines = root.querySelector(".manifesto__disciplines");
    const manifestoIndex = root.querySelector(".manifesto__index");
    const globalGrid = document.querySelector(".effect-grid");
    const nextSection = document.querySelector("#projects");
    const selectedHeader = nextSection?.querySelector(".systems-header");
    const selectedTitle = nextSection?.querySelectorAll(".systems-header__title span");
    const selectedDetails = nextSection?.querySelectorAll(".systems-header__index, .systems-header__copy");

    const createScrollMotion = () => {
      if (reducedMotion || !hero || !manifesto) return undefined;

      const media = gsap.matchMedia();

      media.add("(min-width: 769px)", () => {
        gsap.set(manifestoLead, { yPercent: 105, opacity: 0, filter: "blur(10px)", color: "#8d8d87" });
        gsap.set(manifestoSystem, { yPercent: 115, opacity: 0, filter: "blur(12px)", color: "#8d8d87" });
        gsap.set([manifestoSupport, manifestoDisciplines, manifestoIndex], { opacity: 0, y: 18 });

        const heroExit = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        })
          .to(".entry-hero__line--muhammad > span", { xPercent: -8, ease: "none" }, 0)
          .to(".entry-hero__line--ali > span", { xPercent: 10, ease: "none" }, 0)
          .to(".entry-hero__title", { scale: 0.96, transformOrigin: "center center", ease: "none" }, 0)
          .to(sculpture, { yPercent: 17, scale: 0.74, rotate: 5, opacity: 0.35, ease: "none" }, 0)
          .to(heroDetails, { y: -38, opacity: 0, ease: "none" }, 0)
          .to(".entry-hero__statement", { yPercent: -28, opacity: 0.3, ease: "none" }, 0)
          .fromTo(manifesto, { backgroundColor: "#050505" }, { backgroundColor: "#0b0b0b", ease: "none" }, 0)
          .to(globalGrid, { scaleX: 1.025, skewX: -0.7, transformOrigin: "center", ease: "none" }, 0)
          .to(manifestoLead, { yPercent: 0, opacity: 0.32, filter: "blur(0px)", stagger: 0.055, ease: "power2.out" }, 0.56);

        const manifestoTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: manifesto,
            start: "top top",
            end: "+=90%",
            scrub: 0.6,
            pin: manifestoStage,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
          .to(manifestoIndex, { opacity: 1, y: 0, duration: 0.12 }, 0)
          .to(manifestoLead, { color: "#efefe8", opacity: 1, stagger: 0.07, duration: 0.28 }, 0)
          .to(manifestoLead, { yPercent: -28, opacity: 0, filter: "blur(8px)", stagger: 0.035, duration: 0.24 }, 0.27)
          .to(manifestoSystem, { yPercent: 0, opacity: 0.3, filter: "blur(0px)", stagger: 0.09, duration: 0.32 }, 0.33)
          .to(manifestoSystem, { color: "#efefe8", opacity: 1, stagger: 0.1, duration: 0.34 }, 0.52)
          .to([manifestoSupport, manifestoDisciplines], { opacity: 1, y: 0, stagger: 0.07, duration: 0.2 }, 0.72)
          .to(globalGrid, { scaleX: 1, skewX: 0, ease: "none", duration: 0.25 }, 0.72);

        let selectedEntrance;
        if (nextSection) {
          selectedEntrance = gsap.timeline({
            scrollTrigger: {
              trigger: nextSection,
              start: "top 98%",
              end: "top 42%",
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          })
            .to(manifestoSystem, { yPercent: -14, opacity: 0.14, filter: "blur(7px)", stagger: 0.035, ease: "none" }, 0)
            .to([manifestoSupport, manifestoDisciplines], { y: -24, opacity: 0, ease: "none" }, 0)
            // Never transform the whole #projects section. A transformed ancestor
            // breaks ScrollTrigger's fixed pinning geometry and can leave a long
            // empty/black scroll region while .systems-pin is active. Animate the
            // header instead and keep the section itself transform-free.
            .fromTo(nextSection, { backgroundColor: "#0b0b0b" }, { backgroundColor: "#050505", ease: "none" }, 0)
            .fromTo(selectedHeader, { y: 88 }, { y: 0, ease: "none" }, 0)
            .fromTo(selectedTitle, {
              yPercent: (index) => (index ? -108 : 108),
              clipPath: "inset(0 0 100% 0)",
              filter: "blur(11px)",
            }, {
              yPercent: 0,
              clipPath: "inset(0 0 0% 0)",
              filter: "blur(0px)",
              stagger: 0.09,
              ease: "none",
            }, 0.18)
            .fromTo(selectedDetails, { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, ease: "none" }, 0.32);
        }

        return () => {
          heroExit.kill();
          manifestoTimeline.kill();
          selectedEntrance?.kill();
        };
      });

      media.add("(max-width: 768px)", () => {
        const heroExit = gsap.timeline({
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.45 },
        })
          .to(".entry-hero__line--muhammad > span", { xPercent: -3, ease: "none" }, 0)
          .to(".entry-hero__line--ali > span", { xPercent: 4, ease: "none" }, 0)
          .to(sculpture, { scale: 0.88, opacity: 0.48, ease: "none" }, 0)
          .to(heroDetails, { opacity: 0, y: -18, ease: "none" }, 0)
          .fromTo(manifesto, { backgroundColor: "#050505" }, { backgroundColor: "#0b0b0b", ease: "none" }, 0);

        const reveals = [...manifestoLead, ...manifestoSystem].map((line) => createMobileReveal({
          trigger: line,
          targets: line,
          start: "top 90%",
          from: { yPercent: 62, y: 0, opacity: 0, filter: "blur(7px)" },
          to: { yPercent: 0, y: 0, opacity: 1, filter: "blur(0px)" },
          duration: 0.78,
          stagger: 0,
        }));

        reveals.push(createMobileReveal({
          trigger: manifestoSupport,
          targets: [manifestoSupport, manifestoDisciplines, manifestoIndex],
          start: "top 92%",
          from: { y: 24, opacity: 0, filter: "blur(5px)" },
          duration: 0.72,
          stagger: 0.07,
        }));

        return () => {
          heroExit.kill();
          reveals.forEach((reveal) => reveal.kill());
        };
      });

      return () => media.revert();
    };

    if (reducedMotion || alreadyPlayed) {
      gsap.set(loader, { display: "none" });
      gsap.set([...heroLines, ...heroDetails, ...statementLines, sculpture], { clearProps: "all" });
      if (nav) gsap.set(nav, { opacity: 1, y: 0 });
      return createScrollMotion();
    }

    const techItems = root.querySelectorAll(".entry-loader__tech span");

    gsap.set(document.body, { overflow: "hidden" });
    gsap.set(nav, { opacity: 0, y: -16 });
    gsap.set(heroLines, { yPercent: 118, filter: "blur(14px)", scale: 0.98 });
    gsap.set(heroDetails, { opacity: 0, y: 16 });
    gsap.set(statementLines, { opacity: 0, yPercent: 110 });
    gsap.set(sculpture, { opacity: 0, scale: 0.72, filter: "blur(22px)", rotate: -8 });
    gsap.set(techItems, { autoAlpha: 0, y: 8, filter: "blur(5px)" });

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        window.sessionStorage.setItem("ma-entry-played", "true");
        document.body.style.overflow = "";
        loader.style.display = "none";
      },
    });

    timeline
      .from(".entry-loader__mark", { yPercent: 100, filter: "blur(10px)", duration: 0.25 }, 0)
      .from(".entry-loader__system span", { yPercent: 110, duration: 0.28, stagger: 0.04 }, 0.04)
      .fromTo(".entry-loader__progress-fill", { scaleX: 0 }, { scaleX: 1, duration: 0.88, ease: "power2.inOut" }, 0.04);

    techItems.forEach((item, index) => {
      const position = 0.13 + index * 0.105;
      timeline
        .to(item, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.08 }, position)
        .to(item, { autoAlpha: 0, y: -8, filter: "blur(5px)", duration: 0.08 }, position + 0.08);
    });

    timeline
      .to(".entry-loader__content", { opacity: 0.25, scale: 0.975, filter: "blur(7px)", duration: 0.28 }, 0.78)
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 0.52, ease: "expo.inOut" }, 0.82)
      .to(heroLines, { yPercent: 0, filter: "blur(0px)", scale: 1, duration: 0.62, stagger: 0.07, ease: "expo.out" }, 0.84)
      .to(sculpture, { opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0, duration: 0.68, ease: "expo.out" }, 0.88)
      .to(statementLines, { opacity: 1, yPercent: 0, duration: 0.42, stagger: 0.055, ease: "power3.out" }, 1)
      .to(heroDetails, { opacity: 1, y: 0, duration: 0.38, stagger: 0.045 }, 1.02)
      .to(nav, { opacity: 1, y: 0, duration: 0.35 }, 1.03);

    return createScrollMotion();
  }, []);

  useGSAPContext(rootRef, runEntry);

  return (
    <div className="entry-experience" ref={rootRef}>
      <div className="entry-loader" role="status" aria-label="Initializing Muhammad Ali portfolio">
        <div className="entry-loader__content">
          <div className="entry-loader__top">
            <div className="clip"><span className="entry-loader__mark"><BrandMark compact /></span></div>
            <span>LAHORE / PAKISTAN</span>
          </div>

          <div className="entry-loader__center">
            <p className="entry-loader__system" aria-hidden="true">
              <span>INITIALIZING</span>
              <span>DIGITAL SYSTEMS</span>
            </p>
            <div className="entry-loader__tech" aria-hidden="true">
              {technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
          </div>

          <div className="entry-loader__bottom">
            <div className="entry-loader__progress"><span className="entry-loader__progress-fill" /></div>
            <div><span>SYSTEM LOAD</span><span>100</span></div>
          </div>
        </div>
      </div>

      <section className="entry-hero" id="home" aria-labelledby="entry-title">
        <div className="entry-hero__depth" aria-hidden="true" />
        <div className="entry-hero__meta technical">
          <span>2026</span>
          <span>LAHORE / PK</span>
        </div>

        <h1 className="entry-hero__title" id="entry-title" aria-label="Muhammad Ali">
          <span className="entry-hero__line entry-hero__line--muhammad"><span>MUHAMMAD</span></span>
          <span className="entry-hero__line entry-hero__line--ali"><span>ALI</span></span>
        </h1>

        <div className="entry-hero__visual">
          {enableWebGL ? (
            <Suspense fallback={<div className="hero-sculpture__loading" aria-hidden="true" />}>
              <HeroSculpture />
            </Suspense>
          ) : (
            <div className="hero-sculpture__fallback" role="img" aria-label="Abstract chrome architectural sculpture">
              <span /><span /><span />
            </div>
          )}
        </div>

        <p className="entry-hero__secondary" aria-label="Full-stack engineer and creative developer">
          <span>FULL-STACK ENGINEER</span>
          <span>CREATIVE DEVELOPER</span>
        </p>

        <p className="entry-hero__statement" aria-label="I design. I engineer. I ship.">
          <span><i>I DESIGN.</i></span>
          <span><i>I ENGINEER.</i></span>
          <span><i>I SHIP.</i></span>
        </p>

        <p className="entry-hero__status technical">
          <i aria-hidden="true" /> AVAILABLE FOR OPPORTUNITIES
        </p>

        <div className="entry-hero__scroll technical">
          <span>SCROLL TO EXPLORE</span>
          <span aria-hidden="true">&darr;</span>
        </div>
      </section>
      <Manifesto />
    </div>
  );
}
