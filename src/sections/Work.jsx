import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Magnetic from "../components/Magnetic";
import ProjectMockup from "../components/ProjectMockup";
import SectionHead from "../components/SectionHead";
import { projects } from "../data/content";
import { gsap, isFinePointer, prefersReducedMotion } from "../lib/motion";
import { scramble } from "../lib/useReveal";

const products = projects.filter((project) => project.kind === "product");
const systems = projects.filter((project) => project.kind === "client");

function TiltMockup({ project }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return undefined;
    const inner = el.firstElementChild;
    const rx = gsap.quickTo(inner, "rotationX", { duration: 0.7, ease: "power3.out" });
    const ry = gsap.quickTo(inner, "rotationY", { duration: 0.7, ease: "power3.out" });
    const move = (event) => {
      const rect = el.getBoundingClientRect();
      ry(((event.clientX - rect.left) / rect.width - 0.5) * 9);
      rx(-((event.clientY - rect.top) / rect.height - 0.5) * 9);
      el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <Link
      to={`/work/${project.slug}`}
      ref={ref}
      className="feature__visual"
      data-cursor="View case"
      aria-label={`${project.name} case study`}
      style={{ "--tint": project.tint, "--acc": project.accent }}
    >
      <div className="feature__tilt">
        <ProjectMockup project={project} showLabel={false} />
      </div>
      <span className="feature__shine" aria-hidden="true" />
    </Link>
  );
}

function SystemsList() {
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion());

  useEffect(() => {
    if (!enabled) return undefined;
    const list = listRef.current;
    const preview = previewRef.current;
    const xTo = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3.out" });
    const move = (event) => {
      const rect = list.getBoundingClientRect();
      xTo(event.clientX - rect.left);
      yTo(event.clientY - rect.top);
    };
    list.addEventListener("pointermove", move);
    return () => list.removeEventListener("pointermove", move);
  }, [enabled]);

  return (
    <div className="systems" ref={listRef} onPointerLeave={() => setHovered(null)}>
      <div className="systems__head" data-reveal="up">
        <h3>Professional systems</h3>
        <p>Production business platforms I’ve built or contributed to. Client code is private, so these link to written case notes rather than live sites.</p>
      </div>

      <ol className="systems__list" data-reveal="stagger">
        {systems.map((project, index) => (
          <li key={project.slug}>
            <Link
              to={`/work/${project.slug}`}
              className="systems__row"
              data-cursor="Read"
              onPointerEnter={() => setHovered(project)}
              onFocus={() => setHovered(project)}
              style={{ "--acc": project.accent }}
            >
              <span className="systems__no">0{index + 4}</span>
              <span className="systems__name">{project.name}</span>
              <span className="systems__cat">{project.category}</span>
              <span className="systems__stack">{project.stack.slice(0, 3).join(" · ")}</span>
              <span className="pill pill--muted">Private</span>
              <span className="systems__arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ol>

      {enabled && (
        <div ref={previewRef} className={`systems__preview${hovered ? " is-visible" : ""}`} aria-hidden="true">
          {systems.map((project) => (
            <div key={project.slug} className={`systems__preview-item${hovered?.slug === project.slug ? " is-active" : ""}`}>
              <ProjectMockup project={project} compact showLabel={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Work() {
  const rootRef = useRef(null);

  // Project cards straighten and grow into place as they scroll in;
  // the mockup inside drifts for depth and the giant index slides behind.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".feature").forEach((feature, index) => {
        const visual = feature.querySelector(".feature__visual");
        gsap.fromTo(
          visual,
          { scale: 0.86, rotate: index % 2 ? 3 : -3 },
          {
            scale: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: { trigger: feature, start: "top bottom", end: "center 60%", scrub: 0.8 },
          }
        );
        gsap.fromTo(
          feature.querySelector(".mockup"),
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: { trigger: feature, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        gsap.fromTo(
          feature.querySelector(".feature__bg-no"),
          { xPercent: index % 2 ? -20 : 20, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: feature, start: "top 90%", end: "center center", scrub: 0.6 },
          }
        );
        const name = feature.querySelector(".feature__name");
        gsap.from(name, {
          clipPath: "inset(0 100% 0 0)",
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: name, start: "top 88%", once: true, onEnter: () => scramble(feature.querySelector(".feature__cat"), 0.7) },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section work" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          index="01"
          label="Selected Work"
          id="work-title"
          title="Selected *work.*"
          lede="Products, platforms and systems I’ve helped bring to life — three of my own live products, plus the business systems I build professionally."
        />

        <div className="features">
          {products.map((project, index) => (
            <article
              key={project.slug}
              className={`feature${index % 2 ? " feature--flip" : ""}`}
              style={{ "--acc": project.accent, "--tint": project.tint }}
            >
              <span className="feature__bg-no" aria-hidden="true">0{index + 1}</span>
              <div data-reveal="clip">
                <TiltMockup project={project} />
              </div>

              <div className="feature__info" data-reveal="stagger">
                <div className="feature__meta">
                  <span className="feature__no">0{index + 1}</span>
                  <span className="feature__cat">{project.category}</span>
                  <span className="pill pill--live"><span className="pulse pulse--ok" aria-hidden="true" />Live</span>
                </div>
                <h3 className="feature__name">{project.name}</h3>
                <p className="feature__tagline">{project.tagline}</p>
                <ul className="feature__points">
                  {project.work.slice(0, 3).map((point) => <li key={point}>{point}</li>)}
                </ul>
                <ul className="chips" aria-label="Tech stack">
                  {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
                <div className="feature__actions">
                  <Magnetic strength={0.3}>
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn--ink" data-cursor="Open ↗">
                      Visit live site
                      <span className="btn__arrow" aria-hidden="true">↗</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </Magnetic>
                  <Link to={`/work/${project.slug}`} className="link-arrow">
                    Case study <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="work__note" data-reveal="fade">
          <span aria-hidden="true">ⓘ</span> Live products run on Render’s free tier — if a site has been idle, the first load can take up to a minute while it wakes up.
        </p>

        <SystemsList />
      </div>
    </section>
  );
}
