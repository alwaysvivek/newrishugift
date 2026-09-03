import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Play, RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FallingHeart {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  emoji: string;
  caught: boolean;
}

const HEART_EMOJIS = ['❤️', '💕', '💖', '💗', '🌹', '💝'];

export default function MiniGame() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [bestScore, setBestScore] = useState(0);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const heartIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.game-header > *', {
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

  const spawnHeart = useCallback(() => {
    const id = heartIdRef.current++;
    const x = Math.random() * 80 + 10;
    setHearts((prev) => [
      ...prev,
      {
        id,
        x,
        y: -5,
        speed: 0.8 + Math.random() * 1.5,
        size: 28 + Math.random() * 20,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        caught: false,
      },
    ]);
  }, []);

  const startGame = () => {
    setPlaying(true);
    setScore(0);
    setTimeLeft(20);
    setHearts([]);
    heartIdRef.current = 0;

    spawnerRef.current = setInterval(spawnHeart, 600);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPlaying(false);
          if (timerRef.current) clearInterval(timerRef.current);
          if (spawnerRef.current) clearInterval(spawnerRef.current);
          setBestScore((b) => Math.max(b, score + 1));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!playing) return;

    const animRef = { current: 0 };
    const tick = () => {
      animRef.current = requestAnimationFrame(tick);
      setHearts((prev) =>
        prev
          .map((h) => ({
            ...h,
            y: h.caught ? h.y : h.y + h.speed,
          }))
          .filter((h) => h.y < 105 && !h.caught)
      );
    };
    tick();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [playing]);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnerRef.current) clearInterval(spawnerRef.current);
    }
  }, [playing]);

  const catchHeart = (id: number) => {
    setHearts((prev) =>
      prev.map((h) => (h.id === id ? { ...h, caught: true } : h))
    );
    setScore((s) => s + 1);
  };

  return (
    <section
      ref={sectionRef}
      id="game"
      className="relative min-h-screen overflow-hidden py-20"
      style={{ background: 'linear-gradient(180deg, #fff8f5, #f0e8ff 50%, #fff8f5)' }}
    >
      <div className="text-center mb-12 game-header">
        <div className="eyebrow">chapter six</div>
        <h2
          className="font-display"
          style={{ fontSize: 'clamp(44px, 7vw, 100px)', fontWeight: 800, letterSpacing: '-0.05em', margin: '10px 0' }}
        >
          Catch the <span className="font-script">hearts</span>
        </h2>
        <p className="copy-text mx-auto" style={{ fontSize: 'clamp(16px, 1.8vw, 22px)' }}>
          Tap as many falling hearts as you can in 20 seconds.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="glass-card rounded-2xl px-6 py-3 text-center">
            <div className="eyebrow">score</div>
            <div className="font-display text-3xl font-bold" style={{ color: '#e04867' }}>
              {score}
            </div>
          </div>
          <div className="glass-card rounded-2xl px-6 py-3 text-center">
            <div className="eyebrow">time</div>
            <div className="font-display text-3xl font-bold" style={{ color: '#321b2d' }}>
              {timeLeft}s
            </div>
          </div>
          <div className="glass-card rounded-2xl px-6 py-3 text-center">
            <div className="eyebrow">best</div>
            <div className="font-display text-3xl font-bold" style={{ color: '#e7a74e' }}>
              {bestScore}
            </div>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="game-canvas relative mx-auto rounded-3xl overflow-hidden glass-card"
          style={{ height: '420px', background: 'linear-gradient(180deg, rgba(255,229,237,0.4), rgba(201,184,255,0.3))' }}
        >
          {!playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
              <Heart className="heart-pulse" size={64} color="#ff6f91" fill="#ff6f91" />
              <button className="btn-rose flex items-center gap-2" onClick={startGame}>
                <Play size={18} /> {score > 0 ? 'Play Again' : 'Start Game'}
              </button>
              {score > 0 && timeLeft === 0 && (
                <p className="font-script text-2xl" style={{ color: '#321b2d' }}>
                  You caught {score} hearts! ❤️
                </p>
              )}
            </div>
          )}

          {playing &&
            hearts.map((h) => (
              <div
                key={h.id}
                onClick={() => catchHeart(h.id)}
                style={{
                  position: 'absolute',
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  fontSize: `${h.size}px`,
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'transform 0.15s ease',
                  transform: h.caught ? 'scale(2)' : 'scale(1)',
                  opacity: h.caught ? 0 : 1,
                }}
              >
                {h.emoji}
              </div>
            ))}
        </div>

        {playing && (
          <div className="text-center mt-4">
            <button
              className="text-sm flex items-center gap-1 mx-auto opacity-60 hover:opacity-100 transition"
              onClick={() => {
                setPlaying(false);
                if (timerRef.current) clearInterval(timerRef.current);
                if (spawnerRef.current) clearInterval(spawnerRef.current);
              }}
            >
              <RotateCcw size={14} /> Stop
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
