import { useLayoutEffect, useRef } from "react";
import portrait from "../assets/portrait-cutout.webp";
import Magnetic from "../components/Magnetic";
import Marquee from "../components/Marquee";
import RoleFlip from "../components/RoleFlip";
import SplitWords from "../components/SplitWords";
import { hero, marqueeSkills, profile } from "../data/content";
import { onIntroDone } from "../lib/intro";
import { gsap, isFinePointer, prefersReducedMotion, scrollToId } from "../lib/motion";

export default function Hero() {
  const rootRef = useRef(null);
  const visualRef = useRef(null);

  // Entrance timeline — waits for the intro loader.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.set("[data-hero]", { opacity: 0, y: 24 });
      gsap.set(".hero__hi .split__i", { yPercent: 115 });
      gsap.set(".hero__flip", { opacity: 0, rotationX: -70, y: -30, transformOrigin: "50% 0%" });
      gsap.set(".hero__portrait", { opacity: 0, y: 80 });
      gsap.set(".hero__halo", { scale: 0.6, opacity: 0 });
      gsap.set(".hero__tag", { opacity: 0, scale: 0.6 });
      gsap.set(".hero__pendant", { scaleY: 0 });
    }, root);

    const unsubscribe = onIntroDone(() => {
      ctx.add(() => {
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .to(".hero__hi .split__i", { yPercent: 0, duration: 1.2, stagger: 0.07 }, 0)
          .to("[data-hero]", { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.2)
          .to(".hero__flip", { opacity: 1, rotationX: 0, y: 0, duration: 1.3, ease: "elastic.out(1, 0.75)" }, 0.45)
          .to(".hero__halo", { scale: 1, opacity: 1, duration: 1.6 }, 0.1)
          .to(".hero__portrait", { opacity: 1, y: 0, duration: 1.4 }, 0.2)
          .to(".hero__tag", { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.8)" }, 1)
          .to(".hero__pendant", { scaleY: 1, duration: 1.4, ease: "elastic.out(1, 0.5)" }, 0.6);

        // Scroll-out: portrait sinks slightly, copy lifts.
        gsap.to(".hero__portrait", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero__copy", {
          yPercent: -10,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      });
    });

    return () => {
      unsubscribe();
      ctx.revert();
    };
  }, []);

  // Portrait leans gently toward the pointer.
  useLayoutEffect(() => {
    const visual = visualRef.current;
    if (!visual || !isFinePointer() || prefersReducedMotion()) return undefined;
    const img = visual.querySelector(".hero__portrait");
    const halo = visual.querySelector(".hero__halo");
    const xTo = gsap.quickTo(img, "x", { duration: 1, ease: "power3.out" });
    const hxTo = gsap.quickTo(halo, "x", { duration: 1.2, ease: "power3.out" });
    const hyTo = gsap.quickTo(halo, "y", { duration: 1.2, ease: "power3.out" });
    const root = rootRef.current;
    const move = (event) => {
      root.style.setProperty("--sx", `${event.clientX}px`);
      root.style.setProperty("--sy", `${event.clientY + window.scrollY}px`);
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      xTo(nx * 14);
      hxTo(nx * -30);
      hyTo(ny * -20);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const go = (id) => (event) => {
    event.preventDefault();
    scrollToId(id);
  };

  return (
    <>
      <section ref={rootRef} className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero__bg" aria-hidden="true">
          <span className="blob blob--a" />
          <span className="blob blob--b" />
          <span className="hero__grid" />
          <span className="hero__spot" />
        </div>

        <span className="hero__pendant" aria-hidden="true"><span /></span>

        <div className="container hero__layout">
          <div className="hero__copy">
            <p className="hero__eyebrow" data-hero>
              <span className="pulse" aria-hidden="true" />
              {hero.eyebrow}
            </p>

            <h1 id="hero-title" className="hero__title">
              <SplitWords className="hero__hi" text={hero.greeting} reveal="none" />
              <span className="hero__iam" data-hero>{hero.intro}</span>
              <span className="sr-only"> software engineer — {hero.roles.join(", ")}.</span>
            </h1>

            <RoleFlip roles={hero.roles} className="hero__flip" />

            <p className="hero__lead" data-hero>{hero.description}</p>

            <div className="hero__ctas" data-hero>
              <Magnetic strength={0.25}>
                <a href="#contact" className="pill-cta" onClick={go("contact")}>
                  <span>Start a project</span>
                  <span className="pill-cta__icon" aria-hidden="true">→</span>
                </a>
              </Magnetic>
              <a href="#work" className="hero__link" onClick={go("work")}>
                See my work
              </a>
            </div>
          </div>

          <div className="hero__visual" ref={visualRef}>
            <span className="hero__halo" aria-hidden="true" />
            <img
              className="hero__portrait"
              src={portrait}
              alt="Portrait of Muhammad Ali in a navy suit"
              width="1000"
              height="911"
              fetchPriority="high"
              decoding="async"
            />
            <span className="hero__tag">
              <span className="pulse pulse--ok" aria-hidden="true" />
              {hero.tag}
            </span>
          </div>
        </div>

        <div className="container hero__bottom" data-hero>
          <span><span className="pulse pulse--ok" aria-hidden="true" /> Available for work</span>
          <span className="hero__bottom-mid">Based in {profile.location}</span>
          <a href="#work" onClick={go("work")} className="hero__scroll">
            Scroll to explore <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <Marquee items={marqueeSkills} className="hero__marquee" speed={45} />
    </>
  );
}
