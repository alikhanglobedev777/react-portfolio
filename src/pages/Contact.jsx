import React, { useState } from "react";
import "../styles/Contact.css";
import profile from "../assets/profile.jpeg";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send email function
  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send main email
      await emailjs.send(
        "service_blzdbfc",
        "template_nac9ebv",
        formData,
        "lJmNzPr9gaszJ_mfC"
      );

      // Send auto-reply email (errors here won't affect main toast)
      emailjs.send(
        "service_blzdbfc",
        "template_auto",
        formData,
        "lJmNzPr9gaszJ_mfC"
      ).catch((err) => console.log("Auto-reply failed:", err));

      // Success toast
      toast.success("✅ Message Sent Successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

      // Close modal after 2 seconds
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      console.log("Main email failed:", err);
      toast.error("❌ Failed to send message. Try again.");
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
          Let’s work together to bring your vision to life.
        </p>

        <div className="contact-quicklinks">
          <a className="contact-link" href="mailto:ak.alikhan.5911@gmail.com">Email</a>
          <a className="contact-link" href="tel:+923021848264">Call</a>
          <a className="contact-link" href="https://wa.me/923021848264" target="_blank" rel="noopener noreferrer">
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
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <h3 className="modal-title" id="contact-modal-title">Let’s Work Together</h3>

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
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
