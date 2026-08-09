import { useCallback, useRef } from "react";
import { gsap, ScrollTrigger } from "../animation/gsap";
import { createMobileReveal } from "../animation/mobileReveal";
import ProjectArtwork from "../components/projects/ProjectArtwork";
import { projects } from "../data/projects";
import { useGSAPContext } from "../hooks/useGSAPContext";
import { useProjectTransition } from "../transitions/useProjectTransition";
import "../styles/projects.css";

export default function Projects() {
  const sectionRef = useRef(null);
  const { openProject } = useProjectTransition();

  const handleProjectOpen = (event, project) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const sourcePanel = event.currentTarget.closest(".system-project");
    openProject({
      project,
      sourcePanel,
      sourceMedia: sourcePanel?.querySelector(".system-project__media"),
      sourceTitle: sourcePanel?.querySelector(".system-project__title i"),
    });
  };

  const setupMotion = useCallback(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const track = section.querySelector(".systems-track");
    const panels = gsap.utils.toArray(".system-project", section);
    const progressFill = section.querySelector(".systems-progress__fill");
    const progressCurrent = section.querySelector(".systems-progress__current");
    const media = gsap.matchMedia();

    media.add("(min-width: 769px)", () => {
      let activeIndex = -1;
      const pin = section.querySelector(".systems-pin");
      const lastPanel = panels.at(-1);

      // Measure to the real edge of the final project instead of track.scrollWidth.
      // The track has decorative end padding, so using scrollWidth made ScrollTrigger
      // keep the section pinned after the last visible project had already passed.
      const travelDistance = () => {
        if (!pin || !lastPanel) return 0;
        const viewportWidth = pin.clientWidth || window.innerWidth;
        const endInset = Math.max(24, viewportWidth * 0.035);
        return Math.max(0, lastPanel.offsetLeft + lastPanel.offsetWidth - viewportWidth + endInset);
      };

      // Give the horizontal gallery enough vertical scroll distance for every
      // project to remain visible. The previous aggressive duration cap could
      // move the track several viewport-widths during a small wheel gesture.
      const scrollDuration = () => {
        const travel = travelDistance();
        return Math.max(
          window.innerHeight * 1.8,
          travel * 0.82,
        );
      };

      const horizontal = gsap.to(track, {
        x: () => -travelDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + scrollDuration(),
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressFill.style.transform = "scaleX(" + self.progress + ")";
            const nextIndex = Math.min(projects.length - 1, Math.round(self.progress * (projects.length - 1)));
            if (nextIndex !== activeIndex) {
              activeIndex = nextIndex;
              progressCurrent.textContent = String(nextIndex + 1).padStart(2, "0");
              section.style.setProperty("--systems-accent", projects[nextIndex].accent);
              gsap.to(section, { backgroundColor: projects[nextIndex].shell, duration: 0.5, overwrite: true });
            }
          },
        },
      });

      const mediaFrames = panels.map((panel) => panel.querySelector(".system-project__media"));
      const artworks = panels.map((panel) => panel.querySelector(".project-artwork"));
      const titles = panels.map((panel) => panel.querySelector(".system-project__title i"));
      const copies = panels.map((panel) => panel.querySelector(".system-project__copy"));
      const metas = panels.map((panel) => panel.querySelector(".system-project__meta"));

      gsap.set(mediaFrames, { clearProps: "clipPath,opacity,visibility" });
      gsap.set(artworks, { clearProps: "opacity,filter,transform,visibility" });
      gsap.set([...titles, ...copies, ...metas], {
        clearProps: "opacity,filter,transform,visibility",
      });

      const listeners = [];

      panels.forEach((panel) => {
        const artwork = panel.querySelector(".project-artwork");
        const mediaFrame = panel.querySelector(".system-project__media");
        const title = panel.querySelector(".system-project__title i");

        const onMove = (event) => {
          const bounds = mediaFrame.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          gsap.to(artwork, { rotationX: y * -1.6, rotationY: x * 1.6, scale: 1.05, transformPerspective: 1000, duration: 0.45, overwrite: "auto" });
          gsap.to(title, { x: x * 12, y: y * 8, duration: 0.45, overwrite: "auto" });
        };
        const onLeave = () => {
          gsap.to(artwork, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.55, overwrite: "auto" });
          gsap.to(title, { x: 0, y: 0, duration: 0.55, overwrite: "auto" });
        };

        mediaFrame.addEventListener("pointermove", onMove, { passive: true });
        mediaFrame.addEventListener("pointerleave", onLeave);
        listeners.push(() => {
          mediaFrame.removeEventListener("pointermove", onMove);
          mediaFrame.removeEventListener("pointerleave", onLeave);
        });
      });

      return () => {
        // Kill the ScrollTrigger explicitly so React StrictMode / route remounts
        // cannot leave a stale pin spacer that looks like a blank scroll region.
        horizontal.scrollTrigger?.kill();
        horizontal.kill();
        gsap.set(track, { clearProps: "transform" });
        listeners.forEach((remove) => remove());
      };
    });

    media.add("(max-width: 768px)", () => {
      gsap.set(track, { x: 0 });
      gsap.set(panels, { clearProps: "opacity,filter,transform,visibility" });
      gsap.set(section.querySelectorAll(".project-artwork, .system-project__title i, .system-project__copy, .system-project__meta"), {
        clearProps: "opacity,filter,transform,visibility,clipPath",
      });

      const mobileAnimations = [];
      const mobileTriggers = [];

      mobileAnimations.push(createMobileReveal({
        trigger: section.querySelector(".systems-header"),
        targets: section.querySelectorAll(".systems-header__index, .systems-header__title span, .systems-header__copy"),
        start: "top 92%",
        from: { y: 30, opacity: 0, filter: "blur(7px)" },
        duration: 0.72,
        stagger: 0.055,
      }));

      panels.forEach((panel, index) => {
        const mediaFrame = panel.querySelector(".system-project__media");
        const artwork = panel.querySelector(".project-artwork");
        const details = panel.querySelectorAll(
          ".system-project__meta, .system-project__title i, .system-project__description, .system-project__technology, .system-project__actions",
        );

        mobileAnimations.push(createMobileReveal({
          trigger: panel,
          targets: mediaFrame,
          start: "top 88%",
          from: {
            y: 34,
            opacity: 0.45,
            scale: 0.965,
            clipPath: "inset(8% 0 12% 0)",
            filter: "blur(4px)",
          },
          to: { y: 0, opacity: 1, scale: 1, clipPath: "inset(0% 0 0% 0)", filter: "blur(0px)" },
          duration: 0.82,
          stagger: 0,
        }));

        mobileAnimations.push(createMobileReveal({
          trigger: panel,
          targets: details,
          start: "top 84%",
          from: { y: 24, opacity: 0, filter: "blur(5px)" },
          duration: 0.68,
          stagger: 0.045,
        }));

        if (artwork) {
          mobileAnimations.push(createMobileReveal({
            trigger: panel,
            targets: artwork,
            start: "top 88%",
            from: { y: 0, opacity: 1, scale: 1.045, filter: "blur(0px)" },
            to: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
            duration: 0.95,
            stagger: 0,
            clearProps: "transform",
          }));
        }

        const activateProject = () => {
          section.style.setProperty("--systems-accent", projects[index].accent);
          gsap.to(section, {
            backgroundColor: projects[index].shell,
            duration: 0.45,
            ease: "power2.out",
            overwrite: true,
          });
        };

        mobileTriggers.push(ScrollTrigger.create({
          trigger: panel,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: activateProject,
          onEnterBack: activateProject,
        }));
      });

      return () => {
        mobileAnimations.forEach((animation) => animation.kill());
        mobileTriggers.forEach((trigger) => trigger.kill());
        gsap.set(section, { clearProps: "backgroundColor" });
      };
    });

    return () => media.revert();
  }, []);

  useGSAPContext(sectionRef, setupMotion);

  return (
    <section className="selected-systems" id="projects" ref={sectionRef} aria-labelledby="systems-title">
      <header className="systems-header page-shell grid-12">
        <p className="systems-header__index technical">02 / FEATURED WORK</p>
        <h2 className="systems-header__title" id="systems-title">
          <span>SELECTED</span><span>/ SYSTEMS</span>
        </h2>
        <p className="systems-header__copy">Selected interfaces, applications, and full-stack systems built from verified project work.</p>
      </header>

      <div className="systems-pin">
        <div className="systems-progress technical" aria-hidden="true">
          <span className="systems-progress__current">01</span>
          <span className="systems-progress__track"><i className="systems-progress__fill" /></span>
          <span>{String(projects.length).padStart(2, "0")}</span>
        </div>

        <div className="systems-track">
          {projects.map((project, index) => (
            <article
              className="system-project"
              key={project.id}
              style={{ "--project-accent": project.accent, "--project-panel": project.panel }}
              data-shell={project.shell}
            >
              <div className="system-project__meta technical">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.category}</span>
                {project.year ? <span>{project.year}</span> : <span aria-hidden="true">&mdash;</span>}
              </div>

              <a
                className="system-project__media"
                href={`/projects/${project.id}`}
                onClick={(event) => handleProjectOpen(event, project)}
                data-cursor="view"
                aria-label={`View ${project.name} case study`}
              >
                <ProjectArtwork project={project} index={index} total={projects.length} />
              </a>

              <div className="system-project__copy">
                <h3 className="system-project__title"><span><i>{project.name}</i></span></h3>
                <p className="system-project__description">{project.description}</p>
                <ul className="system-project__technology technical" aria-label={project.name + " technologies"}>
                  {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
                <div className="system-project__actions" aria-label={`${project.name} project actions`}>
                  <a
                    className="system-project__link system-project__link--case technical"
                    href={`/projects/${project.id}`}
                    onClick={(event) => handleProjectOpen(event, project)}
                    data-cursor="view"
                    data-magnetic
                    data-magnetic-strength="0.12"
                  >
                    CASE STUDY <span aria-hidden="true" data-magnetic-arrow>&nearr;</span>
                  </a>

                  {project.url?.startsWith("http") && (
                    <a
                      className="system-project__link system-project__link--live technical"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      data-magnetic
                      data-magnetic-strength="0.1"
                      aria-label={`Visit ${project.name} live site in a new tab`}
                    >
                      <span className="system-project__live-label"><i aria-hidden="true" /> LIVE SITE</span>
                      <span aria-hidden="true" data-magnetic-arrow>&nearr;</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
