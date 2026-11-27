import { useLayoutEffect, useRef } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "../lib/motion";

const FIRST = "Muhammad";
const LAST = "Ali";
const INK = "#15141a";
const ACCENT = "#5b4bff";
const BASE_WEIGHT = 650;
const MAX_WEIGHT = 900;

/**
 * Footer wordmark.
 * - Letters rise into place when scrolled into view.
 * - Hover: letters near the pointer swell in weight (variable font), lift
 *   and shift toward the accent colour, with a smooth falloff.
 * - Click / tap: a wave runs through the name.
 */
export default function Wordmark() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (prefersReducedMotion()) {
      root.classList.add("is-in");
      return undefined;
    }

    const chars = [...root.querySelectorAll(".footer__w:first-child .footer__char")];
    const last = root.querySelector(".footer__last");
    const dot = root.querySelector(".footer__dot");
    const items = [...chars, last];
    const toColor = gsap.utils.interpolate(INK, ACCENT);

    const ctx = gsap.context(() => {
      gsap.from([...chars, last], {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { trigger: root, start: "top 95%", once: true },
        onComplete: () => root.classList.add("is-in"),
      });
      gsap.from(dot, {
        scale: 0,
        duration: 0.8,
        ease: "back.out(3)",
        delay: 0.45,
        scrollTrigger: { trigger: root, start: "top 95%", once: true },
      });
    }, root);

    // Click / tap wave (works everywhere).
    let wavingUntil = 0;
    const wave = () => {
      if (!root.classList.contains("is-in")) return;
      wavingUntil = performance.now() + 1300;
      gsap.to(items, {
        keyframes: { yPercent: [0, -22, 0] },
        duration: 0.7,
        ease: "power2.inOut",
        stagger: 0.05,
        overwrite: "auto",
      });
      gsap.fromTo(dot, { y: 0 }, { keyframes: { y: [0, -40, 0], scale: [1, 1.4, 1] }, duration: 0.8, delay: 0.45, ease: "power2.out" });
    };
    root.addEventListener("click", wave);

    if (!isFinePointer()) {
      return () => {
        root.removeEventListener("click", wave);
        ctx.revert();
      };
    }

    // Proximity hover effect.
    const state = items.map(() => ({ cur: 0, target: 0 }));
    let centers = [];
    let hovering = false;
    let running = false;

    const measure = () => {
      centers = items.map((el) => {
        const rect = el.getBoundingClientRect();
        return rect.left + rect.width / 2;
      });
    };

    const apply = () => {
      if (performance.now() < wavingUntil) return;
      let settled = true;
      state.forEach((s, i) => {
        s.cur += (s.target - s.cur) * 0.14;
        if (Math.abs(s.target - s.cur) > 0.002) settled = false;
        const el = items[i];
        const inf = s.cur;
        if (el === last) {
          el.style.transform = `translateY(${-inf * 12}%) rotate(${-inf * 7}deg)`;
        } else {
          el.style.transform = `translateY(${-inf * 14}%)`;
          el.style.fontWeight = String(Math.round(BASE_WEIGHT + inf * (MAX_WEIGHT - BASE_WEIGHT)));
        }
        el.style.color = toColor(inf * 0.95);
      });
      const tail = state[state.length - 1].cur;
      dot.style.transform = `scale(${1 + tail * 0.9})`;
      if (settled && !hovering) {
        running = false;
        gsap.ticker.remove(apply);
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      gsap.ticker.add(apply);
    };

    const enter = () => {
      if (!root.classList.contains("is-in")) return;
      hovering = true;
      measure();
      start();
    };
    const move = (event) => {
      if (!hovering) return;
      const radius = parseFloat(getComputedStyle(root).fontSize) * 0.85;
      state.forEach((s, i) => {
        const d = (event.clientX - centers[i]) / radius;
        s.target = Math.exp(-d * d);
      });
    };
    const leave = () => {
      hovering = false;
      state.forEach((s) => {
        s.target = 0;
      });
      start();
    };

    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    window.addEventListener("resize", measure);

    return () => {
      root.removeEventListener("click", wave);
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", measure);
      gsap.ticker.remove(apply);
      items.forEach((el) => {
        el.style.transform = "";
        el.style.fontWeight = "";
        el.style.color = "";
      });
      dot.style.transform = "";
      ctx.revert();
    };
  }, []);

  return (
    <p ref={rootRef} className="footer__word" aria-hidden="true">
      <span className="footer__w">
        {FIRST.split("").map((char, i) => (
          <span className="footer__mask" key={i}>
            <span className="footer__char">{char}</span>
          </span>
        ))}
      </span>
      <span className="footer__w footer__w--serif">
        <span className="footer__mask footer__mask--word">
          <span className="footer__char footer__last">
            {LAST}
            <span className="footer__dot" />
          </span>
        </span>
      </span>
    </p>
  );
}
