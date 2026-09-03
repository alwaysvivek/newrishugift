import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RoseScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [blown, setBlown] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [blowProgress, setBlowProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const PETAL_COUNT = 18000;
    const STEM_COUNT = 4000;
    const TOTAL_COUNT = PETAL_COUNT + STEM_COUNT;

    let targetBloom = 0.7;
    let currentBloom = 0.7;
    let zoomLevel = 22;
    let time = 0;
    let blowAmount = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(TOTAL_COUNT * 3);
    const baseCoords = new Float32Array(TOTAL_COUNT * 3);
    const colors = new Float32Array(TOTAL_COUNT * 3);
    const velocities = new Float32Array(TOTAL_COUNT * 3);

    const colorInner = new THREE.Color(0x9e012e);
    const colorOuter = new THREE.Color(0xff4d6d);
    const colorStem = new THREE.Color(0x1a401a);

    for (let i = 0; i < TOTAL_COUNT; i++) {
      const i3 = i * 3;
      if (i < PETAL_COUNT) {
        const ratio = i / PETAL_COUNT;
        const angle = i * 137.508 * (Math.PI / 180);
        const radius = Math.sqrt(i) * 0.12;
        baseCoords[i3] = Math.cos(angle) * radius;
        baseCoords[i3 + 1] = Math.pow(radius, 1.4) * 0.18 - ratio * 2.5 + 2;
        baseCoords[i3 + 2] = Math.sin(angle) * radius;
        colorInner.clone().lerp(colorOuter, ratio).toArray(colors, i3);
      } else {
        const ratio = (i - PETAL_COUNT) / STEM_COUNT;
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.12 + Math.random() * 0.05;
        baseCoords[i3] = Math.cos(angle) * radius;
        baseCoords[i3 + 1] = -ratio * 12 + 1.5;
        baseCoords[i3 + 2] = Math.sin(angle) * radius;
        colorStem.toArray(colors, i3);
      }
      velocities[i3] = (Math.random() - 0.5) * 0.2;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const roseGroup = new THREE.Group();
    const rosePoints = new THREE.Points(geometry, material);
    roseGroup.add(rosePoints);
    scene.add(roseGroup);

    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * Math.PI;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * Math.PI;
    };
    container.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      frame = requestAnimationFrame(animate);
      time += 0.01;
      currentBloom = THREE.MathUtils.lerp(currentBloom, targetBloom, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoomLevel, 0.05);

      roseGroup.rotation.y = THREE.MathUtils.lerp(
        roseGroup.rotation.y,
        mouseX + blowAmount * 0.3,
        0.05
      );
      roseGroup.rotation.x = THREE.MathUtils.lerp(roseGroup.rotation.x, mouseY, 0.05);

      const pos = geometry.attributes.position.array as Float32Array;
      const col = geometry.attributes.color.array as Float32Array;
      const pulse = 1 + blowAmount * 0.3 * Math.sin(time * 15);

      for (let i = 0; i < TOTAL_COUNT; i++) {
        const i3 = i * 3;
        if (i < PETAL_COUNT) {
          pos[i3] = baseCoords[i3] * currentBloom * pulse;
          pos[i3 + 1] =
            (baseCoords[i3 + 1] + Math.sin(time + i * 0.01) * 0.02) * pulse;
          pos[i3 + 2] = baseCoords[i3 + 2] * currentBloom * pulse;
        } else {
          pos[i3] = baseCoords[i3] + Math.sin(time + baseCoords[i3 + 1]) * 0.05;
          pos[i3 + 1] = baseCoords[i3 + 1];
          pos[i3 + 2] = baseCoords[i3 + 2];
        }

        if (blowAmount > 0.01) {
          pos[i3] += velocities[i3] * blowAmount;
          pos[i3 + 1] += velocities[i3 + 1] * blowAmount;
          pos[i3 + 2] += velocities[i3 + 2] * blowAmount;
          col[i3] += (1.0 - col[i3]) * 0.05 * blowAmount;
          col[i3 + 1] += (0.8 - col[i3 + 1]) * 0.05 * blowAmount;
          col[i3 + 2] += (0.3 - col[i3 + 2]) * 0.05 * blowAmount;
        }
      }

      blowAmount *= 0.92;

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Expose blow trigger
    (container as unknown as { triggerBlow: (intensity: number) => void }).triggerBlow = (intensity: number) => {
      blowAmount = Math.min(blowAmount + intensity, 1.5);
      targetBloom = 2.8;
      setTimeout(() => {
        targetBloom = 0.7;
      }, 600);
    };

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Microphone blow detection
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicActive(true);
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let accumulated = 0;

      const detect = () => {
        analyser.getByteFrequencyData(dataArray);
        // Low frequencies = blow (wind noise)
        let sum = 0;
        for (let i = 0; i < 8; i++) {
          sum += dataArray[i];
        }
        const lowFreqAvg = sum / 8;

        if (lowFreqAvg > 60) {
          const intensity = Math.min((lowFreqAvg - 60) / 80, 1);
          accumulated += intensity * 2;
          setBlowProgress(Math.min(accumulated, 100));

          const container = containerRef.current as unknown as { triggerBlow?: (i: number) => void } | null;
          container?.triggerBlow?.(intensity * 0.5);

          if (accumulated >= 100) {
            setBlown(true);
            stream.getTracks().forEach((t) => t.stop());
            audioContext.close();
            return;
          }
        }
        requestAnimationFrame(detect);
      };
      detect();
    } catch {
      setMicActive(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.rose-header > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="rose"
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(circle at center, #2a0a14 0%, #14060e 60%, #0a0308 100%)',
      }}
    >
      <div className="text-center mb-6 rose-header text-white z-10 px-6">
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>
          a rose for you
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            margin: '10px 0',
            color: '#fff',
          }}
        >
          Blow to <span className="font-script">bloom</span>
        </h2>
        <p
          className="copy-text mx-auto"
          style={{ fontSize: 'clamp(15px, 1.6vw, 20px)', color: 'rgba(255,255,255,0.6)' }}
        >
          {blown
            ? 'It bloomed for you. Just like everything does.'
            : 'Move your mouse to rotate. Allow your mic, then blow gently to make the rose bloom.'}
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative z-10"
        style={{ width: '100%', maxWidth: '700px', height: 'clamp(360px, 55vh, 520px)' }}
      />

      {!micActive && !blown && (
        <button
          className="btn-romantic z-10 mt-4"
          onClick={startMic}
        >
          Enable Microphone
        </button>
      )}

      {micActive && !blown && (
        <div className="z-10 mt-4" style={{ width: '240px' }}>
          <div
            className="rounded-full overflow-hidden"
            style={{ height: '4px', background: 'rgba(255,255,255,0.15)' }}
          >
            <div
              style={{
                width: `${blowProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff6f91, #e7a74e)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <p
            className="text-center mt-2 font-script text-lg"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            keep blowing…
          </p>
        </div>
      )}

      {blown && (
        <div className="z-10 mt-4 text-center">
          <p
            className="font-script text-2xl"
            style={{ color: '#ffd700', textShadow: '0 0 15px rgba(255,215,0,0.5)' }}
          >
            "I've seen a lotta roses, but none are prettier than you.."
          </p>
        </div>
      )}
    </section>
  );
}
