import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profile from "../assets/profile.jpeg";
import "../styles/Contact.css";

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const sendEmail = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      );

      window.location.href = `mailto:ak.alikhan.5911@gmail.com?subject=${subject}&body=${body}`;
      toast.success("Message draft opened in your email app.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsOpen(false);
    } catch (error) {
      console.log("Mail action failed:", error);
      toast.error("Failed to open your email app. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="contact-card">
        <img src={profile} alt="profile" className="contact-avatar" />
        <h2 className="contact-title">If you have any project in mind</h2>
        <p className="contact-sub">
          Let&apos;s work together to bring your vision to life.
        </p>

        <div className="contact-quicklinks">
          <a className="contact-link" href="mailto:ak.alikhan.5911@gmail.com">Email</a>
          <a className="contact-link" href="tel:+923021848264">Call</a>
          <a
            className="contact-link"
            href="https://wa.me/923021848264"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>

        <button className="contact-btn" onClick={() => setIsOpen(true)}>
          Hire Me
        </button>
      </div>

      {isOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <h3 className="modal-title" id="contact-modal-title">Let&apos;s Work Together</h3>

            <form className="contact-form" onSubmit={sendEmail}>
              <div className="field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              <div className="field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Your Message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Opening..." : "Send Message"}
              </button>
            </form>

            <button className="close-btn" onClick={() => setIsOpen(false)}>
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
