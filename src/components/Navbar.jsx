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
    setMenuOpen(false); // close mobile menu after click

    // Navigate to the path
    navigate(path);

    // Scroll to section ID if provided (with a small delay for DOM to update)
    if (sectionId) {
      setTimeout(() => {
        const nav = document.querySelector(".navbar");
        const navHeight = nav ? nav.offsetHeight : 70;
        const el = document.getElementById(sectionId);
        if (el) {
          const top =
            el.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 60);
    }
  };

  // Determine active link based on current active section (from IntersectionObserver)
  const getActiveLinkClass = (sectionId) => {
    return sectionId === activeSection ? "nav-link active" : "nav-link";
  };

  return (
    <nav className="navbar">
      {/* Left Brand */}
      <div className="navbar-brand">Ali Khan</div>

      {/* Hamburger Menu */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") setMenuOpen(!menuOpen); }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Center Links (desktop) */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <a href="#home" className={getActiveLinkClass("home")} onClick={(e) => handleNavClick(e, "/", "home")}>
            Home
          </a>
        </li>
          <li>
          <a
            href="#resume"
            className={getActiveLinkClass("resume")}
            onClick={(e) => handleNavClick(e, "/resume", "resume")}
          >
            Resume
          </a>
        </li>

        <li>
          <a href="#about" className={getActiveLinkClass("about")} onClick={(e) => handleNavClick(e, "/about", "about")}>
            About
          </a>
        </li>

        <li>
          <a
            href="#projects"
            className={getActiveLinkClass("projects")}
            onClick={(e) => handleNavClick(e, "/projects", "projects")}
          >
            Projects
          </a>
        </li>

        <li>
          <a href="#blogs" className={getActiveLinkClass("blogs")} onClick={(e) => handleNavClick(e, "/blogs", "blogs")}>
            Blogs
          </a>
        </li>

        <li>
          <a
            href="#contact"
            className={getActiveLinkClass("contact")}
            onClick={(e) => handleNavClick(e, "/contact", "contact")}
          >
            Contact
          </a>
        </li>
      
      </ul>

      {/* Right Social Icons */}
      <div className="social-icons">
        <a href="https://www.linkedin.com/in/ali-khan-mern/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedinIn />
        </a>
        <a href="https://github.com/alikhanglobedev777" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href="https://www.instagram.com/ali.khan.295?igsh=MWpnNGU0aGk0bmliNg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="https://wa.me/923021848264" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <FaWhatsapp />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
