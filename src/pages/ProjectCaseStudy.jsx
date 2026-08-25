import { useCallback, useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { gsap } from "../animation/gsap";
import ProjectArtwork from "../components/projects/ProjectArtwork";
import { projects } from "../data/projects";
import { useGSAPContext } from "../hooks/useGSAPContext";
import "../styles/project-case-study.css";

export default function ProjectCaseStudy() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const projectIndex = projects.findIndex((item) => item.id === projectId);
  const project = projects[projectIndex];

  useEffect(() => {
    if (!project) return undefined;
    const previousTitle = document.title;
    document.title = `${project.name} — Muhammad Ali`;
    window.scrollTo(0, 0);
    return () => { document.title = previousTitle; };
  }, [project]);

  const runEntrance = useCallback(() => {
    const root = rootRef.current;
    if (!root || document.documentElement.dataset.projectTransition === "active") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const timeline = gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".case-study-hero__art", { scale: 1.06, opacity: 0, duration: 1.1 }, 0)
      .from(".case-study-hero__title span", { yPercent: 110, filter: "blur(10px)", duration: 0.85 }, 0.16)
      .from(".case-study-hero__meta > *, .case-study-hero__scroll", { y: 18, opacity: 0, stagger: 0.06, duration: 0.5 }, 0.28);
    return () => timeline.kill();
  }, []);

  useGSAPContext(rootRef, runEntrance);

  if (!project) return <Navigate to="/" replace />;

  const handleBack = (event) => {
    event.preventDefault();
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate("/#projects");
  };

  return (
    <article
      className="case-study"
      ref={rootRef}
      style={{
        "--project-accent": project.accent,
        "--project-panel": project.panel,
        "--project-shell": project.shell,
      }}
    >
      <section className="case-study-hero" aria-labelledby="case-study-title">
        <div className="case-study-hero__art" aria-hidden="true">
          <ProjectArtwork project={project} index={projectIndex} total={projects.length} />
        </div>

        <div className="case-study-hero__meta technical">
          <a href="/#projects" onClick={handleBack} data-cursor="link">&larr; SELECTED / SYSTEMS</a>
          <span>{String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          <span>{project.year || "YEAR / NOT LISTED"}</span>
        </div>

        <h1 className="case-study-hero__title" id="case-study-title">
          <span>{project.name}</span>
        </h1>

        <div className="case-study-hero__scroll technical">
          <span>CASE STUDY</span>
          <span>SCROLL TO READ &darr;</span>
        </div>
      </section>

      <section className="case-study-overview page-shell grid-12" aria-label={`${project.name} overview`}>
        <p className="case-study-overview__index technical">SYSTEM / OVERVIEW</p>
        <div className="case-study-overview__lead">
          <p>{project.description}</p>
        </div>

        <dl className="case-study-facts">
          <div><dt>TYPE</dt><dd>{project.category}</dd></div>
          <div><dt>YEAR</dt><dd>{project.year || "NOT LISTED"}</dd></div>
          <div><dt>STACK</dt><dd>{project.technologies.join(" / ")}</dd></div>
          <div><dt>ACCESS</dt><dd>{project.url?.startsWith("http") ? "LIVE" : "PRIVATE / INTERNAL"}</dd></div>
        </dl>

        {project.url?.startsWith("http") && (
          <a className="case-study-overview__live technical" href={project.url} target="_blank" rel="noopener noreferrer" data-cursor="view" aria-label={`Visit ${project.name} live project in a new tab`}>
            VISIT LIVE SITE <span aria-hidden="true">&nearr;</span>
          </a>
        )}
      </section>
    </article>
  );
}
