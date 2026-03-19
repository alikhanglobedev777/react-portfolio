import React from "react";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaDocker,
  FaHeart,
  FaExternalLinkAlt,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";
import { SiMongodb, SiPostgresql, SiTailwindcss, SiTypescript, SiGithub, SiDocker } from "react-icons/si";
import "../styles/About.css";

export default function About() {
  const keyProjects = [
    {
      title: "VTEO AI (Contract Management System)",
      description:
        "AI-powered contract management platform with document workflows, backend services, and modern frontend UI.",
      link: "https://react-portfolio-omega-sable-30.vercel.app/", // placeholder demo link
    },
    {
      title: "JWT Authentication System",
      description: "Secure authentication system with role-based access and protected routes.",
      link: "https://aaa-7zb1.vercel.app/home",
    },
    {
      title: "Sales Management System",
      description:
        "Full-stack system for managing sales, products, and reports with dynamic dashboards.",
      link: "https://currency-converterapp.vercel.app/",
    },
    {
      title: "Inventory Management System",
      description:
        "Inventory tracking system with CRUD operations and database integration.",
      link: "https://flagweb.vercel.app/",
    },
    {
      title: "Weatherly App",
      description:
        "Weather app built using React, Axios, and a third-party API with Context API for state management.",
      link: "https://weather-app-one-mu-83.vercel.app/",
    },
  ];

  const skills = [
    {
      id: "frontend",
      icon: <FaReact />,
      title: "Frontend",
      details: "React.js, JavaScript (ES6+), TypeScript, Mantine UI, HTML5, CSS3, Tailwind CSS",
    },
    {
      id: "backend",
      icon: <FaNodeJs />,
      title: "Backend",
      details: "Node.js, Express.js, NestJS (Basics), tRPC",
    },
    {
      id: "database",
      icon: <FaDatabase />,
      title: "Database",
      details: "MongoDB, PostgreSQL, Drizzle ORM",
    },
    {
      id: "tools",
      icon: <FaDocker />,
      title: "Tools & Concepts",
      details: "Docker, Git, Postman, VS Code, REST APIs, JWT Authentication, Full Stack Architecture",
    },
  ];

  return (
    <section className="about fade-in">
      <div className="about-header">
        <div>
          <h2 className="about-title">Muhammad Ali</h2>
          <p className="about-subtitle">MERN Stack Developer</p>
          <p className="about-contact">
            Lahore, Pakistan • <a href="tel:+923021848264">0302-1848264</a> •{' '}
            <a href="mailto:ak.alikhan.5911@gmail.com">ak.alikhan.5911@gmail.com</a>
          </p>

          <p className="about-intro">
            MERN Stack Developer with hands-on experience in building scalable full-stack
            applications using MongoDB, Express.js, React.js, and Node.js. Currently working on
            modern full-stack systems using tRPC, Drizzle ORM, Docker, and PostgreSQL. Familiar
            with TypeScript and basic NestJS architecture. Experienced in building responsive UIs
            using React with Mantine UI library and implementing clean, efficient, and
            production-ready code.
          </p>
        </div>

        <div className="about-actions top-actions">
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn">
            View CV
          </a>
          <a href="/resume.pdf" download className="btn">
            Download CV
          </a>
        </div>
      </div>

      <h3 className="section-heading">Professional Experience</h3>
      <div className="experience-section">
        <div className="experience-badge">EXPERIENCE</div>

        <div className="experience-item">
          <div className="experience-icon">
            <FaBriefcase />
          </div>
          <div className="experience-details">
            <h4>MERN Stack Developer</h4>
            <span className="company-name">Solutyics</span>
            <p>
              Working on VTEO AI, a contract management platform for handling automated workflows and document
              processing. Developing scalable backend services using Node.js, Express.js, and PostgreSQL. Utilizing
              tRPC for type-safe API communication and Drizzle ORM for database management. Containerizing applications
              using Docker and building modern frontend interfaces using React.js and Mantine UI components.
            </p>
          </div>
          <div className="experience-period">Feb 2026 – Present</div>
        </div>

        <div className="experience-item">
          <div className="experience-icon">
            <FaGraduationCap />
          </div>
          <div className="experience-details">
            <h4>MERN Stack Developer Intern</h4>
            <span className="company-name">Devfied Software House</span>
            <p>
              Developed full-stack applications using MongoDB, Express.js, React.js, and Node.js. Built RESTful APIs for
              authentication, CRUD operations, and data management with JWT-based authentication and secure routes.
              Designed responsive UI using React.js and Tailwind CSS, integrated third-party APIs, and collaborated using
              Git in an Agile team environment.
            </p>
          </div>
          <div className="experience-period">July 2025 – Dec 2025</div>
        </div>
      </div>

      <h3 className="section-heading">Key Projects</h3>
      <div className="about-projects-grid">
        {keyProjects.map((project) => (
          <div className="about-project-card" key={project.title}>
            <h4>{project.title}</h4>
            <p>{project.description}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-demo btn-demo--icon"
            >
              <FaHeart className="btn-icon" />
              Live Demo
              <FaExternalLinkAlt className="btn-icon btn-icon--right" />
            </a>
          </div>
        ))}
      </div>

      <h3 className="section-heading">Education</h3>
      <div className="experience-section">
        <div className="experience-badge">EDUCATION</div>

        <div className="experience-item">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            alt="University"
            className="company-logo"
          />
          <div className="experience-details">
            <h4>BS Information Technology (Software Engineering)</h4>
            <span className="company-name">Govt. College Township (PU Affiliated), Lahore</span>
            <p>CGPA: 3.00</p>
          </div>
          <div className="experience-period">2021 – Aug 2025</div>
        </div>
      </div>

      <h3 className="section-heading">Technical Skills</h3>
      <div className="tools-section">
        {skills.map((skill) => (
          <div className="tool-card" key={skill.id}>
            <div className="skill-header">
              <span className="skill-icon">{skill.icon}</span>
              <h4>{skill.title}</h4>
            </div>
            <p>{skill.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
