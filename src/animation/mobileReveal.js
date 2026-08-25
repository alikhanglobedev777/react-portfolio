import { gsap, ScrollTrigger } from "./gsap";

/**
 * Creates an entrance animation without pre-hiding content during setup.
 *
 * `gsap.from()` applies its starting opacity/transform immediately. That is
 * usually fine on desktop, but on mobile a browser chrome resize, an anchor
 * jump, or a late ScrollTrigger refresh can leave an entire section stuck in
 * its "from" state. This helper waits until the trigger actually enters the
 * viewport before applying the hidden state and playing the reveal.
 */
export function createMobileReveal({
  trigger,
  targets,
  start = "top 88%",
  from = {},
  to = {},
  duration = 0.72,
  stagger = 0.055,
  ease = "power3.out",
  clearProps = "opacity,visibility,transform,filter,clipPath",
} = {}) {
  const triggerElement = typeof trigger === "string" ? document.querySelector(trigger) : trigger;
  const elements = gsap.utils.toArray(targets).filter(Boolean);

  if (!triggerElement || elements.length === 0) return { kill() {} };

  let played = false;
  let tween = null;

  const play = () => {
    if (played) return;
    played = true;

    tween = gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 28,
        filter: "blur(6px)",
        ...from,
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        stagger,
        ease,
        clearProps,
        ...to,
      },
    );
  };

  const scrollTrigger = ScrollTrigger.create({
    trigger: triggerElement,
    start,
    onEnter: play,
    onEnterBack: play,
  });

  // A restored scroll position or an anchor jump can place the trigger inside
  // the viewport before ScrollTrigger gets its first normal scroll update.
  // Check once after layout so the reveal still runs in that situation.
  const frame = window.requestAnimationFrame(() => {
    if (played || !triggerElement.isConnected) return;
    const rect = triggerElement.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    if (rect.top < viewportHeight * 0.94 && rect.bottom > 0) play();
  });

  return {
    kill() {
      window.cancelAnimationFrame(frame);
      scrollTrigger.kill();
      tween?.kill();
    },
  };
}
