import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "../lib/motion";

/**
 * Two-part custom cursor (desktop only). Elements with data-cursor="Label"
 * expand the ring and show the label.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion());
  const [label, setLabel] = useState("");
  const [state, setState] = useState("hidden");
  const seenPointer = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add("has-cursor");

    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3.out" });

    const move = (event) => {
      if (!seenPointer.current) {
        seenPointer.current = true;
        gsap.set([dotRef.current, ringRef.current], { x: event.clientX, y: event.clientY });
        setState("");
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const over = (event) => {
      const target = event.target.closest?.("[data-cursor], a, button, input, textarea, label");
      if (!target) {
        setState("");
        setLabel("");
        return;
      }
      const text = target.getAttribute("data-cursor");
      if (text) {
        setState("label");
        setLabel(text);
      } else if (target.matches("input, textarea")) {
        setState("text");
        setLabel("");
      } else {
        setState("link");
        setLabel("");
      }
    };

    const leaveWindow = () => setState("hidden");
    const enterWindow = () => setState("");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leaveWindow);
    document.documentElement.addEventListener("pointerenter", enterWindow);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leaveWindow);
      document.documentElement.removeEventListener("pointerenter", enterWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`cursor cursor--${state || "default"}`} aria-hidden="true">
      <div ref={ringRef} className="cursor__ring">
        <span className="cursor__label">{label}</span>
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}
