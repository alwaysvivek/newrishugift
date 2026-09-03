import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, X, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface LoveNote {
  id: number;
  title: string;
  message: string;
}

const notes: LoveNote[] = [
  {
    id: 1,
    title: 'Note #1',
    message:
      'I still remember the first time you smiled at me. The whole world paused for a second, and I knew something good was starting.',
  },
  {
    id: 2,
    title: 'Note #2',
    message:
      'You make ordinary Tuesdays feel like adventures. I never knew how much I needed someone like you until you showed up.',
  },
  {
    id: 3,
    title: 'Note #3',
    message:
      'Even when we are quiet, it never feels empty. That is how I know this is real — the silence is comfortable.',
  },
  {
    id: 4,
    title: 'Note #4',
    message:
      'If I had to live my whole life over, I would find you faster the second time. I would search less and trust more.',
  },
  {
    id: 5,
    title: 'Note #5',
    message:
      'You are my favorite notification, my favorite voice, my favorite person to tell boring stories to. And you always listen.',
  },
  {
    id: 6,
    title: 'Note #6',
    message:
      'Whatever comes next — I choose you. Not because I have to, but because I want to, every single day.',
  },
];

export default function LoveNotesDrawer() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<LoveNote | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.notes-header > *', {
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

      gsap.from('.note-envelope', {
        y: 60,
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="notes"
      className="relative min-h-screen overflow-hidden py-20"
      style={{ background: 'linear-gradient(180deg, #2a1a2e, #fff8f5 30%)' }}
    >
      <div className="text-center mb-12 notes-header text-white">
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>
          interlude
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
          Love <span className="font-script">notes</span>
        </h2>
        <p
          className="copy-text mx-auto"
          style={{ fontSize: 'clamp(16px, 1.8vw, 22px)', color: 'rgba(255,255,255,0.7)' }}
        >
          Open each envelope to read a little note I wrote for you.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <button
              key={note.id}
              className="note-envelope glass-card-dark rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer text-left"
              style={{ border: 'none', transition: 'transform 0.3s ease' }}
              onClick={() => {
                setActiveNote(note);
                setOpen(true);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #ff6f91, #e04867)',
                }}
              >
                <Mail size={22} color="#fff" />
              </div>
              <div className="font-script text-xl text-white">{note.title}</div>
              <div
                className="text-xs text-center"
                style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                tap to open
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Drawer overlay */}
      {open && activeNote && (
        <div
          className="drawer-overlay fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(23, 20, 38, 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="drawer-panel glass-card rounded-3xl p-10 max-w-lg mx-4 relative"
            style={{ background: 'rgba(255, 248, 245, 0.95)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 rounded-full flex items-center justify-center"
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(50, 27, 45, 0.08)',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setOpen(false)}
            >
              <X size={18} color="#321b2d" />
            </button>

            <div
              className="rounded-full flex items-center justify-center mb-6"
              style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #ff6f91, #e04867)',
              }}
            >
              <Heart size={28} color="#fff" fill="#fff" />
            </div>

            <div className="font-script text-3xl mb-4" style={{ color: '#e04867' }}>
              {activeNote.title}
            </div>
            <p
              className="font-display"
              style={{ fontSize: '20px', lineHeight: 1.6, color: '#321b2d', fontWeight: 400 }}
            >
              {activeNote.message}
            </p>

            <div
              className="mt-8 pt-6"
              style={{ borderTop: '1px solid rgba(50, 27, 45, 0.1)' }}
            >
              <p className="font-script text-2xl" style={{ color: '#e04867' }}>
                — Always yours
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
