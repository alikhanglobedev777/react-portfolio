import React from "react";
import { FaReact, FaNodeJs, FaDatabase, FaDocker } from "react-icons/fa";
import { SiTailwindcss, SiTypescript, SiMongodb, SiPostgresql, SiGithub } from "react-icons/si";
import "../styles/Resume.css";

export default function Resume({ variant = "page" }) {
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
    <section
      className={[
        "resume",
        variant === "page" ? "resume--page fade-in" : "resume--embedded",
      ].join(" ")}
    >
      <div className="resume-header">
        <div>
          <h2 className="resume-title">Muhammad Ali</h2>
          <p className="resume-subtitle">MERN Stack Developer</p>
          <p className="resume-contact">
            Lahore, Pakistan • <a href="tel:+923021848264">0302-1848264</a> •{' '}
            <a href="mailto:ak.alikhan.5911@gmail.com">ak.alikhan.5911@gmail.com</a>
          </p>
        </div>

        <div className="resume-actions">
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn">
            View Resume PDF
          </a>
          <a href="/resume.pdf" download className="btn">
            Download Resume
          </a>
        </div>
      </div>

      <div className="resume-section">
        <h3 className="section-heading">Professional Summary</h3>
        <p className="resume-text">
          MERN Stack Developer with hands-on experience in building scalable full-stack applications using MongoDB,
          Express.js, React.js, and Node.js. Currently working on modern full-stack systems using tRPC, Drizzle ORM,
          Docker, and PostgreSQL. Familiar with TypeScript and basic NestJS architecture. Experienced in building
          responsive UIs using React with Mantine UI library and implementing clean, efficient, and production-ready code.
        </p>
      </div>

      <div className="resume-section">
        <h3 className="section-heading">Professional Experience</h3>
        <div className="resume-item">
          <div className="resume-item-header">
            <div>
              <h4>MERN Stack Developer</h4>
              <span className="company-name">Solutyics</span>
            </div>
            <span className="resume-date">Feb 2026 – Present</span>
          </div>
          <ul className="resume-list">
            <li>Working on VTEO AI, a contract management platform for automated workflows and document processing.</li>
            <li>Developing scalable backend services using Node.js, Express.js, and PostgreSQL.</li>
            <li>Utilizing tRPC for type-safe API communication and Drizzle ORM for database management.</li>
            <li>Containerizing applications using Docker and building modern frontend interfaces using React.js and Mantine UI.</li>
          </ul>
        </div>

        <div className="resume-item">
          <div className="resume-item-header">
            <div>
              <h4>MERN Stack Developer Intern</h4>
              <span className="company-name">Devfied Software House, Johar Town, Lahore</span>
            </div>
            <span className="resume-date">July 2025 – Dec 2025</span>
          </div>
          <ul className="resume-list">
            <li>Developed full-stack applications using MongoDB, Express.js, React.js, and Node.js.</li>
            <li>Built RESTful APIs for authentication, CRUD operations, and data management with JWT-based security.</li>
            <li>Designed responsive UI with React.js and Tailwind CSS; integrated third-party APIs using Axios.</li>
            <li>Collaborated using Git and followed Agile development practices.</li>
          </ul>
        </div>
      </div>

      <div className="resume-section">
        <h3 className="section-heading">Key Projects</h3>
        <ul className="resume-list">
          <li>
            <strong>VTEO AI</strong> (Contract Management System): AI-powered contract management platform with document workflows and modern frontend UI.
          </li>
          <li>
            <strong>JWT Authentication System:</strong> Secure authentication system with role-based access and protected routes.
          </li>
          <li>
            <strong>Sales Management System:</strong> Full-stack system for managing sales, products, and reports with dynamic dashboards.
          </li>
          <li>
            <strong>Inventory Management System:</strong> Inventory tracking with CRUD operations and database integration.
          </li>
          <li>
            <strong>Weatherly App:</strong> Weather application using React, Axios, and a third-party API with Context API.
          </li>
        </ul>
      </div>

      <div className="resume-section">
        <h3 className="section-heading">Education</h3>
        <div className="resume-item">
          <div className="resume-item-header">
            <div>
              <h4>BS Information Technology (Software Engineering)</h4>
              <span className="company-name">Govt. College Township (PU Affiliated), Lahore</span>
            </div>
            <span className="resume-date">2021 – Aug 2025</span>
          </div>
          <p className="resume-text">CGPA: 3.00</p>
        </div>
      </div>

      <div className="resume-section">
        <h3 className="section-heading">Technical Skills</h3>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill-card" key={skill.id}>
              <div className="skill-header">
                <span className="skill-icon">{skill.icon}</span>
                <h4>{skill.title}</h4>
              </div>
              <p>{skill.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
