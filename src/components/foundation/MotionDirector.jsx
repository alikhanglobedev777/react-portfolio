import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../../animation/gsap";

/**
 * Owns choreography that crosses component boundaries. Section-local motion
 * stays with each section; hand-offs and shared magnetic behavior live here.
 */
export default function MotionDirector() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let refreshFrame;
    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 769px)", () => {
        const archive = document.querySelector(".archive");
        const stack = document.querySelector(".journey-stack");
        const grid = document.querySelector(".effect-grid");
        const timelines = [];

        if (archive && stack) {
          const labWords = archive.querySelectorAll(".github-lab__title span");
          const stackCharacters = stack.querySelectorAll(".stack-header__character");
          const stackDetails = stack.querySelectorAll(".stack-header__index, .stack-header > p:last-child");
          const marquees = stack.querySelectorAll(".stack-marquee");

          const archiveToStack = gsap.timeline({
            scrollTrigger: {
              trigger: stack,
              start: "top 96%",
              end: "top 24%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
            .to(labWords, {
              xPercent: (index) => (index % 2 ? 7 : -7),
              yPercent: -8,
              opacity: 0.2,
              stagger: 0.04,
              ease: "none",
            }, 0)
            .fromTo(stackCharacters, {
              yPercent: 115,
              opacity: 0,
              filter: "blur(12px)",
            }, {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              stagger: 0.045,
              ease: "none",
            }, 0.16)
            .fromTo(stackDetails, { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, ease: "none" }, 0.3)
            .fromTo(marquees, {
              clipPath: "inset(0 0 100% 0)",
              y: 34,
            }, {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              stagger: 0.035,
              ease: "none",
            }, 0.38);

          if (grid) archiveToStack.to(grid, { opacity: 0.22, ease: "none" }, 0);
          timelines.push(archiveToStack);
        }

        const magneticElements = gsap.utils.toArray("[data-magnetic]");
        const removeMagneticListeners = magneticElements.map((element) => {
          const strength = Number(element.dataset.magneticStrength || 0.16);
          const arrow = element.querySelector("[data-magnetic-arrow]");

          const onMove = (event) => {
            const bounds = element.getBoundingClientRect();
            const x = (event.clientX - bounds.left - bounds.width / 2) * strength;
            const y = (event.clientY - bounds.top - bounds.height / 2) * strength;
            gsap.to(element, { x, y, duration: 0.38, ease: "power3.out", overwrite: true });
            if (arrow) gsap.to(arrow, { x: x * 0.65, y: y * 0.65, duration: 0.38, ease: "power3.out", overwrite: true });
          };
          const onLeave = () => {
            gsap.to(element, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: true });
            if (arrow) gsap.to(arrow, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: true });
          };

          element.addEventListener("pointermove", onMove, { passive: true });
          element.addEventListener("pointerleave", onLeave);
          return () => {
            element.removeEventListener("pointermove", onMove);
            element.removeEventListener("pointerleave", onLeave);
          };
        });

        return () => {
          timelines.forEach((timeline) => timeline.kill());
          removeMagneticListeners.forEach((remove) => remove());
        };
      });

      media.add("(max-width: 768px)", () => {
        const targets = [
          document.querySelector(".archive-header__title"),
          document.querySelector(".stack-header__word"),
        ].filter(Boolean);
        const reveals = targets.map((target) => gsap.from(target, {
          y: 44,
          opacity: 0,
          filter: "blur(7px)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: target, start: "top 88%", once: true },
        }));
        return () => reveals.forEach((reveal) => reveal.kill());
      });

      return () => media.revert();
    });

    refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, []);

  return null;
}
