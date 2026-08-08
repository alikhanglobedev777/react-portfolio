import { useCallback, useRef } from "react";
import { gsap } from "../animation/gsap";
import { useGSAPContext } from "../hooks/useGSAPContext";
import SocialLinks from "./SocialLinks";
import "../styles/Footer.css";

export default function Footer() {
  const footerRef = useRef(null);

  const setupMotion = useCallback(() => {
    const footer = footerRef.current;
    if (!footer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const title = footer.querySelector(".footer-title");
    const backToTop = footer.querySelector(".footer-back-to-top");
    const entrance = gsap.timeline({
      scrollTrigger: { trigger: footer, start: "top 94%", end: "top 32%", scrub: 0.62 },
    })
      .fromTo(footer, { y: 120, clipPath: "inset(12% 0 0 0)" }, { y: 0, clipPath: "inset(0% 0 0 0)", ease: "none" }, 0)
      .from(".footer-title__line span", { yPercent: 112, filter: "blur(12px)", stagger: 0.08, ease: "none" }, 0.14)
      .from(".footer-meta > *, .footer-socials, .footer-back-to-top, .footer-mantra span", { y: 28, opacity: 0, stagger: 0.045, ease: "none" }, 0.35);

    const listeners = [];

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
      entrance.kill();
      listeners.forEach((remove) => remove());
    };
  }, []);

  useGSAPContext(footerRef, setupMotion);

  const handleBackToTop = (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-pointer-field" aria-hidden="true" />

      <div className="footer-meta technical">
        <span>ALI KHAN &copy; 2026</span>
        <span>LAHORE / PAKISTAN</span>
      </div>

      <h2 className="footer-title" aria-label="Ali Khan">
        <span className="footer-title__line"><span>ALI</span></span>
        <span className="footer-title__line"><span>KHAN</span></span>
      </h2>

      <div className="footer-actions">
        <div className="footer-socials">
          <p className="technical">SOCIAL / CONTACT</p>
          <SocialLinks variant="footer" />
        </div>

        <a className="footer-back-to-top" href="#home" onClick={handleBackToTop} data-cursor="link" aria-label="Back to top">
          <span>BACK TO TOP</span><i aria-hidden="true">&uarr;</i>
        </a>
      </div>

      <div className="footer-mantra" aria-label="Build. Ship. Repeat.">
        <span>BUILD</span><i aria-hidden="true">/</i><span>SHIP</span><i aria-hidden="true">/</i><span>REPEAT.</span>
      </div>
    </footer>
  );
}
