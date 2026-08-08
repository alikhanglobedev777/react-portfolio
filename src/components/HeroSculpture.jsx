import { useEffect, useRef, useState } from "react";
import {
  AmbientLight,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
  TorusGeometry,
  TorusKnotGeometry,
} from "three";

function SceneCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let disposed = false;
    let teardown;

    const initialize = async () => {
      const { WebGLRenderer } = await import("three/src/renderers/WebGLRenderer.js");
      if (disposed) return;

    let renderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const group = new Group();
    group.rotation.set(-0.16, 0.25, -0.08);
    scene.add(group);

    const core = new Mesh(
      new TorusKnotGeometry(1.08, 0.29, 180, 24, 2, 3),
      new MeshPhysicalMaterial({
        color: "#d9ddd8",
        metalness: 0.94,
        roughness: 0.14,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
    );
    group.add(core);

    [0, 1, 2].forEach((ringIndex) => {
      const ring = new Mesh(
        new TorusGeometry(1.72 + ringIndex * 0.13, 0.018, 8, 110),
        new MeshStandardMaterial({
          color: ringIndex === 1 ? "#c8ff2e" : "#aeb4b0",
          metalness: 0.8,
          roughness: 0.22,
          transparent: true,
          opacity: ringIndex === 1 ? 0.72 : 0.34,
        }),
      );
      ring.rotation.set(Math.PI / 2.7 + ringIndex * 0.38, ringIndex * 0.7, ringIndex * 0.42);
      group.add(ring);
    });

    const wireframe = new Mesh(
      new IcosahedronGeometry(1.45, 1),
      new MeshBasicMaterial({ color: "#eef0eb", wireframe: true, transparent: true, opacity: 0.075 }),
    );
    wireframe.rotation.set(0.45, 0.18, 0.3);
    wireframe.scale.setScalar(1.5);
    group.add(wireframe);

    scene.add(new AmbientLight("#ffffff", 0.8));
    const directional = new DirectionalLight("#f2f3ed", 3.4);
    directional.position.set(3, 4, 5);
    scene.add(directional);
    const point = new PointLight("#9dff46", 18, 8);
    point.position.set(-3, -1, 3);
    scene.add(point);
    const spot = new SpotLight("#6d7774", 14, 0, 0.5, 0.8);
    spot.position.set(0, -4, 4);
    scene.add(spot);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    mount.closest(".hero-sculpture-shell")?.classList.add("is-webgl");

    let pointerX = 0;
    let pointerY = 0;
    let frameId = null;
    let previousTime = performance.now();

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const onPointerMove = (event) => {
      const bounds = mount.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointerY = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
    };

    const renderFrame = (time) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const elapsed = time / 1000;
      group.rotation.x = MathUtils.damp(group.rotation.x, pointerY * 0.2 - 0.16, 3, delta);
      group.rotation.y = MathUtils.damp(group.rotation.y, pointerX * 0.2 + elapsed * 0.055, 3, delta);
      group.position.y = Math.sin(elapsed * 0.65) * 0.075;
      core.rotation.z += delta * 0.075;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(renderFrame);
    };

    const stopRendering = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
    };
    const startRendering = () => {
      if (document.hidden || frameId !== null) return;
      previousTime = performance.now();
      frameId = window.requestAnimationFrame(renderFrame);
    };
    const onVisibilityChange = () => (document.hidden ? stopRendering() : startRendering());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    mount.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();
    startRendering();

    teardown = () => {
      stopRendering();
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material?.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      mount.closest(".hero-sculpture-shell")?.classList.remove("is-webgl");
    };
    };

    initialize().catch(() => {});

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return <div className="hero-sculpture__canvas" ref={mountRef} aria-hidden="true" />;
}

export default function HeroSculpture() {
  const shellRef = useRef(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !window.IntersectionObserver) return undefined;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "20% 0px" });
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-sculpture-shell" ref={shellRef} role="img" aria-label="Abstract chrome architectural sculpture">
      <div className="hero-sculpture__fallback" aria-hidden="true"><span /><span /><span /></div>
      {active && <SceneCanvas />}
    </div>
  );
}
