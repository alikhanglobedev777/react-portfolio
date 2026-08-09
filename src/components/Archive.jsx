import { useCallback, useRef } from "react";
import { gsap } from "../animation/gsap";
import { createMobileReveal } from "../animation/mobileReveal";
import { archiveCategories, archiveProjects } from "../data/archive";
import { githubProfileUrl } from "../data/socials";
import { useGSAPContext } from "../hooks/useGSAPContext";
import "../styles/Archive.css";

export default function Archive() {
  const rootRef = useRef(null);

  const setupMotion = useCallback(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const rows = gsap.utils.toArray(".archive-row", root);
    const cta = root.querySelector(".github-lab__cta");
    const preview = root.querySelector(".archive-preview");
    const previewImage = preview?.querySelector("img");
    const listeners = [];
    const media = gsap.matchMedia();

    media.add("(min-width: 769px)", () => {
      const rowsTimeline = gsap.from(rows, {
        y: 34,
        opacity: 0,
        duration: 0.7,
        stagger: 0.055,
        ease: "power3.out",
        scrollTrigger: { trigger: ".archive-table", start: "top 82%", once: true },
      });

      const labTimeline = gsap.timeline({
        scrollTrigger: { trigger: ".github-lab", start: "top 76%", once: true },
      })
        .from(".github-lab__title span", { yPercent: 110, filter: "blur(8px)", duration: 0.85, stagger: 0.08, ease: "expo.out" })
        .from(".github-lab__console, .github-lab__cta", { y: 32, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, "-=0.42");

      return () => {
        rowsTimeline.kill();
        labTimeline.kill();
      };
    });

    media.add("(max-width: 768px)", () => {
      const animations = [
        createMobileReveal({
          trigger: root.querySelector(".archive-header"),
          targets: root.querySelectorAll(".archive-header__index, .archive-header__title, .archive-header__copy"),
          start: "top 92%",
          from: { y: 30, opacity: 0, filter: "blur(7px)" },
          duration: 0.72,
          stagger: 0.06,
        }),
      ];

      rows.forEach((row) => {
        animations.push(createMobileReveal({
          trigger: row,
          targets: row,
          start: "top 94%",
          from: { y: 22, opacity: 0, filter: "blur(4px)" },
          duration: 0.58,
          stagger: 0,
        }));
      });

      animations.push(createMobileReveal({
        trigger: root.querySelector(".github-lab"),
        targets: root.querySelectorAll(".github-lab__eyebrow, .github-lab__title span, .github-lab__console, .github-lab__cta"),
        start: "top 90%",
        from: { y: 28, opacity: 0, filter: "blur(6px)" },
        duration: 0.7,
        stagger: 0.055,
      }));

      return () => animations.forEach((animation) => animation.kill());
    });

    if (preview && previewImage && window.matchMedia("(min-width: 769px) and (pointer: fine)").matches) {
      const moveX = gsap.quickTo(preview, "x", { duration: 0.35, ease: "power3.out" });
      const moveY = gsap.quickTo(preview, "y", { duration: 0.35, ease: "power3.out" });
      const onMove = (event) => {
        moveX(event.clientX + 28);
        moveY(event.clientY - preview.offsetHeight / 2);
      };
      root.addEventListener("pointermove", onMove, { passive: true });
      listeners.push(() => root.removeEventListener("pointermove", onMove));

      rows.forEach((row) => {
        if (!row.dataset.preview) return;
        const show = () => {
          previewImage.src = row.dataset.preview;
          previewImage.alt = `${row.dataset.project} project preview`;
          gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.28, overwrite: true });
        };
        const hide = () => gsap.to(preview, { autoAlpha: 0, scale: 0.94, duration: 0.22, overwrite: true });
        row.addEventListener("pointerenter", show);
        row.addEventListener("pointerleave", hide);
        listeners.push(() => {
          row.removeEventListener("pointerenter", show);
          row.removeEventListener("pointerleave", hide);
        });
      });
    }

    if (cta && window.matchMedia("(min-width: 769px) and (pointer: fine)").matches) {
      const onMove = (event) => {
        const rect = cta.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.2;
        gsap.to(cta, { x, y, duration: 0.4, ease: "power3.out", overwrite: true });
        gsap.to(cta.querySelector("i"), { x: x * 0.65, y: y * 0.65, duration: 0.4, overwrite: true });
      };
      const reset = () => {
        gsap.to(cta, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1, 0.45)" });
        gsap.to(cta.querySelector("i"), { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1, 0.45)" });
      };
      cta.addEventListener("pointermove", onMove, { passive: true });
      cta.addEventListener("pointerleave", reset);
      listeners.push(() => {
        cta.removeEventListener("pointermove", onMove);
        cta.removeEventListener("pointerleave", reset);
      });
    }

    return () => {
      media.revert();
      listeners.forEach((remove) => remove());
    };
  }, []);

  useGSAPContext(rootRef, setupMotion);

  const hasScreenshots = archiveProjects.some((project) => Boolean(project.screenshot));

  return (
    <section className="archive" id="archive" ref={rootRef} aria-labelledby="archive-title">
      <header className="archive-header page-shell grid-12">
        <p className="archive-header__index technical">03 / REPOSITORY INDEX</p>
        <h2 className="archive-header__title" id="archive-title">PROJECT<br />ARCHIVE</h2>
        <p className="archive-header__copy">A working index of public repositories, experiments, interfaces, and utilities.</p>
      </header>

      <div className="archive-table page-shell" role="table" aria-label="Project archive">
        <div className="archive-table__head technical" role="row">
          <span role="columnheader">INDEX</span>
          <span role="columnheader">PROJECT</span>
          <span role="columnheader">TYPE</span>
          <span role="columnheader">YEAR</span>
          <span role="columnheader">LINK</span>
        </div>

        <div className="archive-table__body" role="rowgroup">
          {archiveProjects.map((project, index) => (
            <div
              className="archive-row"
              role="row"
              key={project.repository}
              data-preview={project.screenshot || undefined}
              data-project={project.name}
            >
              <span className="archive-row__index technical" role="cell">{String(index + 1).padStart(2, "0")}</span>
              <div className="archive-row__project" role="cell">
                <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" data-cursor="code">
                  {project.name}
                  {project.featured && <sup aria-label="Featured repository">+</sup>}
                </a>
                <small>{project.type} / {project.year}</small>
              </div>
              <span className="archive-row__type technical" role="cell">{project.type}</span>
              <span className="archive-row__year technical" role="cell">{project.year}</span>
              <span className="archive-row__links technical" role="cell">
                {project.projectUrl && <a className="archive-row__live" href={project.projectUrl} target="_blank" rel="noopener noreferrer" data-cursor="view" aria-label={`Open ${project.name} live site in a new tab`}>LIVE <i aria-hidden="true">&nearr;</i></a>}
                <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" data-cursor="code">CODE <i aria-hidden="true">&nearr;</i></a>
              </span>
            </div>
          ))}
        </div>
      </div>

      {hasScreenshots && <div className="archive-preview" aria-hidden="true"><img alt="" /></div>}

      <div className="github-lab page-shell">
        <p className="github-lab__eyebrow technical">LAB / GITHUB</p>
        <h2 className="github-lab__title" aria-label="Code never stops.">
          <span>CODE</span><span>NEVER</span><span>STOPS.</span>
        </h2>

        <div className="github-lab__console">
          <div className="github-lab__console-head technical">
            <span>~/MUHAMMADALI / PUBLIC LAB</span><span>REPOSITORY CATEGORIES</span>
          </div>
          <ol>
            {archiveCategories.map((category, index) => (
              <li key={category}>
                <span className="technical">{String(index + 1).padStart(2, "0")}</span>
                <span>{category}</span>
                <i aria-hidden="true">/</i>
              </li>
            ))}
          </ol>
          <p className="github-lab__prompt technical"><span aria-hidden="true">$</span> OPEN SOURCE / WORK IN PROGRESS<span className="github-lab__caret" aria-hidden="true" /></p>
        </div>

        <a className="github-lab__cta" href={githubProfileUrl} target="_blank" rel="noopener noreferrer" data-cursor="code">
          <span>EXPLORE GITHUB</span><i aria-hidden="true">&nearr;</i>
        </a>
      </div>
    </section>
  );
}
