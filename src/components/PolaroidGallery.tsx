import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Polaroid {
  url: string;
  caption: string;
  rotation: number;
  top: string;
  left: string;
}

const polaroids: Polaroid[] = [
  {
    url: 'https://images.pexels.com/photos/30743882/pexels-photo-30743882.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'the day everything began',
    rotation: -8,
    top: '0%',
    left: '5%',
  },
  {
    url: 'https://images.pexels.com/photos/3692738/pexels-photo-3692738.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'when you laughed so hard',
    rotation: 6,
    top: '8%',
    left: '38%',
  },
  {
    url: 'https://images.pexels.com/photos/4979750/pexels-photo-4979750.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'walking beside you',
    rotation: -4,
    top: '2%',
    left: '68%',
  },
  {
    url: 'https://images.pexels.com/photos/4858577/pexels-photo-4858577.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'every adventure together',
    rotation: 10,
    top: '42%',
    left: '12%',
  },
  {
    url: 'https://images.pexels.com/photos/3171204/pexels-photo-3171204.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'candlelight & you',
    rotation: -7,
    top: '38%',
    left: '48%',
  },
  {
    url: 'https://images.pexels.com/photos/7350844/pexels-photo-7350844.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'the road ahead',
    rotation: 5,
    top: '44%',
    left: '72%',
  },
];

export default function PolaroidGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.polaroid-card', {
        y: 80,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      gsap.from('.gallery-header > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const baseRot = polaroids[index].rotation;
    gsap.to(card, {
      rotateY: x * 20,
      rotateX: -y * 20,
      rotation: baseRot + x * 8,
      scale: 1.06,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent, index: number) => {
    const card = e.currentTarget as HTMLElement;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      rotation: polaroids[index].rotation,
      scale: 1,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative min-h-screen overflow-hidden py-20"
      style={{ background: 'linear-gradient(180deg, #fff8f5, #ffe9f0 50%, #fff8f5)' }}
    >
      <div className="text-center mb-16 gallery-header">
        <div className="eyebrow">chapter five</div>
        <h2
          className="font-display"
          style={{ fontSize: 'clamp(44px, 7vw, 100px)', fontWeight: 800, letterSpacing: '-0.05em', margin: '10px 0' }}
        >
          Our <span className="font-script">moments</span>
        </h2>
        <p className="copy-text mx-auto" style={{ fontSize: 'clamp(16px, 1.8vw, 22px)' }}>
          Hover over each memory. Some moments stay with you forever.
        </p>
      </div>

      <div className="relative mx-auto" style={{ maxWidth: '1100px', height: '580px' }}>
        {polaroids.map((p, i) => (
          <div
            key={i}
            className="polaroid polaroid-card absolute"
            style={{
              width: '240px',
              transform: `rotate(${p.rotation}deg)`,
              top: p.top,
              left: p.left,
              opacity: activeIndex === null || activeIndex === i ? 1 : 0.4,
              zIndex: activeIndex === i ? 10 : 1,
              transition: 'opacity 0.4s ease',
            }}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={(e) => {
              handleMouseLeave(e, i);
              setActiveIndex(null);
            }}
          >
            <img
              src={p.url}
              alt={p.caption}
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                borderRadius: '4px',
                display: 'block',
              }}
            />
            <div
              className="font-script text-center"
              style={{ fontSize: '22px', marginTop: '8px', color: '#321b2d' }}
            >
              {p.caption}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
