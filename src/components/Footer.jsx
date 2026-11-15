import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navLinks, profile, socials } from "../data/content";
import { gsap, prefersReducedMotion, scrollToId } from "../lib/motion";

function useLahoreTime() {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Karachi",
    }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
}

const FIRST = "Muhammad";
const LAST = "Ali";

export default function Footer() {
  const time = useLahoreTime();
  const rootRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Wordmark letters rise into place when the footer scrolls in.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".footer__char", {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { trigger: ".footer__word", start: "top 95%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [location.pathname]);

  const go = (id) => (event) => {
    event.preventDefault();
    if (location.pathname === "/") scrollToId(id);
    else navigate("/", { state: { scrollTo: id } });
  };

  const connect = [socials.linkedin, socials.github, socials.whatsapp];

  return (
    <footer ref={rootRef} className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="footer__mark" aria-hidden="true">MA</span>
            <p>
              Software engineer building business systems and web products in Lahore, Pakistan.
            </p>
            <p className="footer__status">
              <span className="pulse pulse--ok" aria-hidden="true" />
              Available for work
            </p>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <h2>Navigate</h2>
            <ul>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`/#${link.id}`} onClick={go(link.id)}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h2>Connect</h2>
            <ul>
              {connect.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    {social.label} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.resumeUrl} download="Muhammad-Ali-Resume.pdf">
                  Résumé <span aria-hidden="true">↓</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h2>Contact</h2>
            <ul>
              <li><a href={socials.email.href} className="footer__email">{profile.email}</a></li>
              <li className="footer__meta">{profile.phoneDisplay}</li>
              <li className="footer__meta">Lahore · {time} PKT</li>
            </ul>
          </div>
        </div>

        <p className="footer__word" aria-hidden="true">
          <span className="footer__w">
            {FIRST.split("").map((char, i) => (
              <span className="footer__mask" key={i}>
                <span className="footer__char">{char}</span>
              </span>
            ))}
          </span>
          <span className="footer__w footer__w--serif">
            <span className="footer__mask footer__mask--word">
              <span className="footer__char">
                {LAST}
                <span className="footer__dot" />
              </span>
            </span>
          </span>
        </p>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span className="footer__built">Designed &amp; built by Muhammad Ali</span>
          <button type="button" className="footer__top-btn" onClick={() => scrollToId("top")}>
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
