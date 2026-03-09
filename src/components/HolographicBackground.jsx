import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HolographicBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Holographic mesh
    const geometry = new THREE.IcosahedronGeometry(1.5, 6);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Floating particles
    const particleGeo = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      [0, 1, 1],
      [1, 0, 1],
      [0.5, 0, 1],
      [0, 1, 0.5],
    ];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Second morphing ring
    const torusGeo = new THREE.TorusGeometry(2.5, 0.02, 8, 80);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.15,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    let frame = 0;
    const animate = () => {
      frame++;
      const t = frame * 0.005;

      mesh.rotation.x = t * 0.3;
      mesh.rotation.y = t * 0.5;
      mesh.scale.setScalar(1 + 0.08 * Math.sin(t * 1.2));

      particles.rotation.y = t * 0.08;
      particles.rotation.x = t * 0.04;

      torus.rotation.x = t * 0.4;
      torus.rotation.z = t * 0.2;

      // Shift colors over time
      const hue = (t * 20) % 360;
      material.color.setHSL(hue / 360, 1, 0.5);
      torusMat.color.setHSL((hue + 120) / 360, 1, 0.5);

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    let reqId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at center, #0a001a 0%, #000008 100%)" }}
    />
  );
}