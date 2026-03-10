import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HolographicBackground({ videoId = "HGgQpXDIjsw" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Place canvas above the YouTube iframe
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.zIndex = "2";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Wireframe sphere around the video
    const geometry = new THREE.IcosahedronGeometry(1.5, 4);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
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

    // Orbiting ring
    const torusGeo = new THREE.TorusGeometry(2.0, 0.015, 8, 120);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.25,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // Second ring (tilted)
    const torus2Geo = new THREE.TorusGeometry(2.2, 0.01, 8, 120);
    const torus2Mat = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      transparent: true,
      opacity: 0.15,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.rotation.x = Math.PI / 3;
    scene.add(torus2);

    let frame = 0;
    let reqId;
    const animate = () => {
      frame++;
      const t = frame * 0.004;

      mesh.rotation.x = t * 0.25;
      mesh.rotation.y = t * 0.4;

      particles.rotation.y = t * 0.07;
      particles.rotation.x = t * 0.03;

      torus.rotation.x = t * 0.3;
      torus.rotation.z = t * 0.15;

      torus2.rotation.y = t * 0.2;
      torus2.rotation.z = t * 0.1;

      const hue = (t * 15) % 360;
      material.color.setHSL(hue / 360, 1, 0.6);
      torusMat.color.setHSL((hue + 120) / 360, 1, 0.6);
      torus2Mat.color.setHSL((hue + 200) / 360, 1, 0.6);

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };
    reqId = requestAnimationFrame(animate);

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
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const sphereSize = 320;

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0a001a 0%, #000008 100%)",
        position: "fixed",
      }}
    >

    </div>
  );
}