import { useCallback, useRef } from "react";
import { gsap } from "../animation/gsap";
import { createMobileReveal } from "../animation/mobileReveal";
import { scrollToSection } from "../animation/scrollController";
import { useGSAPContext } from "../hooks/useGSAPContext";
import { profile } from "../data/profile";
import "../styles/Footer.css";

export default function Footer() {
  const footerRef = useRef(null);

  const setupMotion = useCallback(() => {
    const footer = footerRef.current;
    if (!footer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const title = footer.querySelector(".footer-title");
    const backToTop = footer.querySelector(".footer-back-to-top");
    const media = gsap.matchMedia();
    const listeners = [];

    media.add("(min-width: 769px)", () => {
      const entrance = gsap.timeline({
        scrollTrigger: { trigger: footer, start: "top 94%", end: "top 32%", scrub: 0.62 },
      })
        .fromTo(footer, { y: 120, clipPath: "inset(12% 0 0 0)" }, { y: 0, clipPath: "inset(0% 0 0 0)", ease: "none" }, 0)
        .from(".footer-title__line span", { yPercent: 112, filter: "blur(12px)", stagger: 0.08, ease: "none" }, 0.14)
        .from(".footer-meta > *, .footer-contact-hub, .footer-back-to-top, .footer-mantra span", { y: 28, opacity: 0, stagger: 0.045, ease: "none" }, 0.35);
      return () => entrance.kill();
    });

    media.add("(max-width: 768px)", () => {
      const reveal = createMobileReveal({
        trigger: footer,
        targets: footer.querySelectorAll(".footer-meta > *, .footer-title__line span, .footer-contact-hub, .footer-back-to-top, .footer-mantra span"),
        start: "top 94%",
        from: { y: 28, opacity: 0, filter: "blur(6px)" },
        duration: 0.7,
        stagger: 0.045,
      });
      return () => reveal.kill();
    });

    if (window.matchMedia("(pointer: fine)").matches) {
      const moveTitleX = gsap.quickTo(title, "x", { duration: 0.7, ease: "power3.out" });
      const moveTitleY = gsap.quickTo(title, "y", { duration: 0.7, ease: "power3.out" });
      const onFooterMove = (event) => {
        const bounds = footer.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        footer.style.setProperty("--footer-pointer-x", `${event.clientX - bounds.left}px`);
        footer.style.setProperty("--footer-pointer-y", `${event.clientY - bounds.top}px`);
        moveTitleX(x * 22);
        moveTitleY(y * 12);
      };
      const resetFooterPointer = () => {
        moveTitleX(0);
        moveTitleY(0);
      };
      footer.addEventListener("pointermove", onFooterMove, { passive: true });
      footer.addEventListener("pointerleave", resetFooterPointer);
      listeners.push(() => {
        footer.removeEventListener("pointermove", onFooterMove);
        footer.removeEventListener("pointerleave", resetFooterPointer);
      });

      const onBackMove = (event) => {
        const bounds = backToTop.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * 0.14;
        const y = (event.clientY - bounds.top - bounds.height / 2) * 0.2;
        gsap.to(backToTop, { x, y, duration: 0.38, ease: "power3.out", overwrite: true });
        gsap.to(backToTop.querySelector("i"), { y: y * 0.8 - 5, duration: 0.38, overwrite: true });
      };
      const resetBack = () => {
        gsap.to(backToTop, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
        gsap.to(backToTop.querySelector("i"), { y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
      };
      backToTop.addEventListener("pointermove", onBackMove, { passive: true });
      backToTop.addEventListener("pointerleave", resetBack);
      listeners.push(() => {
        backToTop.removeEventListener("pointermove", onBackMove);
        backToTop.removeEventListener("pointerleave", resetBack);
      });
    }

    return () => {
      media.revert();
      listeners.forEach((remove) => remove());
    };
  }, []);

  useGSAPContext(footerRef, setupMotion);

  const handleSectionNavigation = (event, target) => {
    event.preventDefault();
    scrollToSection(target, {
      immediate: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      duration: target === "home" ? 1.15 : 1.05,
    });
  };

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-pointer-field" aria-hidden="true" />

      <div className="footer-meta technical">
        <span>{profile.name.toUpperCase()} &copy; 2026</span>
        <span>{profile.location.toUpperCase()}</span>
      </div>

      <h2 className="footer-title" aria-label="Ali Khan">
        <span className="footer-title__line"><span>ALI</span></span>
        <span className="footer-title__line"><span>KHAN</span></span>
      </h2>

      <div className="footer-actions">
        <div className="footer-contact-hub">
          <p className="technical">DIRECT / CONNECT</p>
          <strong>GitHub, LinkedIn, WhatsApp and email are available in the contact hub.</strong>
          <div className="footer-contact-hub__links">
            <a href="#contact" onClick={(event) => handleSectionNavigation(event, "contact")} data-cursor="contact">OPEN CONTACT <span aria-hidden="true">↑</span></a>
            <a href={profile.resumeUrl} download="Ali-Khan-Resume.pdf" data-cursor="link">RESUME <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <a className="footer-back-to-top" href="#home" onClick={(event) => handleSectionNavigation(event, "home")} data-cursor="link" aria-label="Back to top">
          <span>BACK TO TOP</span><i aria-hidden="true">&uarr;</i>
        </a>
      </div>

      <div className="footer-mantra" aria-label="Build. Ship. Repeat.">
        <span>BUILD</span><i aria-hidden="true">/</i><span>SHIP</span><i aria-hidden="true">/</i><span>REPEAT.</span>
      </div>
    </footer>
  );
}
