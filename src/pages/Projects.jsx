import React, { useState } from "react";
import "../styles/projects.css";

function Projects() {
  const [expanded, setExpanded] = useState(null);

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const projectData = [
    {
      id: 1,
      title: "AAA service directory",
      description:
        "AAA is a MERN stack service marketplace where clients can find and connect with local service providers. I implemented JWT-based authentication, role-based login/signup, and RESTful APIs for secure user and business management. Service providers can manage their profiles, and clients can explore services with a clean, responsive UI",
      image: "https://aaa-7zb1.vercel.app/favicon_transbg.png",
      liveDemo: "https://aaa-7zb1.vercel.app/home",
    },
    {
      id: 2,
      title: "Portfolio",
      description:
        "A modern and fully responsive portfolio website built using React and Vite, showcasing my skills, projects, and experience as a MERN Stack Developer. It includes smooth navigation, reusable components, and dynamic routing with react-router-dom. The design features a clean UI, interactive animations, and optimized performance for a seamless user experience. Integrated real project links, social media icons, and contact section for easy communication",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/94/MERN-logo.png",
      liveDemo: "https://react-portfolio-omega-sable-30.vercel.app/",
    },
    {
      id: 3,
      title: "Flag Web",
      description:
        "FlagWeb is an interactive web application where users can explore flags and basic information of all countries around the world. It fetches real-time global data using a public API and displays country flags in a clean card UI. Users can search any country instantly and view details such as its capital, region, and population.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIrgOY6-0xuufy5n-1EKWTAbV3u9j3tBXcYQ&s",
      liveDemo: "https://flagweb.vercel.app/",
    },
  ];

  return (
    <section className="projects-section" id="projects">
      <h2 className="section-title">My Projects</h2>

      <div className="projects-grid">
        {projectData.map((project) => {
          const isExpanded = expanded === project.id;
          const shortDesc =
            project.description.slice(0, 130) + "...";

          return (
            <div className="project-card" key={project.id}>
              <img
                src={project.image}
                alt={project.title}
                className="project-img"
              />
              <h3>{project.title}</h3>
              <p className="project-description">
                {isExpanded ? project.description : shortDesc}
              </p>

              <button
                className="read-more-btn"
                onClick={() => handleToggle(project.id)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>

              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-demo"
              >
                Live Demo
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;
