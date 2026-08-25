import { useEffect, useRef } from "react";

const CURSOR_LABELS = {
  default: "",
  link: "LINK",
  view: "VIEW",
  code: "CODE \u2197",
  connect: "CONNECT \u2197",
  chat: "CHAT \u2197",
  drag: "DRAG",
  contact: "CONTACT",
};

export default function InteractionLayer() {
  const layerRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (min-width: 769px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layer = layerRef.current;
    const cursor = cursorRef.current;
    if (!layer || !cursor) return undefined;

    let stopTracking;

    const syncTracking = () => {
      stopTracking?.();
      stopTracking = undefined;
      if (!finePointer.matches || reducedMotion.matches) return;

      document.documentElement.classList.add("cursor-enabled");

      let pointerX = window.innerWidth / 2;
      let pointerY = window.innerHeight / 2;
      let cursorX = pointerX;
      let cursorY = pointerY;
      let frameId = null;
      let cursorState = "default";

      const render = () => {
        cursorX += (pointerX - cursorX) * 0.18;
        cursorY += (pointerY - cursorY) * 0.18;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        const stillMoving = Math.abs(pointerX - cursorX) > 0.1 || Math.abs(pointerY - cursorY) > 0.1;
        frameId = stillMoving ? window.requestAnimationFrame(render) : null;
      };

      const requestRender = () => {
        if (frameId === null) frameId = window.requestAnimationFrame(render);
      };

      const onPointerMove = (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        layer.style.setProperty("--pointer-x", `${pointerX}px`);
        layer.style.setProperty("--pointer-y", `${pointerY}px`);
        cursor.style.opacity = "1";
        requestRender();
      };

      const onPointerOver = (event) => {
        const interactive = event.target.closest("[data-cursor], a, button");
        const requestedState = interactive?.dataset.cursor || (interactive ? "link" : "default");
        const nextState = Object.hasOwn(CURSOR_LABELS, requestedState) ? requestedState : "default";
        if (nextState === cursorState) return;
        cursorState = nextState;
        cursor.dataset.state = nextState;
        cursor.querySelector(".global-cursor__label").textContent = CURSOR_LABELS[nextState];
      };

      const onPointerLeave = () => {
        cursor.style.opacity = "0";
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerover", onPointerOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);

      stopTracking = () => {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerover", onPointerOver);
        document.documentElement.removeEventListener("pointerleave", onPointerLeave);
        if (frameId !== null) window.cancelAnimationFrame(frameId);
        cursor.style.opacity = "0";
        cursor.dataset.state = "default";
        document.documentElement.classList.remove("cursor-enabled");
      };
    };

    finePointer.addEventListener("change", syncTracking);
    reducedMotion.addEventListener("change", syncTracking);
    syncTracking();

    return () => {
      finePointer.removeEventListener("change", syncTracking);
      reducedMotion.removeEventListener("change", syncTracking);
      stopTracking?.();
    };
  }, []);

  return (
    <div className="interaction-layer" ref={layerRef} aria-hidden="true">
      <div className="effect-grid" />
      <div className="effect-light" />
      <div className="effect-noise" />
      <div className="global-cursor" ref={cursorRef} data-state="default">
        <span className="global-cursor__label" />
      </div>
    </div>
  );
}
