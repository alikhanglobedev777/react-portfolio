import { useCallback, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../animation/gsap";
import { createMobileReveal } from "../animation/mobileReveal";
import { experiences, profile, stackRows } from "../data/profile";
import { useGSAPContext } from "../hooks/useGSAPContext";
import "../styles/Journey.css";

function MarqueeGroup({ technologies, duplicate = false }) {
  return (
    <div className="stack-marquee__group" aria-hidden={duplicate || undefined}>
      {technologies.map((technology) => (
        <span className="stack-technology" key={`${duplicate ? "copy" : "source"}-${technology.name}`}>
          <i>{technology.name}</i>
          <b aria-hidden="true">—</b>
          <small>{technology.meta}</small>
        </span>
      ))}
    </div>
  );
}

export default function Journey() {
  const rootRef = useRef(null);
  const stackRef = useRef(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack || !window.IntersectionObserver) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => stack.classList.toggle("is-visible", entry.isIntersecting),
      { rootMargin: "15% 0px 15% 0px" },
    );
    observer.observe(stack);
    return () => observer.disconnect();
  }, []);

  const setupMotion = useCallback(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const media = gsap.matchMedia();

    media.add("(min-width: 769px)", () => {
      const stack = root.querySelector(".journey-stack");
      const experience = root.querySelector(".journey-experience");
      const about = root.querySelector(".journey-about");
      const lineFill = root.querySelector(".experience-timeline__fill");
      const experienceItems = gsap.utils.toArray(".experience-entry", root);
      const contact = document.querySelector("#contact");

      const stackTransition = gsap.timeline({
        scrollTrigger: { trigger: stack, start: "bottom 92%", end: "bottom 22%", scrub: 0.6 },
      })
        .to(".stack-marquee", { opacity: 0.32, scale: 0.975, stagger: 0.025, ease: "none" }, 0)
        .fromTo(experience, { backgroundColor: "#080808" }, { backgroundColor: "#0d0d0c", ease: "none" }, 0)
        .from(".experience-heading__line span", { yPercent: 108, filter: "blur(9px)", stagger: 0.06, ease: "none" }, 0.2);

      const lineTween = gsap.fromTo(lineFill, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".experience-timeline", start: "top 68%", end: "bottom 58%", scrub: 0.5 },
      });

      experienceItems.forEach((item) => {
        const content = item.querySelectorAll(".experience-entry__company, .experience-entry__role, .experience-entry__dates, .experience-entry__responsibilities li");
        gsap.from(content, {
          y: 34,
          opacity: 0,
          filter: "blur(6px)",
          stagger: 0.045,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 72%",
            end: "bottom 38%",
            toggleActions: "play none none reverse",
            onToggle: (self) => item.classList.toggle("is-active", self.isActive),
          },
        });
      });

      const aboutEntrance = gsap.timeline({
        scrollTrigger: { trigger: about, start: "top 82%", end: "top 28%", scrub: 0.55 },
      })
        .from(".about-statement__line span", { yPercent: 112, filter: "blur(12px)", stagger: 0.08, ease: "none" }, 0)
        .from(".about-copy, .about-meta", { y: 44, opacity: 0, stagger: 0.08, ease: "none" }, 0.2)
        .to(experience, { backgroundColor: "#050505", ease: "none" }, 0);

      let contactTransition;
      if (contact) {
        contactTransition = gsap.timeline({
          scrollTrigger: { trigger: about, start: "bottom 86%", end: "bottom 18%", scrub: 0.65 },
        })
          .to(".about-statement__line:nth-child(odd) span", { xPercent: -7, opacity: 0.24, ease: "none" }, 0)
          .to(".about-statement__line:nth-child(even) span", { xPercent: 8, opacity: 0.24, ease: "none" }, 0)
          .to(".about-copy, .about-meta", { y: -30, opacity: 0, ease: "none" }, 0)
          .fromTo(contact, { y: 110, clipPath: "inset(12% 0 0 0)", opacity: 0.4 }, { y: 0, clipPath: "inset(0% 0 0 0)", opacity: 1, ease: "none" }, 0.2);
      }

      return () => {
        stackTransition.kill();
        lineTween.kill();
        aboutEntrance.kill();
        contactTransition?.kill();
      };
    });

    media.add("(max-width: 768px)", () => {
      const stack = root.querySelector(".journey-stack");
      const experience = root.querySelector(".journey-experience");
      const about = root.querySelector(".journey-about");
      const lineFill = root.querySelector(".experience-timeline__fill");
      const experienceItems = gsap.utils.toArray(".experience-entry", root);
      const animations = [];
      const triggers = [];

      // Keep every mobile section visible by default and apply the hidden
      // starting state only when its trigger actually enters the viewport.
      // This prevents the Experience section from getting stuck blank after a
      // direct menu jump, browser chrome resize, or ScrollTrigger refresh.
      animations.push(createMobileReveal({
        trigger: stack,
        targets: root.querySelectorAll(".stack-header__index, .stack-header__character, .stack-header > p:last-child, .stack-marquee"),
        start: "top 92%",
        from: { y: 26, opacity: 0, filter: "blur(6px)" },
        duration: 0.7,
        stagger: 0.035,
      }));

      animations.push(createMobileReveal({
        trigger: experience,
        targets: root.querySelectorAll(".experience-heading > p, .experience-heading__line span"),
        start: "top 92%",
        from: { y: 30, opacity: 0, filter: "blur(7px)" },
        duration: 0.72,
        stagger: 0.06,
      }));

      const lineTween = gsap.fromTo(lineFill, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector(".experience-timeline"),
          start: "top 90%",
          end: "bottom 72%",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });

      experienceItems.forEach((item) => {
        animations.push(createMobileReveal({
          trigger: item,
          targets: item.querySelectorAll(
            ".experience-entry__number, .experience-entry__year, .experience-entry__company, .experience-entry__role, .experience-entry__dates, .experience-entry__responsibilities li",
          ),
          start: "top 91%",
          from: { y: 24, opacity: 0, filter: "blur(5px)" },
          duration: 0.62,
          stagger: 0.04,
        }));

        const setActive = () => item.classList.add("is-active");
        triggers.push(ScrollTrigger.create({
          trigger: item,
          start: "top 72%",
          end: "bottom 36%",
          onEnter: setActive,
          onEnterBack: setActive,
          onLeave: () => item.classList.remove("is-active"),
          onLeaveBack: () => item.classList.remove("is-active"),
        }));
      });

      animations.push(createMobileReveal({
        trigger: about,
        targets: root.querySelectorAll(".about-index, .about-statement__line span, .about-copy, .about-meta"),
        start: "top 91%",
        from: { y: 28, opacity: 0, filter: "blur(6px)" },
        duration: 0.72,
        stagger: 0.055,
      }));

      return () => {
        animations.forEach((animation) => animation.kill());
        triggers.forEach((trigger) => trigger.kill());
        lineTween.scrollTrigger?.kill();
        lineTween.kill();
      };
    });

    return () => media.revert();
  }, []);

  useGSAPContext(rootRef, setupMotion);

  return (
    <div className="journey" ref={rootRef}>
      <section className="journey-stack" id="stack" ref={stackRef} aria-labelledby="stack-title">
        <header className="stack-header page-shell grid-12">
          <p className="stack-header__index technical">04 / CAPABILITIES</p>
          <h2 id="stack-title" aria-label="Stack">
            <span className="stack-header__word" aria-hidden="true">
              {"STACK".split("").map((character, index) => (
                <span className="stack-header__character" key={`${character}-${index}`}>{character}</span>
              ))}
            </span>
          </h2>
          <p>Technologies used across documented portfolio work and professional experience.</p>
        </header>

        <div className="stack-marquees" aria-label="Technology stack">
          {stackRows.map((technologies, index) => (
            <div className={`stack-marquee stack-marquee--${index % 2 ? "reverse" : "forward"}`} key={technologies[0].name}>
              <div className="stack-marquee__track">
                <MarqueeGroup technologies={technologies} />
                <MarqueeGroup technologies={technologies} duplicate />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="journey-experience" id="experience" aria-labelledby="experience-title">
        <div className="experience-layout page-shell grid-12">
          <header className="experience-heading">
            <p className="technical">05 / EXPERIENCE</p>
            <h2 id="experience-title">
              <span className="experience-heading__line"><span>REAL</span></span>
              <span className="experience-heading__line"><span>WORK.</span></span>
            </h2>
          </header>

          <div className="experience-timeline">
            <div className="experience-timeline__line" aria-hidden="true"><i className="experience-timeline__fill" /></div>
            {experiences.map((experience, index) => (
              <article className="experience-entry" key={`${experience.company}-${experience.dates}`}>
                <span className="experience-entry__number technical">{String(index + 1).padStart(2, "0")}</span>
                <time className="experience-entry__year">{experience.year}</time>
                <div className="experience-entry__body">
                  <p className="experience-entry__company technical">{experience.company}</p>
                  <h3 className="experience-entry__role">{experience.role}</h3>
                  <p className="experience-entry__dates technical">{experience.dates}</p>
                  <ul className="experience-entry__responsibilities">
                    {experience.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="journey-about" id="about" aria-labelledby="about-title">
        <div className="about-layout page-shell grid-12">
          <p className="about-index technical">06 / ABOUT</p>
          <h2 className="about-statement" id="about-title" aria-label="Design meets engineering.">
            <span className="about-statement__line"><span>DESIGN</span></span>
            <span className="about-statement__line"><span>MEETS</span></span>
            <span className="about-statement__line"><span>ENGINEERING.</span></span>
          </h2>

          <p className="about-copy">{profile.name} is a full-stack engineer and creative developer building modern digital products from interface and interaction through APIs, backend services, and database systems.</p>

          <ul className="about-meta technical" aria-label="Profile information">
            <li>{profile.location.toUpperCase()}</li>
            <li>FULL-STACK ENGINEERING</li>
            <li>CREATIVE DEVELOPMENT</li>
            <li>DIGITAL SYSTEMS</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
