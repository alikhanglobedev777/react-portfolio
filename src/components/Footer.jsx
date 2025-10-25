import React from "react";
import "../styles/Footer.css";
import { FaLinkedinIn, FaGithub, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">Ali Khan</div>

        {/* Links */}
        <ul className="footer-links">
          <li>
            <NavLink to="/" end className="footer-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="footer-link">
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/blogs" className="footer-link">
              Blogs
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="footer-link">
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" className="footer-link">
              Projects
            </NavLink>
          </li>
        </ul>

        {/* Socials */}
        <div className="footer-socials">
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          <a href="#" aria-label="GitHub"><FaGithub /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Ali Khan. All Rights Reserved.
      </div>
    </footer>
  );
}
