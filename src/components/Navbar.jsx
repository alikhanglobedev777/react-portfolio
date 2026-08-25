import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../animation/gsap";
import { scrollToSection } from "../animation/scrollController";
import { profile } from "../data/profile";
import BrandMark from "./BrandMark";
import "../styles/Navbar.css";

const menuItems = [
  { number: "01", label: "INDEX", target: "home" },
  { number: "02", label: "WORK", target: "projects" },
  { number: "03", label: "ABOUT", target: "about" },
  { number: "04", label: "EXPERIENCE", target: "experience" },
  { number: "05", label: "ARCHIVE", target: "archive" },
  { number: "06", label: "RESUME", target: "resume" },
  { number: "07", label: "CONTACT", target: "contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const closeRef = useRef(null);
  const toggleRef = useRef(null);
  const reactionRef = useRef(null);
  const timelineRef = useRef(null);
  const returnFocusRef = useRef(null);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return undefined;

    const context = gsap.context(() => {
      timelineRef.current = gsap.timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .set(menu, { visibility: "visible" })
        .fromTo(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.72 })
        .fromTo(".fullscreen-menu__reaction", { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 0.38, duration: 0.55 }, "-=0.5")
        .from(".fullscreen-menu__item a > span", { yPercent: 120, duration: 0.62, stagger: 0.055 }, "-=0.5")
        .from(".fullscreen-menu__close, .fullscreen-menu__meta", { opacity: 0, y: 14, duration: 0.3, stagger: 0.05 }, "-=0.3")
        .eventCallback("onReverseComplete", () => {
          gsap.set(menu, { visibility: "hidden" });
        });
    }, menu);

    return () => {
      timelineRef.current?.kill();
      context.revert();
    };
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !timelineRef.current) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (menuOpen) {
      returnFocusRef.current = document.activeElement;
      document.body.style.overflow = "hidden";
      menu.style.pointerEvents = "auto";
      menu.setAttribute("aria-hidden", "false");
      if (reducedMotion) {
        gsap.set(menu, { visibility: "visible", clipPath: "inset(0 0 0 0)" });
        gsap.set(".fullscreen-menu__item a > span, .fullscreen-menu__close, .fullscreen-menu__meta", { clearProps: "all" });
      } else {
        timelineRef.current.play(0);
      }

      const focusTimer = window.setTimeout(() => closeRef.current?.focus(), reducedMotion ? 0 : 420);
      const onKeyDown = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setMenuOpen(false);
          return;
        }

        if (event.key !== "Tab") return;
        const focusable = Array.from(menu.querySelectorAll('button, a[href]')).filter((element) => !element.hasAttribute("disabled"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      document.addEventListener("keydown", onKeyDown);
      return () => {
        window.clearTimeout(focusTimer);
        document.removeEventListener("keydown", onKeyDown);
      };
    }

    menu.setAttribute("aria-hidden", "true");
    menu.style.pointerEvents = "none";
    if (reducedMotion) {
      gsap.set(menu, { visibility: "hidden", clipPath: "inset(0 0 100% 0)" });
    } else {
      timelineRef.current.reverse();
    }
    document.body.style.overflow = "";
    returnFocusRef.current?.focus?.();
    return undefined;
  }, [menuOpen]);

  useEffect(() => () => {
    document.body.style.overflow = "";
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const goToSection = (event, target) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const menu = menuRef.current;
    document.body.style.overflow = "";
    timelineRef.current?.progress(0).pause();
    if (menu) {
      menu.style.pointerEvents = "none";
      menu.setAttribute("aria-hidden", "true");
      gsap.set(menu, { visibility: "hidden", clipPath: "inset(0 0 100% 0)" });
    }
    setMenuOpen(false);

    window.history.replaceState(window.history.state, "", target === "home" ? "/" : `/#${target}`);
    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      scrollToSection(target, { immediate: true });
      const destination = target === "home"
        ? document.documentElement
        : document.getElementById(target);
      destination?.scrollIntoView({ behavior: "auto", block: "start" });
      ScrollTrigger.update();
    });
  };

  const reactToItem = (index) => {
    const reaction = reactionRef.current;
    if (!reaction) return;
    reaction.dataset.active = String(index);
    gsap.to(reaction, { xPercent: (index % 2 ? 3 : -3), scale: 1 + index * 0.008, duration: 0.55, ease: "power3.out" });
  };

  return (
    <>
      <nav className="navbar" aria-label="Primary navigation">
        <a className="navbar__mark" href="#home" onClick={(event) => goToSection(event, "home")} aria-label="Muhammad Ali, index" data-cursor="link">
          <BrandMark />
        </a>
        <button ref={toggleRef} className="navbar__toggle" type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="fullscreen-menu" data-cursor="link" data-magnetic data-magnetic-strength="0.12">
          <span>MENU</span><span aria-hidden="true">+</span>
        </button>
      </nav>

      <div className="fullscreen-menu" id="fullscreen-menu" ref={menuRef} aria-hidden="true">
        <div className="fullscreen-menu__reaction" ref={reactionRef} data-active="0" aria-hidden="true" />
        <div className="fullscreen-menu__top">
          <span className="fullscreen-menu__brand"><BrandMark compact /><span className="technical">NAVIGATION / MA</span></span>
          <button ref={closeRef} className="fullscreen-menu__close" type="button" onClick={closeMenu} data-cursor="link" tabIndex={menuOpen ? 0 : -1}>
            <span aria-hidden="true">×</span> CLOSE
          </button>
        </div>

        <nav className="fullscreen-menu__nav" aria-label="Fullscreen navigation">
          <ol>
            {menuItems.map((item, index) => (
              <li className="fullscreen-menu__item" key={item.number} onPointerEnter={() => reactToItem(index)}>
                <a href={`#${item.target}`} onClick={(event) => goToSection(event, item.target)} data-cursor="link" tabIndex={menuOpen ? 0 : -1}>
                  <span><small>{item.number}</small>{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>


        <div className="fullscreen-menu__meta technical">
          <span>{profile.role.toUpperCase()}</span>
          <span>{profile.location.toUpperCase()}</span>
        </div>
      </div>
    </>
  );
}
