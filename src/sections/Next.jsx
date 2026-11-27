import SectionHead from "../components/SectionHead";
import { exploring } from "../data/content";

export default function Next() {
  return (
    <section className="section next" aria-labelledby="next-title">
      <div className="container">
        <SectionHead
          index="08"
          label="Currently Exploring"
          id="next-title"
          title="What’s *next.*"
          lede="Where my curiosity is pointed right now — areas I’m actively learning and experimenting in."
        />
        <ol className="next__list" data-reveal="stagger">
          {exploring.map((item, index) => (
            <li key={item.title} className="next__item">
              <span className="next__no">→ {String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
