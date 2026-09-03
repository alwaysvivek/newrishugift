import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Music } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function VinylPlayer() {
  const sectionRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.vinyl-header > *', {
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

      gsap.from('.vinyl-disc', {
        scale: 0.5,
        opacity: 0,
        rotation: -180,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        setProgress(0);
      });
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (audioRef.current) {
        const dur = audioRef.current.duration || 1;
        setProgress((audioRef.current.currentTime / dur) * 100);
      }
    };
    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <section
      ref={sectionRef}
      id="music"
      className="relative min-h-screen overflow-hidden py-20 flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #fff8f5, #2a1a2e 40%, #2a1a2e)' }}
    >
      <div className="text-center mb-10 vinyl-header text-white">
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>
          chapter seven
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(44px, 7vw, 100px)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            margin: '10px 0',
            color: '#fff',
          }}
        >
          Our <span className="font-script">song</span>
        </h2>
        <p
          className="copy-text mx-auto"
          style={{ fontSize: 'clamp(16px, 1.8vw, 22px)', color: 'rgba(255,255,255,0.7)' }}
        >
          Press play. Close your eyes. Think of us.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          {/* Vinyl disc */}
          <div
            className={`vinyl-disc ${playing ? 'vinyl-spin' : 'vinyl-spin-paused'}`}
            style={{
              width: 'clamp(220px, 30vw, 320px)',
              height: 'clamp(220px, 30vw, 320px)',
              borderRadius: '50%',
              background: 'repeating-radial-gradient(circle, #1a1a1a 0px, #1a1a1a 2px, #0d0d0d 3px, #0d0d0d 5px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.8)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Center label */}
            <div
              style={{
                width: '35%',
                height: '35%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6f91, #e04867)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 3px #1a1a1a',
              }}
            >
              <Music size={28} color="#fff" />
            </div>
            {/* Center hole */}
            <div
              style={{
                position: 'absolute',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#2a1a2e',
              }}
            />
          </div>

          {/* Tonearm */}
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-30px',
              width: '140px',
              height: '6px',
              background: '#888',
              borderRadius: '99px',
              transformOrigin: 'right center',
              transform: playing ? 'rotate(20deg)' : 'rotate(0deg)',
              transition: 'transform 0.5s ease',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '-8px',
                top: '-10px',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#aaa',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={togglePlay}
            className="glass-card-dark rounded-full flex items-center justify-center"
            style={{ width: '72px', height: '72px', cursor: 'pointer', border: 'none' }}
          >
            {playing ? (
              <Pause size={28} color="#fff" />
            ) : (
              <Play size={28} color="#fff" style={{ marginLeft: '3px' }} />
            )}
          </button>

          {/* Progress bar */}
          <div
            className="rounded-full overflow-hidden"
            style={{ width: '280px', height: '4px', background: 'rgba(255,255,255,0.15)' }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff6f91, #e7a74e)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          <p className="font-script text-2xl" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {playing ? 'Now playing… our song' : 'Press play to listen'}
          </p>
        </div>
      </div>

      {/* Hidden audio element — uses a royalty-free track */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc6b7d1.mp3"
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        preload="none"
      />
    </section>
  );
}
