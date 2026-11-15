import { useLayoutEffect, useRef } from "react";
import SplitWords from "../components/SplitWords";
import { domains, numbers } from "../data/content";
import { gsap, prefersReducedMotion } from "../lib/motion";

export default function Numbers() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      root.querySelectorAll("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const counter = { value: 0 };
        el.textContent = "0";
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value));
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section numbers" aria-labelledby="numbers-title">
      <div className="container">
        <div className="numbers__panel">
          <div className="numbers__head">
            <p className="eyebrow" data-reveal="up"><span className="eyebrow__no">02</span><span data-scramble>Impact</span></p>
            <SplitWords as="h2" id="numbers-title" className="section-title" text="The work. *The numbers.*" />
            <p className="section-lede" data-reveal="up">
              Early in my career, but already shipping across real business domains. Every figure here is verifiable from my CV and live products.
            </p>
          </div>

          <dl className="numbers__grid" data-reveal="stagger">
            {numbers.map((item) => (
              <div className="stat" key={item.label} data-tilt="10">
                <dt className="stat__label">{item.label}</dt>
                <dd className="stat__value">
                  <span data-count={item.value}>{item.value}</span>
                  {item.suffix && <span className="stat__suffix">{item.suffix}</span>}
                </dd>
                <dd className="stat__note">{item.note}</dd>
              </div>
            ))}
          </dl>

          <div className="numbers__domains" data-reveal="up">
            <span className="numbers__domains-label">Domains</span>
            <ul data-reveal="pop">
              {domains.map((domain) => <li key={domain}>{domain}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
