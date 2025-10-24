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

        <button className="contact-btn" onClick={() => setIsOpen(true)}>
          Hire Me
        </button>
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Let’s Work Together</h3>

            <form className="contact-form" onSubmit={sendEmail}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                value={formData.subject}
                onChange={handleChange}
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
              />

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
