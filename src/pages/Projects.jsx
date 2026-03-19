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
<<<<<<< HEAD
      title: "VTEO AI — Contract Management",
      description:
        "Built a contract management platform with automated workflows, document processing, and secure user roles. Implemented type-safe APIs using tRPC and managed data with Drizzle ORM.",
      image: "https://via.placeholder.com/80x80.png?text=VTEO",
      liveDemo: "#",
    },
    {
      id: 2,
      title: "JWT Auth System",
      description:
        "Developed a role-based authentication system with JWT tokens, secure routes, and token refresh flow. Includes admin/user dashboards and secure password handling.",
      image: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png",
      liveDemo: "#",
    },
    {
      id: 3,
      title: "Sales Management System",
      description:
        "A full-stack sales dashboard for managing products, orders, and reports. Built dynamic charts, filters, and CSV exports with real-time data updates.",
      image: "https://cdn-icons-png.flaticon.com/512/3185/3185691.png",
      liveDemo: "#",
    },
    {
      id: 4,
      title: "Inventory Management System",
      description:
        "Designed an inventory tracking system with CRUD operations, stock alerts, and batch processing using MERN stack architecture.",
      image: "https://cdn-icons-png.flaticon.com/512/2488/2488739.png",
      liveDemo: "#",
    },
    {
      id: 5,
      title: "Weatherly App",
      description:
        "A weather forecast app fetching real-time data from a third-party API. Built with React, Axios, and Context API for global state management.",
      image: "https://cdn-icons-png.flaticon.com/512/1116/1116453.png",
      liveDemo: "#",
    },
    {
      id: 6,
      title: "Currency Converter",
      description:
        "A real-time currency converter app that fetches live exchange rates from a public API. Built with React for responsive UI and accurate conversions.",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135706.png",
      liveDemo: "https://currency-converterapp.vercel.app/",
    },
    {
      id: 6,
=======
>>>>>>> 392240ab03488f48f1bae68c4d7ab3b9ecd213b7
      title: "AAA service directory",
      description:
        "AAA is a MERN stack service marketplace where clients can find and connect with local service providers. I implemented JWT-based authentication, role-based login/signup, and RESTful APIs for secure user and business management. Service providers can manage their profiles, and clients can explore services with a clean, responsive UI",
      image: "https://aaa-7zb1.vercel.app/favicon_transbg.png",
      liveDemo: "https://aaa-7zb1.vercel.app/home",
    },
    {
<<<<<<< HEAD
      id: 7,
=======
      id: 2,
>>>>>>> 392240ab03488f48f1bae68c4d7ab3b9ecd213b7
      title: "Portfolio",
      description:
        "A modern and fully responsive portfolio website built using React and Vite, showcasing my skills, projects, and experience as a MERN Stack Developer. It includes smooth navigation, reusable components, and dynamic routing with react-router-dom. The design features a clean UI, interactive animations, and optimized performance for a seamless user experience. Integrated real project links, social media icons, and contact section for easy communication",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/94/MERN-logo.png",
      liveDemo: "https://react-portfolio-omega-sable-30.vercel.app/",
    },
    {
<<<<<<< HEAD
      id: 8,
=======
      id: 3,
>>>>>>> 392240ab03488f48f1bae68c4d7ab3b9ecd213b7
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
<<<<<<< HEAD
            <div className={`project-card ${isExpanded ? "expanded" : ""}`} key={project.id}>
=======
            <div className="project-card" key={project.id}>
>>>>>>> 392240ab03488f48f1bae68c4d7ab3b9ecd213b7
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

<<<<<<< HEAD
              {project.liveDemo ? (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-demo"
                >
                  Live Demo
                </a>
              ) : (
                <button className="btn-demo disabled" disabled>
                  Live Demo
                </button>
              )}
=======
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-demo"
              >
                Live Demo
              </a>
>>>>>>> 392240ab03488f48f1bae68c4d7ab3b9ecd213b7
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;
