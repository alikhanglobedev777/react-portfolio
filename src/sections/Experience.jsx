import { useLayoutEffect, useRef } from "react";
import SplitWords from "../components/SplitWords";
import { experience } from "../data/content";
import { gsap, prefersReducedMotion, ScrollTrigger } from "../lib/motion";

export default function Experience() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".timeline__progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: 0.4 },
        }
      );
      gsap.utils.toArray(".job").forEach((job) => {
        gsap.from(job, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: job,
            start: "top 85%",
            once: true,
          },
        });
        ScrollTrigger.create({
          trigger: job,
          start: "top 65%",
          once: true,
          onEnter: () => job.classList.add("is-reached"),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section exp" id="experience" aria-labelledby="exp-title">
      <div className="container exp__layout">
        <div className="exp__intro">
          <div className="exp__sticky">
            <p className="eyebrow" data-reveal="up"><span className="eyebrow__no">05</span><span data-scramble>Experience</span></p>
            <SplitWords as="h2" id="exp-title" className="section-title" text="My professional *journey.*" />
            <p className="section-lede" data-reveal="up">
              From intern to shipping production platforms — three teams in Lahore, each adding more ownership across the stack.
            </p>
            <ol className="exp__path" data-reveal="stagger" aria-label="Career progression">
              <li><span>2025</span>Intern</li>
              <li><span>2026</span>Associate Engineer</li>
              <li><span>Now</span>MERN Developer</li>
            </ol>
          </div>
        </div>

        <div className="timeline">
          <span className="timeline__line" aria-hidden="true"><span className="timeline__progress" /></span>
          <ol className="timeline__list">
          {experience.map((job) => (
            <li className={`job${job.current ? " job--current is-reached" : ""}`} key={job.company}>
              <span className="job__dot" aria-hidden="true" />
              <div className="job__card" data-tilt="4">
                <div className="job__top">
                  <span className="job__period">{job.period}</span>
                  {job.current && <span className="pill pill--live"><span className="pulse pulse--ok" aria-hidden="true" />Current</span>}
                </div>
                <h3 className="job__company">{job.company}</h3>
                <p className="job__role">{job.role} <span>· {job.place}</span></p>
                <p className="job__summary">{job.summary}</p>
                <ul className="job__points">
                  {job.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
                <ul className="chips chips--sm">
                  {job.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
