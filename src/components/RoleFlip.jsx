import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";

const RINGS = 12;
const INTERVAL = 2600;

/**
 * Spiral-bound notepad whose top page flips over to reveal the next role.
 * Text is written through refs so React never re-renders mid-flip.
 */
export default function RoleFlip({ roles, className = "" }) {
  const rootRef = useRef(null);
  const topRef = useRef(null);
  const underRef = useRef(null);
  const topTextRef = useRef(null);
  const underTextRef = useRef(null);
  const topNoRef = useRef(null);
  const underNoRef = useRef(null);
  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const flipRef = useRef(() => {});

  useEffect(() => {
    const pad = (n) => String(n + 1).padStart(2, "0");
    const total = String(roles.length).padStart(2, "0");
    const paint = () => {
      const i = indexRef.current;
      const next = (i + 1) % roles.length;
      topTextRef.current.textContent = roles[i];
      underTextRef.current.textContent = roles[next];
      topNoRef.current.textContent = `${pad(i)} / ${total}`;
      underNoRef.current.textContent = `${pad(next)} / ${total}`;
    };
    paint();

    if (prefersReducedMotion()) return undefined;

    const shade = topRef.current.querySelector(".flip__shade");

    flipRef.current = () => {
      if (busyRef.current) return;
      busyRef.current = true;
      rootRef.current?.classList.add("is-flipping");
      gsap
        .timeline({
          onComplete: () => {
            rootRef.current?.classList.remove("is-flipping");
            indexRef.current = (indexRef.current + 1) % roles.length;
            paint();
            gsap.set(topRef.current, { rotationX: 0, opacity: 1 });
            gsap.set(shade, { opacity: 0 });
            busyRef.current = false;
          },
        })
        .to(topRef.current, { rotationX: 104, duration: 0.75, ease: "power2.in" }, 0)
        .to(shade, { opacity: 0.55, duration: 0.6, ease: "power1.in" }, 0)
        .fromTo(underRef.current, { scale: 0.985 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0.4);
    };

    const timer = window.setInterval(() => {
      if (!document.hidden) flipRef.current();
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [roles]);

  return (
    <div
      ref={rootRef}
      className={`flip ${className}`}
      aria-hidden="true"
      data-cursor="Flip"
      onClick={() => flipRef.current()}
    >
      <div className="flip__rings">
        {Array.from({ length: RINGS }, (_, i) => <span key={i} />)}
      </div>
      <div className="flip__stack">
        {/* Invisible sizer keeps the card as wide as the longest role */}
        <div className="flip__sizer">
          {roles.map((role) => <span key={role}>{role}</span>)}
        </div>
        <div ref={underRef} className="flip__page flip__page--under">
          <span ref={underTextRef} className="flip__text" />
          <small ref={underNoRef} className="flip__no" />
        </div>
        <div ref={topRef} className="flip__page flip__page--top">
          <span ref={topTextRef} className="flip__text" />
          <small ref={topNoRef} className="flip__no" />
          <span className="flip__shade" />
        </div>
      </div>
    </div>
  );
}
