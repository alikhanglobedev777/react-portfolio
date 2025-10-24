import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Home.css";
import profile from "../assets/profile.jpeg";
import About from "./About";
import Blogs from "./Blogs";
import Contact from "./Contact";
import Projects from "./Projects";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
  
    const scrollToSection = () => {
      let sectionId =
        location.pathname === "/" ? "home" : location.pathname.replace("/", "");
      if (!sectionId) sectionId = "home";
      const el = document.getElementById(sectionId);
      if (el) {
        const nav = document.querySelector(".navbar");
        const navHeight = nav ? nav.offsetHeight : 70;
        const top =
          el.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };
  
    setTimeout(scrollToSection, 60);
  }, [location]);

  return (
    <>
   
      <section id="home" className="home">
        <div className="hero-top">
      
          <div className="badge">
            <span className="dot" /> Available for Freelance
          </div>

        
          <h1 className="hero-title">
            I AM <br />
            <span>Ali Khan</span>
          </h1>
        </div>

      
        <div className="home-grid">
        
          <div className="clients-box">
            <h3>
              Happy Clients <span className="symbol">♦</span> Fiverr{" "}
              <span className="symbol">♦</span> Upwork
            </h3>

            <div className="divider" />

            <div className="client-pics">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Client 1"
              />
              <img
                src="https://randomuser.me/api/portraits/women/45.jpg"
                alt="Client 2"
              />
              <img
                src="https://randomuser.me/api/portraits/men/14.jpg"
                alt="Client 3"
              />
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Client 4"
              />
            </div>

            <div className="reviews">
              ★★★★★ <span>100+ 5 Star Reviews</span>
            </div>
          </div>

         
          <div className="profile-column">
            <div className="profile-oval">
              <img src={profile} alt="Ali Khan" />
            </div>

            <div className="pill pill-frontend">MERN Stack Developer</div>
            <div className="pill pill-uiux">Software Engineer</div>
          </div>

          <div className="stats-column">
            <div className="stat">
              <div className="stat-num">5+</div>
              <div className="stat-label">Months of Experience</div>
            </div>
            <div className="stat">
              <div className="stat-num">10+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat">
              <div className="stat-num">3.00</div>
              <div className="stat-label">CGPA</div>
            </div>
            <div className="stat">
              <div className="stat-num">5+</div>
              <div className="stat-label">Publications</div>
            </div>
          </div>
        </div>
      </section>

   
      <section id="about">
        <About />
      </section>

      <section id="blogs">
        <Blogs />
      </section>

      <section id="projects">
        <Projects/>
      </section>

      <section id="contact">
        <Contact />
      </section>
    </>
  );
}
