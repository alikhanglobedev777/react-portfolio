import { useLayoutEffect } from "react";
import { gsap, isFinePointer, prefersReducedMotion, ScrollTrigger } from "./motion";

const START = "top 88%";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_-+*";

/** Decodes text from random glyphs into the real label. */
export function scramble(el, duration = 0.9) {
  const final = el.dataset.text || el.textContent;
  el.dataset.text = final;
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      const reveal = Math.floor(state.p * final.length);
      let out = final.slice(0, reveal);
      for (let i = reveal; i < final.length; i += 1) {
        out += final[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = final;
    },
  });
}

/** Pointer-driven 3D tilt with lift for [data-tilt] cards. */
function attachTilt(el) {
  const strength = Number(el.dataset.tilt) || 8;
  gsap.set(el, { transformPerspective: 900 });
  const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
  const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
  const ty = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
  const move = (event) => {
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    ry(px * strength);
    rx(-py * strength);
    ty(-6);
    el.style.setProperty("--x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };
  const leave = () => {
    rx(0);
    ry(0);
    ty(0);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
  };
}

/**
 * Scroll-triggered entrance animations for every [data-reveal] element
 * inside `scopeRef`. Types: words | up | fade | clip | scale | stagger | pop | rule.
 * Also handles [data-scramble], [data-parallax] and [data-tilt].
 */
export function useReveal(scopeRef, deps = []) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    if (prefersReducedMotion()) {
      scope.querySelectorAll('[data-reveal="words"]').forEach((el) => el.classList.add("is-drawn"));
      return undefined;
    }

    const cleanups = [];

    const ctx = gsap.context(() => {
      scope.querySelectorAll("[data-reveal]").forEach((el) => {
        const type = el.dataset.reveal;
        if (type === "none") return;
        const delay = Number(el.dataset.delay || 0);
        const trigger = { trigger: el, start: START, once: true };

        switch (type) {
          case "words":
            gsap.from(el.querySelectorAll(".split__i"), {
              yPercent: 115,
              rotate: 4,
              duration: 1,
              ease: "expo.out",
              stagger: 0.035,
              delay,
              scrollTrigger: trigger,
              onComplete: () => el.classList.add("is-drawn"),
            });
            break;
          case "clip":
            gsap.from(el, {
              clipPath: "inset(100% 0% 0% 0%)",
              y: 40,
              duration: 1.2,
              ease: "expo.out",
              delay,
              scrollTrigger: trigger,
            });
            break;
          case "scale":
            gsap.from(el, { scale: 0.9, opacity: 0, duration: 1, ease: "expo.out", delay, scrollTrigger: trigger });
            break;
          case "fade":
            gsap.from(el, { opacity: 0, duration: 1, ease: "power2.out", delay, scrollTrigger: trigger });
            break;
          case "rule":
            gsap.from(el, {
              scaleX: 0,
              transformOrigin: "0% 50%",
              duration: 1.4,
              ease: "expo.inOut",
              delay,
              scrollTrigger: trigger,
            });
            break;
          case "pop":
            gsap.from(el.querySelectorAll(":scope > *"), {
              scale: 0.6,
              opacity: 0,
              duration: 0.7,
              ease: "back.out(2)",
              stagger: 0.035,
              delay,
              scrollTrigger: trigger,
            });
            break;
          case "stagger": {
            const children = el.querySelectorAll(":scope > *");
            gsap.from(children, {
              y: 36,
              opacity: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.08,
              delay,
              scrollTrigger: trigger,
            });
            break;
          }
          case "up":
          default:
            gsap.from(el, { y: 44, opacity: 0, duration: 1, ease: "expo.out", delay, scrollTrigger: trigger });
        }
      });

      // Mono labels decode from random glyphs as they enter.
      scope.querySelectorAll("[data-scramble]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => scramble(el),
        });
      });

      // Light parallax on decorated elements.
      scope.querySelectorAll("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax) || 10;
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      if (isFinePointer()) {
        scope.querySelectorAll("[data-tilt]").forEach((el) => cleanups.push(attachTilt(el)));
      }
    }, scope);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(refresh);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
