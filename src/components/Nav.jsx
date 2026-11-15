import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navLinks, profile } from "../data/content";
import { scrollToId, stopScroll } from "../lib/motion";
import Magnetic from "./Magnetic";

// On the home page the landing view shows no header until the visitor scrolls this far.
const LANDING_OFFSET = 60;

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [atTop, setAtTop] = useState(() => window.scrollY < LANDING_OFFSET);

  // Solid background after leaving the top; hide while scrolling down.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < LANDING_OFFSET);
      setScrolled(y > 24);
      setHidden(y > 480 && y > lastY + 4);
      if (y < lastY - 4) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    if (!isHome) return undefined;
    const sections = navLinks.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    stopScroll(open);
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id) => (event) => {
    event.preventDefault();
    setOpen(false);
    if (isHome) scrollToId(id);
    else navigate("/", { state: { scrollTo: id } });
  };

  return (
    <header
      className={`nav${scrolled ? " is-scrolled" : ""}${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}${isHome && atTop && !open ? " is-landing" : ""}`}
    >
      <div className="container">
      <div className="nav__bar">
        <a href="/" className="nav__brand" onClick={go("top")} aria-label="Muhammad Ali — back to top">
          <span className="nav__mark" aria-hidden="true">MA</span>
          <span className="nav__name">
            Muhammad Ali
            <small>{profile.role}</small>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={go(link.id)}
              className={active === link.id ? "is-active" : ""}
              aria-current={active === link.id ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <Magnetic strength={0.25}>
            <a href="/#contact" onClick={go("contact")} className="btn btn--ink btn--sm nav__cta">
              <span className="btn__dot" aria-hidden="true" />
              Let’s Talk
            </a>
          </Magnetic>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      </div>

      <div id="mobile-menu" className="nav__sheet" hidden={!open}>
        <nav aria-label="Mobile">
          {navLinks.map((link, index) => (
            <a key={link.id} href={`/#${link.id}`} onClick={go(link.id)} style={{ "--d": `${index * 60 + 80}ms` }}>
              <span className="nav__sheet-no">0{index + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav__sheet-foot" style={{ "--d": "420ms" }}>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span>{profile.location}</span>
        </div>
      </div>
    </header>
  );
}
