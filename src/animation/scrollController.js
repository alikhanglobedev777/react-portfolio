import { ScrollTrigger } from "./gsap";

let activeLenis = null;
let navigationSequence = 0;

export function registerSmoothScroller(lenis) {
  activeLenis = lenis;

  return () => {
    if (activeLenis === lenis) activeLenis = null;
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clampScrollTop(value) {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(Math.max(0, value), max);
}

function resolveTargetTop(target, offset = 0) {
  if (typeof target === "number") return clampScrollTop(target + offset);
  if (target instanceof Element) {
    return clampScrollTop(window.scrollY + target.getBoundingClientRect().top + offset);
  }
  return null;
}

export function scrollToTarget(target, options = {}) {
  if (target == null || typeof window === "undefined") return false;

  const {
    offset = 0,
    immediate = false,
    duration = 1.05,
    refresh = false,
  } = options;
  const reducedMotion = prefersReducedMotion();

  // Pinned ScrollTriggers add spacer geometry to the document. Refresh before
  // measuring anchor positions so upward navigation uses the current layout,
  // not stale coordinates from before a pin/resize/route transition.
  if (refresh) ScrollTrigger.refresh();

  const top = resolveTargetTop(target, offset);
  if (!Number.isFinite(top)) return false;

  if (activeLenis && !reducedMotion) {
    const sequence = ++navigationSequence;

    // Cancel any wheel/trackpad inertia that was still lerping when the menu
    // opened. Without resetting that target, an old downward scroll can fight
    // an upward INDEX / WORK / ABOUT navigation.
    activeLenis.stop();
    activeLenis.start();
    activeLenis.resize?.();

    activeLenis.scrollTo(top, {
      duration,
      immediate,
      force: true,
      lock: true,
      onComplete: () => {
        if (sequence !== navigationSequence) return;
        ScrollTrigger.update();
      },
    });

    // Defensive Chrome/Lenis fallback: if a programmatic smooth scroll was
    // interrupted by a pin refresh or stale momentum, force the exact target
    // once the intended animation should have completed.
    const fallbackDelay = Math.max(650, (duration + 0.35) * 1000);
    window.setTimeout(() => {
      if (sequence !== navigationSequence) return;
      if (Math.abs(window.scrollY - top) <= 24) return;

      activeLenis.resize?.();
      activeLenis.scrollTo(top, {
        immediate: true,
        force: true,
        lock: false,
        onComplete: () => ScrollTrigger.update(),
      });
    }, fallbackDelay);

    return true;
  }

  navigationSequence += 1;

  window.scrollTo({
    top,
    left: 0,
    behavior: immediate || reducedMotion ? "auto" : "smooth",
  });
  return true;
}

export function scrollToSection(sectionId, options = {}) {
  if (sectionId === "home") {
    return scrollToTarget(0, options);
  }

  const target = document.getElementById(sectionId);
  if (!target) return false;
  return scrollToTarget(target, options);
}
