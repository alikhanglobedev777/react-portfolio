import { useEffect, useRef } from "react";

/*
 * Illustrative, stylised product previews built in CSS.
 * They are NOT screenshots — the UI marks them "Illustrative preview".
 */

const Bars = ({ n = 3, className = "" }) => (
  <div className={`mk-lines ${className}`}>
    {Array.from({ length: n }, (_, i) => (
      <i key={i} style={{ "--w": `${90 - i * 18}%` }} />
    ))}
  </div>
);

function Phones() {
  return (
    <div className="mk-body mk-phones">
      <div className="mk-query">
        <span className="mk-query__icon" />
        <span className="mk-type">best camera phone under 60k</span>
        <span className="mk-chip mk-chip--acc">EN / Roman Urdu</span>
      </div>
      <div className="mk-phones__grid">
        {[0, 1, 2].map((i) => (
          <div className="mk-phone" key={i} style={{ "--d": `${i * 0.12}s` }}>
            <div className="mk-phone__device"><span /></div>
            <Bars n={2} />
            <div className="mk-phone__price">
              <b>PKR</b>
              <i />
            </div>
            <div className="mk-score"><span style={{ "--s": `${92 - i * 14}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="mk-explain">
        <span className="mk-spark" />
        <Bars n={2} />
      </div>
    </div>
  );
}

function Files() {
  const tools = ["PDF → DOCX", "XLSX → PDF", "JPG → PDF", "Merge", "Split", "Compress"];
  return (
    <div className="mk-body mk-files">
      <div className="mk-drop">
        <div className="mk-file"><span>PDF</span></div>
        <div className="mk-arrow" />
        <div className="mk-file mk-file--b"><span>DOCX</span></div>
      </div>
      <div className="mk-progress"><span /></div>
      <div className="mk-tools">
        {tools.map((tool) => (
          <span key={tool} className="mk-chip">{tool}</span>
        ))}
      </div>
      <div className="mk-history">
        {[0, 1].map((i) => (
          <div key={i} className="mk-row">
            <span className="mk-dot" />
            <Bars n={1} />
            <span className="mk-pill">TTL</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Directory() {
  return (
    <div className="mk-body mk-dir">
      <div className="mk-search">
        <span className="mk-query__icon" />
        <i />
      </div>
      <div className="mk-tools">
        {["Plumber", "Electrician", "Tutor", "Cleaner"].map((tag, i) => (
          <span key={tag} className={`mk-chip${i === 1 ? " mk-chip--acc" : ""}`}>{tag}</span>
        ))}
      </div>
      <div className="mk-dir__list">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mk-card" style={{ "--d": `${i * 0.1}s` }}>
            <span className="mk-avatar" />
            <Bars n={2} />
            <span className="mk-stars">★★★★★</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Contracts() {
  const status = ["Draft", "In review", "Signed", "Signed"];
  return (
    <div className="mk-body mk-split">
      <aside className="mk-side">
        {[0, 1, 2, 3, 4].map((i) => <i key={i} className={i === 1 ? "is-on" : ""} />)}
      </aside>
      <div className="mk-main">
        <div className="mk-head"><i /><span className="mk-btn" /></div>
        {status.map((s, i) => (
          <div className="mk-row" key={i} style={{ "--d": `${i * 0.08}s` }}>
            <span className="mk-doc" />
            <Bars n={1} />
            <span className={`mk-pill mk-pill--${s === "Signed" ? "ok" : s === "Draft" ? "muted" : "acc"}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Logistics() {
  return (
    <div className="mk-body mk-split">
      <div className="mk-map">
        <svg viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true">
          <path className="mk-route" d="M14 98 C 60 90, 50 30, 100 40 S 160 92, 186 20" />
        </svg>
        <span className="mk-pin" style={{ left: "6%", top: "78%" }} />
        <span className="mk-pin mk-pin--b" style={{ left: "90%", top: "12%" }} />
      </div>
      <div className="mk-main">
        {["In transit", "Delivered", "Loading"].map((s, i) => (
          <div className="mk-row" key={s}>
            <span className="mk-dot" />
            <Bars n={1} />
            <span className={`mk-pill mk-pill--${i === 1 ? "ok" : "acc"}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Production() {
  return (
    <div className="mk-body">
      <div className="mk-head"><i /><span className="mk-btn" /></div>
      <div className="mk-chart">
        {[48, 72, 60, 88, 66, 94, 78].map((h, i) => (
          <span key={i} style={{ "--h": `${h}%`, "--d": `${i * 0.06}s` }} />
        ))}
      </div>
      <div className="mk-kanban">
        {["Cutting", "Stitching", "Packing"].map((col, c) => (
          <div key={col}>
            <small>{col}</small>
            {Array.from({ length: 3 - c }, (_, i) => <i key={i} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function Quality() {
  return (
    <div className="mk-body mk-split">
      <div className="mk-donut"><span /></div>
      <div className="mk-main">
        {["pass", "pass", "fail", "pass"].map((s, i) => (
          <div className="mk-row" key={i}>
            <span className={`mk-check mk-check--${s}`} />
            <Bars n={1} />
            <span className={`mk-pill mk-pill--${s === "pass" ? "ok" : "warn"}`}>{s === "pass" ? "Pass" : "Review"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sales() {
  return (
    <div className="mk-body">
      <div className="mk-kpis">
        {[0, 1, 2].map((i) => (
          <div key={i}><small /><b /></div>
        ))}
      </div>
      <div className="mk-line">
        <svg viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">
          <path className="mk-area" d="M0 60 L25 48 L50 52 L75 34 L100 40 L125 22 L150 28 L175 12 L200 16 L200 70 L0 70Z" />
          <path className="mk-stroke" d="M0 60 L25 48 L50 52 L75 34 L100 40 L125 22 L150 28 L175 12 L200 16" />
        </svg>
      </div>
    </div>
  );
}

const VARIANTS = {
  phones: Phones,
  files: Files,
  directory: Directory,
  contracts: Contracts,
  logistics: Logistics,
  production: Production,
  quality: Quality,
  sales: Sales,
};

export default function ProjectMockup({ project, compact = false, showLabel = true }) {
  const Variant = VARIANTS[project.mock] ?? Contracts;
  const host = project.live ? new URL(project.live).host : "private · client system";
  const ref = useRef(null);

  // Start the mockup's internal animations only once it scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className={`mockup${compact ? " mockup--compact" : ""}`}
      style={{ "--acc": project.accent, "--tint": project.tint }}
    >
      <div className="mockup__frame">
        <div className="mockup__chrome" aria-hidden="true">
          <span className="mockup__dots"><i /><i /><i /></span>
          <span className="mockup__url">{host}</span>
        </div>
        <div className="mockup__screen" aria-hidden="true">
          <Variant />
        </div>
      </div>
      {showLabel && (
        <figcaption className="mockup__label">Illustrative preview — not a screenshot</figcaption>
      )}
    </figure>
  );
}
