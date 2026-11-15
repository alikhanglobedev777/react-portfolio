import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let lenis = null;

export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};

  lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id, { immediate = false } = {}) {
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  const offset = id === "top" ? 0 : -72;
  if (lenis) {
    // Re-measure first: after a route change the page height has changed and
    // Lenis would otherwise clamp the scroll to the previous page's limit.
    lenis.resize();
    // force: navigation scrolls must run even if scrolling was just locked.
    lenis.scrollTo(target, { offset, immediate, duration: 1.4, force: true });
    return;
  }
  const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
}

export function stopScroll(stopped) {
  if (!lenis) return;
  if (stopped) lenis.stop();
  else lenis.start();
}
