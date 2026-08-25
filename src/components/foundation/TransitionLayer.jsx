import { useCallback, useRef } from "react";
import { gsap } from "../../animation/gsap";
import { useGSAPContext } from "../../hooks/useGSAPContext";

export default function TransitionLayer({ routeKey }) {
  const layerRef = useRef(null);
  const previousRouteRef = useRef(routeKey);

  const runTransition = useCallback(() => {
    const layer = layerRef.current;
    if (!layer || previousRouteRef.current === routeKey) return;
    previousRouteRef.current = routeKey;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panel = layer.querySelector(".transition-layer__panel");
    const mask = layer.querySelector(".transition-layer__mask");
    layer.dataset.route = routeKey;

    gsap.timeline({ defaults: { ease: "expo.inOut" } })
      .set(layer, { visibility: "visible" })
      .fromTo(layer, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.65 })
      .fromTo(panel, { scaleY: 0.92 }, { scaleY: 1, duration: 0.65 }, "<")
      .fromTo(mask, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.18")
      .to(mask, { opacity: 0, y: -14, duration: 0.25 }, "+=0.08")
      .to(layer, { clipPath: "inset(0 0 100% 0)", duration: 0.7 })
      .set(layer, { visibility: "hidden" });
  }, [routeKey]);

  useGSAPContext(layerRef, runTransition);

  return (
    <div className="transition-layer" ref={layerRef} aria-hidden="true">
      <div className="transition-layer__panel" />
      <div className="transition-layer__mask">MUHAMMAD ALI / TRANSITION SYSTEM</div>
    </div>
  );
}
