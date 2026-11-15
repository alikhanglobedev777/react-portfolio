import { useLayoutEffect, useRef } from "react";
import portrait from "../assets/portrait.jpg";
import SplitWords from "../components/SplitWords";
import { about } from "../data/content";
import { gsap, prefersReducedMotion } from "../lib/motion";

export default function About() {
  const rootRef = useRef(null);

  // Words brighten as the narrative scrolls through the viewport.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about__story .tw",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: { trigger: ".about__story", start: "top 80%", end: "bottom 55%", scrub: 0.5 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__layout">
        <div className="about__aside">
          <p className="eyebrow" data-reveal="up"><span className="eyebrow__no">06</span><span data-scramble>About</span></p>
          <SplitWords as="h2" id="about-title" className="section-title" text="The person behind *the systems.*" />

          <div className="about__photo" data-reveal="clip">
            <img src={portrait} alt="" width="1254" height="1254" loading="lazy" data-parallax="6" />
            <span className="about__photo-tag">Muhammad Ali · Lahore</span>
          </div>
        </div>

        <div className="about__content">
          <blockquote className="about__quote" data-reveal="up">
            “I don’t just build software. I build <em>systems</em> that solve business problems.”
          </blockquote>

          <div className="about__story">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                {paragraph.split(" ").map((word, index) => (
                  <span className="tw" key={index}>{word} </span>
                ))}
              </p>
            ))}
          </div>

          <dl className="about__facts" data-reveal="stagger">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
