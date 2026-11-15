import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, stopScroll } from "../lib/motion";
import { markIntroDone, rememberIntro, shouldPlayIntro } from "../lib/intro";

const WORDS = ["Design", "Build", "Ship"];

/** Short (~1.6s) intro curtain, shown once per browser session. */
export default function Loader() {
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const [visible] = useState(() => shouldPlayIntro() && !prefersReducedMotion());

  useEffect(() => {
    if (!visible) {
      markIntroDone();
      return undefined;
    }

    const root = rootRef.current;
    stopScroll(true);
    document.documentElement.classList.add("is-loading");
    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        root.style.display = "none";
        document.documentElement.classList.remove("is-loading");
        stopScroll(false);
        rememberIntro();
      },
    });

    tl.from(".loader__word", { yPercent: 110, duration: 0.55, stagger: 0.32, ease: "power3.out" }, 0)
      .to(".loader__mask:not(:last-child) .loader__word", { opacity: 0.25, duration: 0.3, stagger: 0.32 }, 0.35)
      .to(counter, {
        value: 100,
        duration: 1.25,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
        },
      }, 0)
      .to(".loader__bar span", { scaleX: 1, duration: 1.25, ease: "power2.inOut" }, 0)
      .add(() => markIntroDone(), 1.45)
      .to(root, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, 1.4)
      .to(".loader__inner", { yPercent: 40, opacity: 0, duration: 0.6, ease: "power2.in" }, 1.35);

    return () => {
      tl.kill();
      document.documentElement.classList.remove("is-loading");
      stopScroll(false);
      markIntroDone();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div ref={rootRef} className="loader" aria-hidden="true">
      <div className="loader__inner">
        <p className="loader__name">Muhammad Ali — Portfolio ’26</p>
        <div className="loader__words">
          {WORDS.map((word) => (
            <span className="loader__mask" key={word}>
              <span className="loader__word">{word}.</span>
            </span>
          ))}
        </div>
        <div className="loader__foot">
          <div className="loader__bar"><span /></div>
          <span ref={countRef} className="loader__count">000</span>
        </div>
      </div>
    </div>
  );
}
