import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navLinks, profile, socials } from "../data/content";
import { scrollToId } from "../lib/motion";
import Wordmark from "./Wordmark";

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

export default function Footer() {
  const time = useLahoreTime();
  const location = useLocation();
  const navigate = useNavigate();

  const go = (id) => (event) => {
    event.preventDefault();
    if (location.pathname === "/") scrollToId(id);
    else navigate("/", { state: { scrollTo: id } });
  };

  const connect = [socials.linkedin, socials.github, socials.whatsapp];

  return (
    <footer className="footer">
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
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  Résumé <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (PDF, opens in a new tab)</span>
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

        <Wordmark key={location.pathname} />

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
