import { useEffect, useRef, useState } from "react";
import Magnetic from "../components/Magnetic";
import SplitWords from "../components/SplitWords";
import { profile, socials } from "../data/content";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status === "error") setStatus("idle");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = socials.email.href;
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setFeedback("");
    controllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controllerRef.current.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Something went wrong. Please email me directly.");
      }
      setStatus("sent");
      setFeedback("Thanks — your message is in my inbox. I’ll reply soon.");
      setForm(EMPTY);
    } catch (error) {
      if (error.name === "AbortError") return;
      setStatus("error");
      setFeedback(error.message || "Couldn’t send right now. Please email me directly.");
    }
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="contact__bg" aria-hidden="true">
        <span className="blob blob--a" />
        <span className="blob blob--b" />
      </div>

      <div className="container contact__layout">
        <div className="contact__intro">
          <p className="eyebrow" data-reveal="up"><span className="eyebrow__no">09</span><span data-scramble>Contact</span></p>
          <SplitWords as="h2" id="contact-title" className="contact__title display" text="Have a problem *worth solving?*" />
          <p className="section-lede" data-reveal="up">
            Whether you’re building a new product, improving an existing platform or hiring for a full stack or React role — I’d love to hear about it.
          </p>

          <div className="contact__email" data-reveal="up">
            <Magnetic strength={0.2}>
              <a href={socials.email.href} className="contact__mail" data-cursor="Write">
                {profile.email}
              </a>
            </Magnetic>
            <button type="button" className="btn btn--ghost btn--sm" onClick={copyEmail} aria-live="polite">
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <ul className="contact__links" data-reveal="stagger">
            {[socials.linkedin, socials.github, socials.whatsapp].map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  <span>{social.label}</span>
                  <small>{social.handle}</small>
                  <span aria-hidden="true" className="contact__arrow">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resumeUrl} download="Muhammad-Ali-Resume.pdf">
                <span>Résumé</span>
                <small>PDF download</small>
                <span aria-hidden="true" className="contact__arrow">↓</span>
              </a>
            </li>
          </ul>
        </div>

        <form className="contact__form" onSubmit={submit} data-reveal="up" data-delay="0.1" noValidate={false}>
          <p className="contact__form-title" data-scramble>Send a message</p>
          <div className="field-row">
            <label className="field">
              <span>Name</span>
              <input name="name" value={form.name} onChange={update} required minLength={2} maxLength={100} autoComplete="name" placeholder="Your name" />
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" value={form.email} onChange={update} required maxLength={254} autoComplete="email" placeholder="you@company.com" />
            </label>
          </div>
          <label className="field">
            <span>Subject</span>
            <input name="subject" value={form.subject} onChange={update} required minLength={3} maxLength={150} placeholder="Role, project or idea" />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea name="message" value={form.message} onChange={update} required minLength={10} maxLength={5000} rows={5} placeholder="Tell me a little about what you need…" />
          </label>
          {/* Honeypot — hidden from people, tempting for bots */}
          <label className="hp" aria-hidden="true">
            Website
            <input name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" />
          </label>

          <div className="contact__submit">
            <button type="submit" className="btn btn--accent btn--lg" disabled={status === "sending"} data-cursor="Send">
              {status === "sending" ? "Sending…" : "Send message"}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
            <p className={`contact__feedback contact__feedback--${status}`} role="status" aria-live="polite">
              {feedback}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
