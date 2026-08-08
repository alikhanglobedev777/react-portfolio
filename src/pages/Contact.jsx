import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "../animation/gsap";
import SocialLinks from "../components/SocialLinks";
import { useGSAPContext } from "../hooks/useGSAPContext";
import "../styles/Contact.css";

const emptyForm = { name: "", email: "", subject: "", message: "", website: "" };

export default function Contact() {
  const rootRef = useRef(null);
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const submittingRef = useRef(false);
  const resetTimerRef = useRef(null);
  const requestControllerRef = useRef(null);

  const setupMotion = useCallback(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const media = gsap.matchMedia();

    media.add("(min-width: 769px)", () => {
      const titleLines = root.querySelectorAll(".contact-title span");
      const headerMeta = root.querySelectorAll(".contact-system__index, .contact-system__prompt");
      const formIntro = root.querySelector(".contact-form-intro");
      const formStage = root.querySelector(".contact-form-stage");
      const alternate = root.querySelector(".contact-alternate");
      const footer = document.querySelector(".footer");

      const entrance = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 83%", end: "top 22%", scrub: 0.58 },
      })
        .fromTo(titleLines, {
          yPercent: (index) => (index % 2 ? -108 : 108),
          clipPath: "inset(0 0 100% 0)",
          filter: "blur(12px)",
        }, {
          yPercent: 0,
          clipPath: "inset(0 0 0% 0)",
          filter: "blur(0px)",
          stagger: 0.075,
          ease: "none",
        }, 0)
        .fromTo(headerMeta, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, ease: "none" }, 0.18)
        .fromTo(formIntro, { y: 38, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.42)
        .fromTo(formStage, {
          y: 54,
          opacity: 0,
          clipPath: "inset(0 0 18% 0)",
        }, {
          y: 0,
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
        }, 0.46)
        .fromTo(alternate, { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.64);

      let exit;
      if (footer) {
        exit = gsap.timeline({
          scrollTrigger: { trigger: footer, start: "top 96%", end: "top 34%", scrub: 0.6 },
        })
          .to(titleLines, {
            xPercent: (index) => (index % 2 ? 5 : -5),
            opacity: 0.18,
            filter: "blur(5px)",
            ease: "none",
          }, 0)
          .to(formStage, { y: -42, scale: 0.985, opacity: 0.28, transformOrigin: "center top", ease: "none" }, 0)
          .to([formIntro, alternate], { y: -24, opacity: 0.16, ease: "none" }, 0);
      }

      return () => {
        entrance.kill();
        exit?.kill();
      };
    });

    media.add("(max-width: 768px)", () => {
      const reveal = gsap.from(root.querySelectorAll(".contact-title span, .contact-form-intro, .contact-form-stage"), {
        y: 34,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.75,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 84%", once: true },
      });
      return () => reveal.kill();
    });

    return () => media.revert();
  }, []);

  useGSAPContext(rootRef, setupMotion);

  useEffect(() => () => {
    window.clearTimeout(resetTimerRef.current);
    requestControllerRef.current?.abort();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (status === "error") {
      setStatus("focus");
      setFeedback("");
    }
  };

  const handleFocus = () => {
    if (!submittingRef.current && status !== "success") setStatus("focus");
  };

  const handleBlur = () => {
    if (status === "focus") setStatus("idle");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    setStatus("submitting");
    setFeedback("");
    const requestController = new AbortController();
    requestControllerRef.current = requestController;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: requestController.signal,
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) throw new Error(result?.message || "Unable to send your message right now.");

      setFormData(emptyForm);
      setStatus("success");
      setFeedback("Message received. I will get back to you soon.");
      resetTimerRef.current = window.setTimeout(() => {
        setStatus("idle");
        setFeedback("");
      }, 3200);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Unable to send your message right now.");
    } finally {
      submittingRef.current = false;
      if (requestControllerRef.current === requestController) requestControllerRef.current = null;
    }
  };

  return (
    <div className="contact-container" data-form-state={status} ref={rootRef}>
      <div className="contact-system page-shell">
        <header className="contact-system__header grid-12">
          <p className="contact-system__index technical">07 / CONTACT</p>
          <p className="contact-system__prompt technical">HAVE A PROJECT?</p>
          <h2 className="contact-title" aria-label="Let's build something.">
            <span>LET&apos;S</span><span>BUILD</span><span>SOMETHING.</span>
          </h2>
        </header>

        <div className="contact-form-layout grid-12">
          <div className="contact-form-intro">
            <p>Tell me what you are building, what needs to work, and where I can help.</p>
            <span className="technical">INTERFACE / BACKEND / DATABASE / DELIVERY</span>
          </div>

          <div className="contact-form-stage">
            <div className="contact-form-stage__top technical">
              <span>PROJECT INQUIRY</span>
              <span>{status.toUpperCase()}</span>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} aria-label="Project inquiry form" aria-busy={status === "submitting"}>
              <div className="field">
                <label htmlFor="contact-name"><span>01</span> NAME</label>
                <input id="contact-name" name="name" type="text" value={formData.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} autoComplete="name" minLength="2" maxLength="100" required placeholder="YOUR NAME" disabled={status === "submitting" || status === "success"} />
              </div>

              <div className="field">
                <label htmlFor="contact-email"><span>02</span> EMAIL</label>
                <input id="contact-email" name="email" type="email" value={formData.email} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} autoComplete="email" maxLength="254" required placeholder="YOU@COMPANY.COM" disabled={status === "submitting" || status === "success"} />
              </div>

              <div className="field">
                <label htmlFor="contact-subject"><span>03</span> SUBJECT</label>
                <input id="contact-subject" name="subject" type="text" value={formData.subject} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} minLength="3" maxLength="150" required placeholder="PROJECT / PRODUCT / SYSTEM" disabled={status === "submitting" || status === "success"} />
              </div>

              <div className="field field--message">
                <label htmlFor="contact-message"><span>04</span> MESSAGE</label>
                <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} minLength="10" maxLength="5000" required rows="6" placeholder="TELL ME ABOUT THE WORK" disabled={status === "submitting" || status === "success"} />
              </div>

              <div className="contact-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" type="text" value={formData.website} onChange={handleChange} tabIndex="-1" autoComplete="off" />
              </div>

              <button className="contact-submit" type="submit" disabled={status === "submitting" || status === "success"} data-cursor="contact" data-magnetic data-magnetic-strength="0.1">
                <span>{status === "submitting" ? "TRANSMITTING" : "SEND INQUIRY"}</span>
                <i aria-hidden="true">{status === "submitting" ? "•••" : "↗"}</i>
              </button>

              <p
                className={`contact-feedback contact-feedback--${status}`}
                role={status === "error" ? "alert" : "status"}
                aria-live={status === "error" ? "assertive" : "polite"}
              >
                {status === "submitting" ? "Sending your inquiry." : status === "error" ? feedback : ""}
              </p>
            </form>

            {status === "success" && (
              <div className="contact-success" role="status" aria-live="polite">
                <span className="technical">DELIVERY / CONFIRMED</span>
                <strong><i>MESSAGE</i><i>RECEIVED.</i></strong>
                <p>{feedback}</p>
              </div>
            )}
          </div>
        </div>

        <div className="contact-alternate">
          <p className="technical">ALTERNATE CONTACT</p>
          <SocialLinks variant="contact" includeEmail />
        </div>
      </div>
    </div>
  );
}
