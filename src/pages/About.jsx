import React from "react";
import "../styles/About.css";

export default function About() {
  return (
    <section className="about">

      <div className="about-header">
        <div>
          <h2 className="about-title">
            Muhammad Ali — <span className="highlight">MERN Stack Developer</span>
          </h2>
          <p className="about-meta">
            Lahore, Pakistan • <a href="tel:+923021848264">0302-1848264</a> • <a href="mailto:ak.alikhan.5911@gmail.com">ak.alikhan.5911@gmail.com</a>
          </p>
          <p className="about-intro">
            MERN Stack Developer with hands-on experience in building scalable full-stack applications using MongoDB, Express.js, React.js, and Node.js. I’m currently working on modern full-stack systems using tRPC, Drizzle ORM, Docker, and PostgreSQL, and I’m familiar with TypeScript and NestJS basics. I build responsive, production-ready UIs using React (with Mantine) and write clean, efficient code.
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

    
      <h3 className="section-heading">Core Expertise</h3>
      <div className="offerings">
        <div className="offering-card">
          <h4>Modern Frontends</h4>
          <p>Responsive, accessible React UIs using Mantine, Tailwind, and clean component design.</p>
        </div>
        <div className="offering-card">
          <h4>Scalable Backends</h4>
          <p>Building Node/Express services with PostgreSQL, Drizzle ORM, and Docker deployment.</p>
        </div>
        <div className="offering-card">
          <h4>Type-Safe APIs & Auth</h4>
          <p>Type-safe APIs with tRPC, JWT authentication, and secure REST endpoints.</p>
        </div>
      </div>

     
      <h3 className="section-heading">Work Experience</h3>
      <div className="experience-section">
        <div className="experience-badge">EXPERIENCE</div>

        <div className="experience-item">
          <img
            src="https://products.solutyics.com/assets/Solutyics-WAYQjS2P.png"
            alt="Solutyics"
            className="company-logo"
          />
          <div className="experience-details">
            <h4>MERN Stack Developer</h4>
            <span className="company-name">Solutyics</span>
            <p>
              Working on VTEO AI, a contract management platform with automated workflows and document processing.
            </p>
            <ul className="experience-bullets">
              <li>Building scalable backend services with Node.js, Express.js, and PostgreSQL.</li>
              <li>Using tRPC for type-safe API communication and Drizzle ORM for data modeling.</li>
              <li>Containerizing applications with Docker and ensuring consistent deployments.</li>
              <li>Developing modern frontend interfaces with React and Mantine UI.</li>
            </ul>
          </div>
          <div className="experience-period">Feb 2026 – Present</div>
        </div>

        <div className="experience-item">
          <img
            src="https://www.devfied.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FdevfiedDarkLogo.dca05d3c.png&w=2048&q=75"
            alt="Devfied"
            className="company-logo"
          />
          <div className="experience-details">
            <h4>MERN Stack Developer Intern</h4>
            <span className="company-name">Devfied Software House</span>
            <p>
              Built full-stack applications using MongoDB, Express.js, React, and Node.js while following agile practices.
            </p>
            <ul className="experience-bullets">
              <li>Implemented JWT authentication, secure routes, and RESTful APIs.</li>
              <li>Designed responsive UIs using React and Tailwind CSS.</li>
              <li>Integrated third-party APIs and handled asynchronous flows with Axios.</li>
              <li>Collaborated using Git workflows and code reviews.</li>
            </ul>
          </div>
          <div className="experience-period">July 2025 – Dec 2025</div>
        </div>
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
            <h4>BS Information Technology</h4>
            <span className="company-name">
              Govt. Graduate College Township (Affiliated with Punjab University)
            </span>
            <p>Currently pursuing BSIT (2021-2025).</p>
          </div>
          <div className="experience-period">2021-2025</div>
        </div>

        <div className="experience-item">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4257/4257483.png"
            alt="FYP"
            className="company-logo"
          />
          <div className="experience-details">
            <h4>Final Year Project: AAA Directory</h4>
            <p>
              Successfully developed and published on{" "}
              <span className="highlight">13th Sep 2025</span>.
            </p>
          </div>
          <div className="experience-period">2025</div>
        </div>
      </div>

     
      <h3 className="section-heading">Tools & Technologies</h3>
      <div className="tools-section">
        <div className="tool-card">
          <img src="https://cdn-icons-png.flaticon.com/512/1126/1126012.png" alt="React" className="tool-icon"/>
          <h4>React</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "75%" }}></div></div>
          <span className="progress-text">75%</span>
        </div>

        <div className="tool-card">
          <img src="https://cdn-icons-png.flaticon.com/512/919/919825.png" alt="Node.js" className="tool-icon"/>
          <h4>Node.js</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "70%" }}></div></div>
          <span className="progress-text">70%</span>
        </div>

        <div className="tool-card">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express.js" className="tool-icon"/>
          <h4>Express.js</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "80%" }}></div></div>
          <span className="progress-text">80%</span>
        </div>

        <div className="tool-card">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDb" className="tool-icon"/>
          <h4>MongoDb</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "65%" }}></div></div>
          <span className="progress-text">65%</span>
        </div>

        <div className="tool-card">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" className="tool-icon"/>
          <h4>PostgreSQL</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "70%" }}></div></div>
          <span className="progress-text">70%</span>
        </div>

        <div className="tool-card">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="tool-icon"/>
          <h4>Docker</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "60%" }}></div></div>
          <span className="progress-text">60%</span>
        </div>

        <div className="tool-card">
          <img src="https://cdn-icons-png.flaticon.com/512/5968/5968560.png" alt="TypeScript" className="tool-icon"/>
          <h4>TypeScript</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "55%" }}></div></div>
          <span className="progress-text">55%</span>
        </div>
      </div>

    
      <h3 className="section-heading">Measuring Success</h3>
      <div className="success-metrics">
        <div className="metric-card"><h2>8+</h2><p>Months of Experience</p></div>
        <div className="metric-card"><h2>10+</h2><p>Projects Completed</p></div>
        <div className="metric-card"><h2>1+</h2><p>5 Star Reviews</p></div>
        <div className="metric-card"><h2>200+</h2><p>Hours of Coding</p></div>
      </div>
    </section>
  );
}
