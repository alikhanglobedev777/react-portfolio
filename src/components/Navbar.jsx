import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
  FaWhatsapp
} from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar({ activeSection = "home" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, path, sectionId) => {
    e.preventDefault();
    setMenuOpen(false);

    navigate(path);

    // Scroll only if section exists (mainly for home page)
    if (sectionId) {
      setTimeout(() => {
        const nav = document.querySelector(".navbar");
        const navHeight = nav ? nav.offsetHeight : 70;
        const el = document.getElementById(sectionId);

        if (el) {
          const top =
            el.getBoundingClientRect().top +
            window.pageYOffset -
            navHeight -
            8;

          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 60);
    }
  };

  // ✅ Updated active link logic (route + section support)
const getActiveLinkClass = (sectionId, path) => {
  // If not on home page, use pathname to decide active link
  if (location.pathname !== "/") {
    return location.pathname === path ? "nav-link active" : "nav-link";
  }
  // On home page, use activeSection (scroll-based)
  return sectionId === activeSection ? "nav-link active" : "nav-link";
};

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">Ali Khan</div>

      {/* Hamburger */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") setMenuOpen(!menuOpen);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav Links */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <a
            href="#home"
            className={getActiveLinkClass("home", "/")}
            onClick={(e) => handleNavClick(e, "/", "home")}
          >
            Home
          </a>
        </li>

        <li>
          <a
            href="#resume"
            className={getActiveLinkClass("resume", "/resume")}
            onClick={(e) => handleNavClick(e, "/resume", "resume")}
          >
            Resume
          </a>
        </li>

        <li>
          <a
            href="#about"
            className={getActiveLinkClass("about", "/about")}
            onClick={(e) => handleNavClick(e, "/about", "about")}
          >
            About
          </a>
        </li>

        <li>
          <a
            href="#projects"
            className={getActiveLinkClass("projects", "/projects")}
            onClick={(e) => handleNavClick(e, "/projects", "projects")}
          >
            Projects
          </a>
        </li>

        <li>
          <a
            href="#blogs"
            className={getActiveLinkClass("blogs", "/blogs")}
            onClick={(e) => handleNavClick(e, "/blogs", "blogs")}
          >
            Blogs
          </a>
        </li>

        <li>
          <a
            href="#contact"
            className={getActiveLinkClass("contact", "/contact")}
            onClick={(e) => handleNavClick(e, "/contact", "contact")}
          >
            Contact
          </a>
        </li>
      </ul>

      {/* Social Icons */}
      <div className="social-icons">
        <a
          href="https://www.linkedin.com/in/ali-khan-mern/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn />
        </a>

        <a
          href="https://github.com/alikhanglobedev777"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>

        <a
          href="https://www.instagram.com/ali.khan.295"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>

        <a
          href="https://wa.me/923021848264"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;