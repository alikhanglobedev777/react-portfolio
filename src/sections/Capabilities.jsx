import SectionHead from "../components/SectionHead";
import { capabilities } from "../data/content";

const ICONS = [
  // layers
  <svg key="a" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6 4 16l20 10 20-10L24 6Z" /><path d="m4 24 20 10 20-10" /><path d="m4 32 20 10 20-10" /></svg>,
  // nodes
  <svg key="b" viewBox="0 0 48 48" aria-hidden="true"><circle cx="10" cy="24" r="5" /><circle cx="38" cy="10" r="5" /><circle cx="38" cy="38" r="5" /><path d="m15 22 18-10M15 26l18 10" /></svg>,
  // spark
  <svg key="c" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4c1.2 10.6 9.4 18.8 20 20-10.6 1.2-18.8 9.4-20 20-1.2-10.6-9.4-18.8-20-20C14.6 22.8 22.8 14.6 24 4Z" /></svg>,
];

export default function Capabilities() {
  return (
    <section className="section caps" id="expertise" aria-labelledby="caps-title">
      <div className="container">
        <SectionHead
          index="03"
          label="What I Do"
          id="caps-title"
          title="Beyond writing *code.*"
          lede="I don’t just build features. I build the systems a business runs on — and I care about how they behave in production."
        />

        <div className="caps__grid" data-reveal="stagger">
          {capabilities.map((cap, index) => (
            <article className="cap" key={cap.no} data-tilt="7">
              <div className="cap__top">
                <span className="cap__icon">{ICONS[index]}</span>
                <span className="cap__no">{cap.no}</span>
              </div>
              <h3 className="cap__title">{cap.title}</h3>
              <p className="cap__body">{cap.body}</p>
              <ul className="chips chips--sm" data-reveal="pop" data-delay="0.3">
                {cap.tech.map((tech) => <li key={tech}>{tech}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
