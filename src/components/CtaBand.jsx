import { scrollToId } from "../lib/motion";
import Marquee from "./Marquee";

const PHRASES = ["Let’s build something", "Get in touch", "Have an idea?", "Start a project"];

/** Oversized scroll-reactive band that links to the contact section. */
export default function CtaBand() {
  return (
    <a
      href="#contact"
      className="cta-band"
      data-cursor="Let’s talk"
      onClick={(event) => {
        event.preventDefault();
        scrollToId("contact");
      }}
      aria-label="Get in touch — go to the contact section"
    >
      <Marquee items={PHRASES} reverse speed={34} className="cta-band__marquee" />
    </a>
  );
}
