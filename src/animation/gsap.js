import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function createRevealTimeline(targets, options = {}) {
  const {
    duration = 1,
    stagger = 0.08,
    offset = 72,
    ease = "power3.out",
  } = options;

  return gsap.timeline().from(targets, {
    yPercent: offset,
    opacity: 0,
    duration,
    stagger,
    ease,
  });
}

export function createScrollReveal(target, trigger = target, options = {}) {
  return gsap.from(target, {
    y: options.y ?? 48,
    opacity: 0,
    duration: options.duration ?? 1,
    ease: options.ease ?? "power3.out",
    scrollTrigger: {
      trigger,
      start: options.start ?? "top 88%",
      once: options.once ?? true,
    },
  });
}
