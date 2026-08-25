import { useEffect, useRef } from "react";
import { gsap } from "../animation/gsap";
import { emailContact, socialLinks } from "../data/socials";
import "../styles/SocialLinks.css";

const iconPaths = {
  EMAIL: "M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z",
  GITHUB: "M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.91c-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.9c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.17 10.17 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z",
  LINKEDIN: "M6.5 8.25H3V21h3.5V8.25ZM4.75 3A2.06 2.06 0 1 0 4.75 7.12 2.06 2.06 0 0 0 4.75 3ZM21 13.69c0-3.84-2.05-5.63-4.79-5.63-2.21 0-3.2 1.22-3.75 2.07V8.25H9V21h3.46v-6.31c0-1.67.32-3.29 2.39-3.29 2.04 0 2.06 1.91 2.06 3.4V21H21v-7.31Z",
  WHATSAPP: "M12.04 2A9.84 9.84 0 0 0 3.5 16.74L2 22l5.37-1.41A9.96 9.96 0 0 0 12.04 21 9.5 9.5 0 1 0 12.04 2Zm5.72 13.54c-.24.68-1.41 1.3-1.95 1.36-.5.05-1.13.08-1.82-.14-.42-.13-.96-.31-1.65-.6-2.91-1.22-4.8-4.16-4.95-4.35-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.26-.29.58-.36.77-.36h.55c.18.01.41-.07.64.49.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.3.38-.43.51-.14.14-.29.29-.12.58.17.29.75 1.23 1.61 1.99 1.11.99 2.04 1.3 2.33 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.65-.14.26.1 1.66.79 1.95.93.29.14.48.22.55.34.07.12.07.68-.17 1.36Z",
};

function SocialIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d={iconPaths[name]} fill="currentColor" />
    </svg>
  );
}

export default function SocialLinks({ variant = "default", tabIndex, includeEmail = false }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return undefined;

    const links = Array.from(root.querySelectorAll(".social-link"));
    const listeners = [];

    links.forEach((link) => {
      const label = link.querySelector(".social-link__label");
      const arrow = link.querySelector(".social-link__arrow");
      const onMove = (event) => {
        const rect = link.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        gsap.to(link, { x, y, duration: 0.38, ease: "power3.out", overwrite: true });
        gsap.to(label, { x: x * 0.42, duration: 0.38, ease: "power3.out", overwrite: true });
        gsap.to(arrow, { x: x * 0.75, y: y * 0.75, duration: 0.38, ease: "power3.out", overwrite: true });
      };
      const reset = () => {
        gsap.to([link, label, arrow], { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: true });
      };
      link.addEventListener("pointermove", onMove, { passive: true });
      link.addEventListener("pointerleave", reset);
      listeners.push(() => {
        link.removeEventListener("pointermove", onMove);
        link.removeEventListener("pointerleave", reset);
      });
    });

    return () => listeners.forEach((remove) => remove());
  }, []);

  const links = includeEmail ? [emailContact, ...socialLinks] : socialLinks;

  return (
    <nav className={`social-links social-links--${variant}`} ref={rootRef} aria-label="Social links">
      {links.map((social) => (
        <a
          className="social-link"
          href={social.href}
          target={social.external ? "_blank" : undefined}
          rel={social.external ? "noopener noreferrer" : undefined}
          data-cursor={social.cursorState}
          aria-label={social.ariaLabel}
          tabIndex={tabIndex}
          key={social.name}
        >
          <span className="social-link__icon"><SocialIcon name={social.name} /></span>
          <span className="social-link__label">{social.name}</span>
          <span className="social-link__arrow" aria-hidden="true">&nearr;</span>
        </a>
      ))}
    </nav>
  );
}
