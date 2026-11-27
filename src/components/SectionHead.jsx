import SplitWords from "./SplitWords";

export default function SectionHead({ index, label, title, lede, id, align = "split", children }) {
  return (
    <header className={`section-head section-head--${align}`}>
      <span className="section-head__rule" data-reveal="rule" aria-hidden="true" />
      <div className="section-head__main">
        <p className="eyebrow" data-reveal="up">
          <span className="eyebrow__no">{index}</span>
          <span data-scramble>{label}</span>
        </p>
        <SplitWords as="h2" id={id} className="section-title" text={title} />
      </div>
      {(lede || children) && (
        <div className="section-head__side" data-reveal="up" data-delay="0.15">
          {lede && <p className="section-lede">{lede}</p>}
          {children}
        </div>
      )}
    </header>
  );
}
