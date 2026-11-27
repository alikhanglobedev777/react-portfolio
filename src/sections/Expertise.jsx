import SectionHead from "../components/SectionHead";
import { skillGroups } from "../data/content";

export default function Expertise() {
  return (
    <section className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead
          index="07"
          label="Technical Expertise"
          id="skills-title"
          title="Tools I *trust.*"
          lede="Grouped by where they live in a system. Highlighted tools are the ones I reach for first."
        />

        <div className="skills__grid" data-reveal="stagger">
          {skillGroups.map((group, index) => (
            <article className="skill-group" key={group.name} data-tilt="6">
              <header>
                <span className="skill-group__no">{String(index + 1).padStart(2, "0")}</span>
                <h3>{group.name}</h3>
              </header>
              <ul data-reveal="pop" className="skill-group__primary" aria-label={`${group.name} — strongest`}>
                {group.primary.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
              <ul data-reveal="pop" data-delay="0.15" className="skill-group__rest" aria-label={`${group.name} — also used`}>
                {group.rest.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
