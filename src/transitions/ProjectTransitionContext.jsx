import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap, ScrollTrigger } from "../animation/gsap";
import ProjectArtwork from "../components/projects/ProjectArtwork";
import { projects } from "../data/projects";
import { ProjectTransitionContext } from "./useProjectTransition";
import "../styles/project-transition.css";

const nextPaint = () => new Promise((resolve) => {
  window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
});

export function ProjectTransitionProvider({ children }) {
  const navigate = useNavigate();
  const layerRef = useRef(null);
  const visualRef = useRef(null);
  const titleRef = useRef(null);
  const runningRef = useRef(false);
  const [activeProject, setActiveProject] = useState(null);

  const finishTransition = useCallback(() => {
    document.documentElement.removeAttribute("data-project-transition");
    document.body.style.overflow = "";
    runningRef.current = false;
    setActiveProject(null);
    ScrollTrigger.refresh();
  }, []);

  const openProject = useCallback(async ({ project, sourceMedia, sourceTitle, sourcePanel }) => {
    if (runningRef.current || !project || !sourceMedia || !sourceTitle) return;
    runningRef.current = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const mediaRect = sourceMedia.getBoundingClientRect();
    const mediaStyle = window.getComputedStyle(sourceMedia);
    const titleRect = sourceTitle.getBoundingClientRect();
    const titleStyle = window.getComputedStyle(sourceTitle);
    const projectIndex = projects.findIndex((item) => item.id === project.id);

    const currentHistoryState = window.history.state || {};
    window.history.replaceState({
      ...currentHistoryState,
      usr: { ...(currentHistoryState.usr || {}), projectReturnY: window.scrollY },
    }, "");
    document.documentElement.dataset.projectTransition = "active";
    document.body.style.overflow = "hidden";
    setActiveProject({ project, index: projectIndex });
    await nextPaint();

    const layer = layerRef.current;
    const visual = visualRef.current;
    const title = titleRef.current;
    if (!layer || !visual || !title) {
      navigate(`/projects/${project.id}`);
      finishTransition();
      return;
    }

    gsap.set(layer, { visibility: "visible", pointerEvents: "auto", opacity: 1 });
    gsap.set(visual, {
      left: mediaRect.left,
      top: mediaRect.top,
      width: mediaRect.width,
      height: mediaRect.height,
      clipPath: mediaStyle.clipPath === "none" ? "inset(0% 0% 0% 0%)" : mediaStyle.clipPath,
    });
    gsap.set(title, {
      left: titleRect.left,
      top: titleRect.top,
      width: Math.max(titleRect.width, 280),
      fontSize: titleStyle.fontSize,
      lineHeight: titleStyle.lineHeight,
      opacity: mobile ? 0 : 1,
    });

    if (reducedMotion) {
      gsap.timeline({
        onComplete: async () => {
          navigate(`/projects/${project.id}`);
          window.scrollTo(0, 0);
          await nextPaint();
          gsap.to(layer, { opacity: 0, duration: 0.22, onComplete: finishTransition });
        },
      }).fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 0.18 });
      return;
    }

    const neighboringProjects = sourcePanel
      ? Array.from(sourcePanel.parentElement?.children || []).filter((panel) => panel !== sourcePanel)
      : [];
    const homepageUi = document.querySelectorAll(
      ".systems-header, .systems-progress, .system-project__meta, .system-project__copy, .navbar",
    );
    const pageMargin = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue("--page-margin")) || 24;
    const viewportWidth = window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || document.documentElement.clientHeight || window.innerHeight;
    const destinationSize = Math.min(viewportWidth * (mobile ? 0.19 : 0.14), mobile ? 104 : 230);

    gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: async () => {
        navigate(`/projects/${project.id}`);
        window.scrollTo(0, 0);
        await nextPaint();

        const caseHero = document.querySelector(".case-study-hero");
        const caseContent = document.querySelectorAll(".case-study-hero__meta, .case-study-hero__title span, .case-study-hero__scroll");
        gsap.set(caseHero, { opacity: 1 });
        gsap.set(caseContent, { opacity: 0, y: mobile ? 18 : 34 });

        gsap.timeline({ defaults: { ease: "expo.inOut" }, onComplete: finishTransition })
          .to(title, { opacity: 0, y: -22, duration: mobile ? 0.3 : 0.42 }, 0)
          .to(visual, {
            clipPath: mobile ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 100% 0%)",
            scale: mobile ? 1 : 1.035,
            duration: mobile ? 0.62 : 0.88,
          }, 0)
          .to(caseContent, { opacity: 1, y: 0, stagger: 0.055, duration: mobile ? 0.45 : 0.62, ease: "power3.out" }, 0.2)
          .set(layer, { visibility: "hidden", pointerEvents: "none" });
      },
    })
      .to(neighboringProjects, { opacity: 0, scale: 0.96, filter: "blur(8px)", duration: mobile ? 0.25 : 0.48 }, 0)
      .to(homepageUi, { opacity: 0, y: -20, clipPath: "inset(0 0 100% 0)", duration: mobile ? 0.3 : 0.55 }, 0)
      .set(sourceMedia, { opacity: 0 }, 0.06)
      .to(visual, {
        left: 0,
        top: 0,
        width: viewportWidth,
        height: viewportHeight,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: mobile ? 0.72 : 1.18,
      }, 0)
      .to(title, {
        left: pageMargin,
        top: viewportHeight * 0.66,
        width: viewportWidth - pageMargin * 2,
        fontSize: destinationSize,
        lineHeight: 0.78,
        letterSpacing: "-0.075em",
        duration: 1.12,
      }, 0.06);
  }, [finishTransition, navigate]);

  const value = { openProject, transitioning: Boolean(activeProject) };

  return (
    <ProjectTransitionContext.Provider value={value}>
      {children}
      <div
        className="project-transition-layer"
        ref={layerRef}
        aria-hidden="true"
        style={activeProject ? {
          "--project-accent": activeProject.project.accent,
          "--project-panel": activeProject.project.panel,
          backgroundColor: activeProject.project.shell,
        } : undefined}
      >
        {activeProject && (
          <>
            <div className="project-transition-layer__visual" ref={visualRef}>
              <ProjectArtwork project={activeProject.project} index={activeProject.index} total={projects.length} />
            </div>
            <div className="project-transition-layer__title" ref={titleRef}>{activeProject.project.name}</div>
          </>
        )}
      </div>
    </ProjectTransitionContext.Provider>
  );
}
