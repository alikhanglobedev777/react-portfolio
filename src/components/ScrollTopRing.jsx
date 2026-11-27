import { useEffect, useRef, useState } from "react";
import { scrollToId } from "../lib/motion";

const R = 22;
const C = 2 * Math.PI * R;

/** Floating back-to-top button whose ring fills with scroll progress. */
export default function ScrollTopRing() {
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(C * (1 - progress));
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className={`top-ring${visible ? " is-visible" : ""}`}
      onClick={() => scrollToId("top")}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <circle className="top-ring__track" cx="26" cy="26" r={R} />
        <circle ref={ringRef} className="top-ring__bar" cx="26" cy="26" r={R} strokeDasharray={C} strokeDashoffset={C} />
      </svg>
      <span aria-hidden="true">↑</span>
    </button>
  );
}
