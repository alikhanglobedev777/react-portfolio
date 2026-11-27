import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "../lib/motion";

const Star = () => (
  <svg className="marquee__star" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
  </svg>
);

/**
 * Infinite marquee that reacts to scrolling: it speeds up with scroll
 * velocity, skews slightly, and follows the scroll direction.
 */
export default function Marquee({ items, reverse = false, className = "", speed = 40 }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || prefersReducedMotion()) return undefined;

    let x = 0;
    let direction = reverse ? 1 : -1;
    let boost = 0;
    let visible = true;
    const skewTo = gsap.quickTo(track, "skewX", { duration: 0.6, ease: "power3.out" });

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        visible = self.isActive;
      },
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        boost = Math.min(Math.abs(velocity) / 220, 9);
        direction = (velocity > 0 ? -1 : 1) * (reverse ? -1 : 1);
        skewTo(gsap.utils.clamp(-8, 8, velocity / -320));
      },
    });

    const tick = (_time, delta) => {
      if (!visible) return;
      const half = track.scrollWidth / 2;
      if (!half) return;
      const pxPerMs = half / (speed * 1000);
      x += direction * pxPerMs * delta * (1 + boost);
      boost *= 0.92;
      if (boost < 0.05) {
        boost = 0;
        skewTo(0);
      }
      x = gsap.utils.wrap(-half, 0, x);
      gsap.set(track, { x });
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
    };
  }, [reverse, speed]);

  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>
          <span className={index % 2 ? "marquee__ghost" : ""}>{item}</span>
          <Star />
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={rootRef} className={`marquee ${className}`}>
      <div ref={trackRef} className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
