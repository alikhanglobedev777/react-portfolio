import React, { useState } from "react";
import { FaHeart, FaExternalLinkAlt, FaCode, FaGlobe, FaCloudSun, FaExchangeAlt, FaShoppingCart, FaWarehouse, FaShieldAlt, FaBriefcase } from "react-icons/fa";
import "../styles/projects.css";

function Projects() {
  const [expanded, setExpanded] = useState(null);

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const projectData = [
    {
      id: 1,
      title: "AAA Service Directory",
      description:
        "AAA is a MERN stack service marketplace where clients can find and connect with local service providers. I implemented JWT-based authentication, role-based login/signup, and RESTful APIs for secure user and business management. Service providers can manage their profiles, and clients can explore services with a clean, responsive UI",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
      liveDemo: "https://aaa-7zb1.vercel.app/home",
      icon: <FaBriefcase />,
      category: "Full-Stack",
    },
    {
      id: 2,
      title: "Portfolio",
      description:
        "A modern and fully responsive portfolio website built using React and Vite, showcasing my skills, projects, and experience as a MERN Stack Developer. It includes smooth navigation, reusable components, and dynamic routing with react-router-dom. The design features a clean UI, interactive animations, and optimized performance for a seamless user experience. Integrated real project links, social media icons, and contact section for easy communication",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/94/MERN-logo.png",
      liveDemo: null,
      icon: <FaCode />,
      category: "Frontend",
    },
    {
      id: 3,
      title: "Flag Web",
      description:
        "FlagWeb is an interactive web application where users can explore flags and basic information of all countries around the world. It fetches real-time global data using a public API and displays country flags in a clean card UI. Users can search any country instantly and view details such as its capital, region, and population.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIrgOY6-0xuufy5n-1EKWTAbV3u9j3tBXcYQ&s",
      liveDemo: "https://flagweb.vercel.app/",
      icon: <FaGlobe />,
      category: "API Integration",
    },
    {
      id: 4,
      title: "Weatherly App",
      description:
        "A weather dashboard built with React that fetches live weather data using a third-party API. Users can search by city name and see current weather conditions, temperature, and other forecast details in a responsive layout.",
      image: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
      liveDemo: "https://weather-app-one-mu-83.vercel.app/",
      icon: <FaCloudSun />,
      category: "Utility",
    },
    {
      id: 5,
      title: "Currency Converter",
      description:
        "A currency conversion tool that allows users to convert amounts between multiple global currencies using live exchange rates. The app provides a simple UI and reliable conversion calculations.",
      image: "https://cdn-icons-png.flaticon.com/512/682/682601.png",
      liveDemo: "https://currency-converterapp.vercel.app/",
      icon: <FaExchangeAlt />,
      category: "Utility",
    },
    {
      id: 6,
      title: "VTEO AI (Contract Management System)",
      description:
        "AI-powered contract management platform with document workflows, backend services, and modern frontend UI.",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
      liveDemo: null,
      icon: <FaBriefcase />,
      category: "Full-Stack",
    },
    {
      id: 7,
      title: "JWT Authentication System",
      description: "Secure authentication system with role-based access and protected routes.",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
      liveDemo: "https://aaa-7zb1.vercel.app/home",
      icon: <FaShieldAlt />,
      category: "Backend",
    },
    {
      id: 8,
      title: "Sales Management System",
      description:
        "Full-stack system for managing sales, products, and reports with dynamic dashboards.",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
      liveDemo: "https://currency-converterapp.vercel.app/",
      icon: <FaShoppingCart />,
      category: "Full-Stack",
    },
    {
      id: 9,
      title: "Inventory Management System",
      description:
        "Inventory tracking system with CRUD operations and database integration.",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
      liveDemo: "https://flagweb.vercel.app/",
      icon: <FaWarehouse />,
      category: "Full-Stack",
    },
    {
      id: 10,
      title: "Weatherly App (Key Project)",
      description:
        "Weather app built using React, Axios, and a third-party API with Context API for state management.",
      image: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
      liveDemo: "https://weather-app-one-mu-83.vercel.app/",
      icon: <FaCloudSun />,
      category: "Frontend",
    },
  ];

  const totalProjects = projectData.length;

  return (
    <section className="projects-section" id="projects">
      <h2 className="section-title">My Projects</h2>
      <p className="projects-count">Total Projects: {totalProjects}</p>

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
                href={project.liveDemo || "#"}
                target={project.liveDemo ? "_blank" : undefined}
                rel={project.liveDemo ? "noopener noreferrer" : undefined}
                className="btn-demo"
                aria-disabled={!project.liveDemo}
                onClick={(event) => {
                  if (!project.liveDemo) {
                    event.preventDefault();
                  }
                }}
              >
                {project.liveDemo ? "Live Demo" : "Demo Soon"}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;
