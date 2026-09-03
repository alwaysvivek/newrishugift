import { useEffect, useRef } from 'react';
import ParticleBackground from './components/ParticleBackground';
import CursorGlow from './components/CursorGlow';
import ProgressBar from './components/ProgressBar';
import StoryScenes from './components/StoryScenes';
import PolaroidGallery from './components/PolaroidGallery';
import MiniGame from './components/MiniGame';
import VinylPlayer from './components/VinylPlayer';
import LoveNotesDrawer from './components/LoveNotesDrawer';

function App() {
  const petalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = petalContainerRef.current;
    if (!container) return;

    const createPetal = () => {
      const petal = document.createElement('div');
      const left = Math.random() * 100;
      const size = 8 + Math.random() * 14;
      const duration = 8 + Math.random() * 8;
      const delay = Math.random() * 5;
      const hue = Math.random() > 0.5 ? '#ff6f91' : '#ffb7c9';

      petal.style.cssText = `
        position: fixed;
        left: ${left}vw;
        top: -30px;
        width: ${size}px;
        height: ${size * 1.3}px;
        background: ${hue};
        border-radius: 50% 0 50% 50%;
        opacity: 0;
        pointer-events: none;
        z-index: 2;
        animation: petal-fall ${duration}s linear ${delay}s forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(petal);

      setTimeout(() => {
        if (petal.parentNode) petal.parentNode.removeChild(petal);
      }, (duration + delay) * 1000);
    };

    const interval = setInterval(createPetal, 1200);
    for (let i = 0; i < 6; i++) createPetal();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <ParticleBackground />
      <CursorGlow />
      <ProgressBar />

      {/* Falling petals */}
      <div ref={petalContainerRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }} />

      {/* Scroll hint */}
      <div className="scroll-hint">scroll to continue ↓</div>

      {/* Main story */}
      <StoryScenes />

      {/* Polaroid gallery */}
      <PolaroidGallery />

      {/* Mini game */}
      <MiniGame />

      {/* Love notes */}
      <LoveNotesDrawer />

      {/* Vinyl player */}
      <VinylPlayer />
    </div>
  );
}

export default App;
