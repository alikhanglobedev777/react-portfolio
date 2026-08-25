import "../styles/Manifesto.css";

const disciplines = ["DESIGN", "FRONTEND", "BACKEND", "DATABASE", "DEPLOYMENT"];

function MaskedLine({ children, className = "" }) {
  return <span className={className}><i>{children}</i></span>;
}

export default function Manifesto() {
  return (
    <section className="manifesto" id="manifesto" aria-labelledby="manifesto-title">
      <div className="manifesto__stage">
        <div className="manifesto__index technical">
          <span>01 / MANIFESTO</span>
          <span>WHAT I BUILD</span>
        </div>

        <h2 className="manifesto__lead" id="manifesto-title">
          <MaskedLine className="manifesto__lead-line">I DON&apos;T JUST</MaskedLine>
          <MaskedLine className="manifesto__lead-line manifesto__lead-line--indent">BUILD WEBSITES.</MaskedLine>
        </h2>

        <p className="manifesto__system" aria-label="I build digital systems.">
          <MaskedLine className="manifesto__system-line">I BUILD</MaskedLine>
          <MaskedLine className="manifesto__system-line manifesto__system-line--indent">DIGITAL</MaskedLine>
          <MaskedLine className="manifesto__system-line">SYSTEMS.</MaskedLine>
        </p>

        <p className="manifesto__support">
          From interfaces and interaction to APIs, databases and production systems.
        </p>

        <ul className="manifesto__disciplines technical" aria-label="Disciplines">
          {disciplines.map((discipline) => <li key={discipline}>{discipline}</li>)}
        </ul>
      </div>
    </section>
  );
}
