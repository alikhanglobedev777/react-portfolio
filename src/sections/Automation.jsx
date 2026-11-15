import { useEffect, useRef, useState } from "react";
import SectionHead from "../components/SectionHead";
import { automation } from "../data/content";
import { prefersReducedMotion } from "../lib/motion";

// Hand-placed "messy" positions (desktop board) — x%, y%, rotation.
const MESSY = [
  [-4, 6, -7],
  [22, -4, 5],
  [-10, 4, 4],
  [18, 10, -5],
  [2, -6, 8],
];

export default function Automation() {
  const [managed, setManaged] = useState(false);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const boardRef = useRef(null);
  const userToggled = useRef(false);

  // Auto-play: pipeline cycles, and the board flips to "managed" once seen.
  useEffect(() => {
    if (prefersReducedMotion() || paused) return undefined;
    const timer = window.setInterval(() => setStep((s) => (s + 1) % automation.steps.length), 2200);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userToggled.current) {
          window.setTimeout(() => !userToggled.current && setManaged(true), 1400);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  const toggle = (value) => {
    userToggled.current = true;
    setManaged(value);
  };

  return (
    <section className="section auto" aria-labelledby="auto-title">
      <div className="container">
        <SectionHead
          index="04"
          label="Business Systems"
          id="auto-title"
          title="From messy. *To managed.*"
          lede="Most of my work starts with an operation running on spreadsheets, chats and memory — and ends with one reliable system."
        >
          <p className="tag-illustrative">Illustrative workflow — how I approach a build, not a specific client.</p>
        </SectionHead>

        <div className="auto__stage" data-reveal="up">
          <div className="auto__switch" role="group" aria-label="Compare before and after">
            <button type="button" aria-pressed={!managed} onClick={() => toggle(false)}>Before</button>
            <button type="button" aria-pressed={managed} onClick={() => toggle(true)}>After</button>
            <span className="auto__switch-thumb" data-on={managed} aria-hidden="true" />
          </div>

          <div ref={boardRef} className={`auto__board${managed ? " is-managed" : ""}`} aria-live="polite">
            <p className="auto__board-title">
              {managed ? "Managed — one source of truth" : "Messy — work held together by people"}
            </p>
            <ul>
              {automation.before.map((before, index) => {
                const [x, y, r] = MESSY[index];
                return (
                  <li key={before} style={{ "--x": `${x}%`, "--y": `${y}px`, "--r": `${r}deg`, "--i": index }}>
                    <span className="auto__icon" aria-hidden="true">{managed ? "✓" : "!"}</span>
                    <span className="auto__text">
                      <span className="auto__before">{before}</span>
                      <span className="auto__after">{automation.after[index]}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="auto__flow"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            <div className="auto__track" aria-hidden="true">
              <span style={{ "--p": step / (automation.steps.length - 1) }} />
            </div>
            <ol>
              {automation.steps.map((item, index) => (
                <li key={item.title} className={index === step ? "is-active" : index < step ? "is-done" : ""}>
                  <button type="button" onClick={() => { setStep(index); setPaused(true); }} aria-current={index === step ? "step" : undefined}>
                    <span className="auto__step-no">{String(index + 1).padStart(2, "0")}</span>
                    <span className="auto__step-title">{item.title}</span>
                    <span className="auto__step-text">{item.text}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
