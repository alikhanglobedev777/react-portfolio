import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
  FaWhatsapp
} from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (e, path, sectionId) => {
    e.preventDefault();
    navigate(path);
    setMenuOpen(false); // close mobile menu after click

    // small delay to ensure route/DOM updated before scrolling
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
  };

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

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
          <NavLink to="/" end className={linkClass} onClick={(e) => handleNavClick(e, "/", "home")}>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" className={linkClass} onClick={(e) => handleNavClick(e, "/about", "about")}>
            About
          </NavLink>
        </li>

        <li>
          <NavLink to="/blogs" className={linkClass} onClick={(e) => handleNavClick(e, "/blogs", "blogs")}>
            Blogs
          </NavLink>
        </li>

        <li>
          <NavLink to="/projects" className={linkClass} onClick={(e) => handleNavClick(e, "/projects", "projects")}>
            Projects
          </NavLink>
        </li>

        <li>
          <NavLink to="/contact" className={linkClass} onClick={(e) => handleNavClick(e, "/contact", "contact")}>
            Contact
          </NavLink>
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
