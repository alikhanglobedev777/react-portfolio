import { useEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ProjectMockup from "../components/ProjectMockup";
import SplitWords from "../components/SplitWords";
import { projects } from "../data/content";
import { scrollToId } from "../lib/motion";
import { useReveal } from "../lib/useReveal";

export default function CaseStudy() {
  const { slug } = useParams();
  const rootRef = useRef(null);
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  useReveal(rootRef, [slug]);

  useEffect(() => {
    scrollToId("top", { immediate: true });
    if (project) document.title = `${project.name} — Case study · Muhammad Ali`;
  }, [project]);

  if (!project) return <Navigate to="/" replace />;

  const isProduct = project.kind === "product";

  const blocks = isProduct
    ? [
        { title: "Overview", body: project.overview },
        { title: "The problem", body: project.problem },
        { title: "My role", body: project.role },
        { title: "Technical approach", body: project.approach },
      ]
    : [{ title: "Overview", body: project.overview }];

  return (
    <article ref={rootRef} className="case" style={{ "--acc": project.accent, "--tint": project.tint }} key={slug}>
      <div className="container">
        <Link to="/" state={{ scrollTo: "work" }} className="case__back link-arrow" data-reveal="fade">
          <span aria-hidden="true">←</span> All work
        </Link>

        <header className="case__head">
          <p className="eyebrow" data-reveal="up">
            <span className="eyebrow__no">{isProduct ? "Product" : "Client system"}</span>
            {project.category}
          </p>
          <SplitWords as="h1" className="case__title display" text={project.name} />
          <p className="case__tagline" data-reveal="up">{project.tagline || project.overview}</p>

          <div className="case__meta" data-reveal="stagger">
            <div><small>Type</small>{isProduct ? "Personal product" : "Professional / client work"}</div>
            {project.year && <div><small>Year</small>{project.year}</div>}
            <div><small>Status</small>{isProduct ? "Live" : "Private codebase"}</div>
            {isProduct && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn--ink" data-cursor="Open ↗">
                Visit live site <span className="btn__arrow" aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </header>

        <div className="case__hero" data-reveal="clip">
          <ProjectMockup project={project} />
        </div>

        <div className="case__body">
          <div className="case__blocks">
            {blocks.filter((block) => block.body).map((block, i) => (
              <section key={block.title} className="case__block" data-reveal="up">
                <h2><span>{String(i + 1).padStart(2, "0")}</span>{block.title}</h2>
                <p>{block.body}</p>
              </section>
            ))}

            <section className="case__block" data-reveal="up">
              <h2><span>{String(blocks.length + 1).padStart(2, "0")}</span>What I worked on</h2>
              <ul className="case__list">
                {project.work.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            {!isProduct && (
              <p className="case__note" data-reveal="fade">
                This is a private client system. Code, screenshots and business metrics are confidential, so this page
                sticks to the scope and technology I can share publicly.
              </p>
            )}
          </div>

          <aside className="case__side" data-reveal="up">
            <h2>Stack</h2>
            <ul className="chips">
              {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
            </ul>
          </aside>
        </div>

        <Link to={`/work/${next.slug}`} className="case__next" data-cursor="Next">
          <small>Next project</small>
          <span>{next.name} <span aria-hidden="true">→</span></span>
        </Link>
      </div>
    </article>
  );
}
