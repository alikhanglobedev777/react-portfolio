import React from "react";
import "../styles/About.css";

export default function About() {
  return (
    <section className="about">

      <div className="about-header">
        <div>
          <h2 className="about-title">About Me</h2>
          <p className="about-intro">
            I`m <span className="highlight">Ali Khan</span>, a passionate{" "}
            <span className="highlight">MERN Stack Developer</span> skilled in React,
            Node.js, Express, MongoDB, C++, CSS, and Python.  
            I`ve completed a 3-month internship at <span className="highlight">Devfied</span>,
            where I built full-stack applications and RESTful APIs.
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

    
      <h3 className="section-heading">What I Offer</h3>
      <div className="offerings">
        <div className="offering-card">
          <h4>Frontend Development</h4>
          <p>Building responsive and modern UIs with React & CSS.</p>
        </div>
        <div className="offering-card">
          <h4>Backend Development</h4>
          <p>Developing secure and scalable backends with Node.js & Express.</p>
        </div>
        <div className="offering-card">
          <h4>RESTful APIs</h4>
          <p>Designing and implementing efficient REST APIs with MongoDB.</p>
        </div>
      </div>

     
      <h3 className="section-heading">Work Experience</h3>
      <div className="experience-section">
        <div className="experience-badge">EXPERIENCE</div>

        <div className="experience-item">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
            alt="Devfied"
            className="company-logo"
          />
          <div className="experience-details">
            <h4>Mern stack Developer</h4>
            <span className="company-name">Devfied</span>
            <p>Completed a 3-month internship at Devfied as a MERN Stack Developer, contributing to front-end and back-end development of dynamic web applications.</p>
          </div>
          <div className="experience-period">June 2025 – Sep 2025</div>
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
          <img src="https://cdn-icons-png.flaticon.com/512/919/919825.png
" alt="Node.js" className="tool-icon"/>
          <h4>Node.js</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "70%" }}></div></div>
          <span className="progress-text">70%</span>
        </div>

        <div className="tool-card">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg
" alt="Express.js" className="tool-icon"/>
          <h4>Express.js</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "80%" }}></div></div>
          <span className="progress-text">80%</span>
        </div>

        <div className="tool-card">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg

" alt="MongoDb" className="tool-icon"/>
          <h4>MongoDb</h4>
          <div className="progress-bar"><div className="progress" style={{ width: "65%" }}></div></div>
          <span className="progress-text">65%</span>
        </div>
      </div>

    
      <h3 className="section-heading">Measuring Success</h3>
      <div className="success-metrics">
        <div className="metric-card"><h2>5+</h2><p>Months of Experience</p></div>
        <div className="metric-card"><h2>10+</h2><p>Projects Completed</p></div>
        <div className="metric-card"><h2>1+</h2><p>5 Star Reviews</p></div>
        <div className="metric-card"><h2>200+</h2><p>Hours of Coding</p></div>
      </div>
    </section>
  );
}
