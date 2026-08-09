import { useCallback, useRef } from "react";
import { gsap } from "../animation/gsap";
import { createMobileReveal } from "../animation/mobileReveal";
import { profile } from "../data/profile";
import { useGSAPContext } from "../hooks/useGSAPContext";
import "../styles/ResumeDownload.css";

export default function ResumeDownload() {
  const rootRef = useRef(null);

  const setupMotion = useCallback(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const media = gsap.matchMedia();

    media.add("(min-width: 769px)", () => {
      const titleLines = root.querySelectorAll(".resume-download__title span");
      const details = root.querySelectorAll(".resume-download__index, .resume-download__copy, .resume-download__meta, .resume-download__actions");
      const document = root.querySelector(".resume-download__document");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 84%",
          end: "top 22%",
          scrub: 0.58,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(titleLines, {
          yPercent: 112,
          clipPath: "inset(0 0 100% 0)",
          filter: "blur(10px)",
        }, {
          yPercent: 0,
          clipPath: "inset(0 0 0% 0)",
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "none",
        }, 0)
        .fromTo(document, { rotate: -3, y: 70, opacity: 0, scale: 0.94 }, { rotate: 0, y: 0, opacity: 1, scale: 1, ease: "none" }, 0.2)
        .fromTo(details, { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, ease: "none" }, 0.34);

      return () => timeline.kill();
    });

    media.add("(max-width: 768px)", () => {
      const reveal = createMobileReveal({
        trigger: root,
        targets: root.querySelectorAll(".resume-download__index, .resume-download__title span, .resume-download__document, .resume-download__copy, .resume-download__actions"),
        start: "top 92%",
        from: { y: 28, opacity: 0, filter: "blur(6px)" },
        duration: 0.7,
        stagger: 0.05,
      });
      return () => reveal.kill();
    });

    return () => media.revert();
  }, []);

  useGSAPContext(rootRef, setupMotion);

  return (
    <section className="resume-download" id="resume" ref={rootRef} aria-labelledby="resume-download-title">
      <div className="resume-download__layout page-shell grid-12">
        <p className="resume-download__index technical">07 / RESUME</p>

        <h2 className="resume-download__title" id="resume-download-title" aria-label="Resume 2026">
          <span>RESUME</span>
          <span>/ 2026</span>
        </h2>

        <div className="resume-download__document" aria-hidden="true">
          <div className="resume-download__document-head">
            <span>AK</span>
            <span>CURRICULUM / VITAE</span>
          </div>
          <strong>ALI<br />KHAN</strong>
          <div className="resume-download__document-foot">
            <span>FULL-STACK ENGINEER</span>
            <span>PDF / CURRENT</span>
          </div>
        </div>

        <div className="resume-download__copy">
          <p>Professional experience, selected systems, technical capabilities, and education in one concise document.</p>
          <ul className="resume-download__meta technical" aria-label="Resume details">
            <li>ALI KHAN</li>
            <li>{profile.role.toUpperCase()}</li>
            <li>{profile.location.toUpperCase()}</li>
            <li>PDF / CURRENT CV</li>
          </ul>
        </div>

        <div className="resume-download__actions">
          <a className="resume-download__action resume-download__action--primary" href={profile.resumeUrl} download="Ali-Khan-Resume.pdf" data-cursor="link" data-magnetic data-magnetic-strength="0.08">
            <span>DOWNLOAD RESUME</span><i aria-hidden="true">↓</i>
          </a>
          <a className="resume-download__action" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" data-cursor="link" data-magnetic data-magnetic-strength="0.08">
            <span>VIEW PDF</span><i aria-hidden="true">↗</i>
          </a>
        </div>
      </div>
    </section>
  );
}
