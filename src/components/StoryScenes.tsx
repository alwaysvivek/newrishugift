import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Character from './Character';

gsap.registerPlugin(ScrollTrigger);

export default function StoryScenes() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax layers
      rootRef.current?.querySelectorAll('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed') || '1');
        gsap.to(el, {
          y: () => -180 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Character idle motion
      rootRef.current?.querySelectorAll('.character').forEach((c, i) => {
        gsap.to(c, {
          y: '-=8',
          rotation: i % 2 ? 1.2 : -1.2,
          duration: 1.7 + i * 0.15,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        const armR = c.querySelector('.arm.r');
        if (armR) {
          gsap.to(armR, {
            rotation: i % 2 ? -34 : 34,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      });

      // Hero text reveal
      gsap.from('.heroText > *', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      });

      // Scene text reveals
      gsap.utils.toArray<HTMLElement>('.sceneText').forEach((el) => {
        gsap.from(el.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        });
      });

      // Scene title reveals
      gsap.utils.toArray<HTMLElement>('.sceneTitle').forEach((el) => {
        gsap.from(el.children, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el.closest('section'),
            start: 'top 80%',
          },
        });
      });

      // Chapter 1 - Found Each Other: characters walk in
      gsap.timeline({
        scrollTrigger: {
          trigger: '#ch1',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
        .from('#ch1 .boy', { x: -120, opacity: 0 }, 0)
        .from('#ch1 .girl', { x: 120, opacity: 0 }, 0)
        .to('#ch1 .heartMeet', { opacity: 1, scale: 1.25, duration: 0.3 }, 0.55)
        .to('#ch1 .heartMeet', { y: -35, opacity: 0, duration: 0.25 }, 0.72);

      // Chapter 2 - Chose Each Other: plane flies across
      gsap.timeline({
        scrollTrigger: {
          trigger: '#ch2',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
        .from('#ch2 .plane-icon', { x: -200, opacity: 0, duration: 0.3 }, 0)
        .to('#ch2 .plane-icon', { x: 200, opacity: 1, duration: 0.4 }, 0.3)
        .to('#ch2 .plane-icon', { opacity: 0, duration: 0.2 }, 0.7)
        .from('#ch2 .boy', { x: -100, opacity: 0 }, 0)
        .from('#ch2 .girl', { x: 100, opacity: 0 }, 0);

      // Chapter 3 - Fought for Each Other: characters move closer
      gsap.timeline({
        scrollTrigger: {
          trigger: '#ch3',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
        .from('#ch3 .boy', { x: -140, opacity: 0 }, 0)
        .from('#ch3 .girl', { x: 140, opacity: 0 }, 0)
        .to('#ch3 .boy', { x: 45, duration: 0.5 }, 0.45)
        .to('#ch3 .girl', { x: -45, duration: 0.5 }, 0.45);

      // Chapter 4 - Built for Each Other: building blocks rise
      gsap.from('#ch4 .build-block', {
        y: 80,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#ch4',
          start: 'top 60%',
        },
      });

      // Chapter 5 - Still Here: gentle pulse
      gsap.from('#ch5 .stay-orb', {
        scale: 0.5,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#ch5',
          start: 'top 70%',
        },
      });
      gsap.to('#ch5 .stay-orb', {
        scale: 1.08,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Chapter 6 - Engagement: ring descends
      gsap.from('#ch6 .ring-visual', {
        scale: 0.25,
        rotation: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: '#ch6',
          start: 'top 75%',
          end: 'center center',
          scrub: 1,
        },
      });

      // Final text reveal
      gsap.from('.finalText > *', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#final',
          start: 'top 60%',
        },
      });

      // Big heart pulse
      gsap.to('.bigHeart', {
        scale: 1.18,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Generate stars for chapter 3
      const starsContainer = rootRef.current?.querySelector('#stars-ch3');
      if (starsContainer && starsContainer.children.length === 0) {
        for (let i = 0; i < 70; i++) {
          const s = document.createElement('div');
          s.className = 'star';
          s.style.left = `${Math.random() * 100}%`;
          s.style.top = `${Math.random() * 78}%`;
          s.style.opacity = (0.25 + Math.random() * 0.75).toFixed(2);
          s.style.transform = `scale(${0.5 + Math.random() * 1.8})`;
          starsContainer.appendChild(s);
        }
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-screen overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, #ffe5ed 0%, #fff8f5 42%, #fff8f5 100%)',
        }}
      >
        <div className="absolute inset-0 starfield-bg pointer-events-none" data-speed="0.18" />
        <div className="absolute inset-0 pointer-events-none" data-speed="0.35">
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '46%',
              transform: 'translate(-50%, -50%)',
              width: 'clamp(240px, 32vw, 460px)',
              height: 'clamp(240px, 32vw, 460px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fff, #ffd2df 45%, #c9b8ff)',
              boxShadow: '0 35px 90px rgba(255, 111, 145, 0.2)',
            }}
          />
        </div>
        <div className="cloud-shape" style={{ left: '7%', top: '18%' }} data-speed="0.5" />
        <div
          className="cloud-shape"
          style={{ right: '4%', top: '62%', transform: 'scale(0.7)' }}
          data-speed="0.65"
        />
        <div className="absolute inset-0 grid place-items-center text-center z-10 px-6">
          <div className="heroText">
            <div className="eyebrow">our story</div>
            <div
              className="font-script"
              style={{ fontSize: 'clamp(22px, 3vw, 38px)', marginTop: '8px' }}
            >
              Once upon a time…
            </div>
            <div className="title-xl font-display">
              YOU
              <br />
              <span className="font-script" style={{ fontWeight: 500 }}>
                + ME
              </span>
            </div>
            <div className="copy-text mt-4 mx-auto">
              We found each other. We chose each other. We fought for each other.
              And now, we're getting engaged.
            </div>
            <div className="scroll-cue mx-auto" style={{ justifyContent: 'center' }}>
              <span /> scroll into our story <span />
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 1 — We Found Each Other */}
      <section
        id="ch1"
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fff8f5, #ffe9f0)' }}
      >
        <div className="absolute inset-0">
          <div
            data-speed="0.25"
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: '#ffd66b',
              right: '12%',
              top: '15%',
              boxShadow: '0 0 90px rgba(255, 214, 107, 0.53)',
            }}
          />
          <div
            data-speed="0.65"
            style={{
              position: 'absolute',
              left: '-5%',
              right: '-5%',
              bottom: '-12%',
              height: '45%',
              background: '#f7b7a8',
              borderRadius: '50% 50% 0 0',
            }}
          />
          <Character variant="boy" style={{ position: 'absolute', left: '39%', bottom: '15%' }} data-speed="0.9" />
          <Character variant="girl" style={{ position: 'absolute', left: '53%', bottom: '15%' }} data-speed="1.1" />
          <div
            className="heartMeet"
            style={{
              position: 'absolute',
              left: '50%',
              top: '47%',
              fontSize: '50px',
              transform: 'translate(-50%, -50%)',
              opacity: 0,
            }}
          >
            ♥
          </div>
        </div>
        <div className="sceneTitle">
          <div className="eyebrow">chapter one</div>
          <div className="story-no font-display">01</div>
        </div>
        <div className="sceneText">
          <div className="eyebrow">the beginning</div>
          <h2 className="font-display">
            We Found<br /><span className="font-script">Each Other</span>
          </h2>
          <p className="copy-text">
            Two people who found something meaningful in each other. We gave each
            other companionship, emotional support, and a relationship that
            gradually became serious. What started as simply being together became
            something both of us were willing to invest in.
          </p>
          <div className="mt-4 text-sm opacity-50" style={{ fontSize: '13px', lineHeight: 1.6 }}>
            We became each other's emotional safe space. We gave each other a
            relationship worth protecting. We both chose to take the relationship
            seriously rather than treating it casually.
          </div>
        </div>
      </section>

      {/* CHAPTER 2 — We Chose Each Other, Despite the Distance */}
      <section
        id="ch2"
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #e8e2ff, #fff)' }}
      >
        <div className="absolute inset-0">
          <div
            data-speed="0.25"
            style={{
              position: 'absolute',
              right: '14%',
              top: '12%',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 0 70px #fff',
            }}
          />
          <div
            data-speed="0.65"
            style={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '120%',
              height: '50%',
              background: '#9c8ddc',
              borderRadius: '50% 50% 0 0',
            }}
          />
          {/* Plane icon */}
          <div
            className="plane-icon"
            style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              fontSize: '40px',
              opacity: 0,
              transform: 'translateX(-50%)',
            }}
          >
            ✈️
          </div>
          <Character variant="boy" style={{ position: 'absolute', left: '42%', bottom: '18%' }} data-speed="0.85" />
          <Character variant="girl" style={{ position: 'absolute', left: '53%', bottom: '18%' }} data-speed="1.05" />
        </div>
        <div className="sceneTitle">
          <div className="eyebrow">chapter two</div>
          <div className="story-no font-display">02</div>
        </div>
        <div className="sceneText">
          <div className="eyebrow">despite the distance</div>
          <h2 className="font-display">
            We Chose<br /><span className="font-script">Each Other</span>
          </h2>
          <p className="copy-text">
            Then came the LDR. Distance meant that loving each other required actual
            effort. We couldn't rely on simply meeting every day or being physically
            present. And we didn't let that remain purely digital. I took a flight to
            be with her. That flight matters because it was a physical manifestation
            of everything I'd been saying: I will actually come to you.
          </p>
          <div className="mt-4 text-sm opacity-50" style={{ fontSize: '13px', lineHeight: 1.6 }}>
            We maintained the relationship despite being apart. I made the effort to
            physically travel to her. We turned "I miss you" into an actual journey.
            We both proved that distance wasn't enough to make either of us walk away.
          </div>
        </div>
      </section>

      {/* CHAPTER 3 — We Fought for Each Other */}
      <section
        id="ch3"
        className="relative min-h-screen overflow-hidden text-white"
        style={{ background: '#172033' }}
      >
        <div className="absolute inset-0">
          <div
            style={{
              position: 'absolute',
              top: '12%',
              right: '15%',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#fff4c7',
              boxShadow: '0 0 50px rgba(255, 244, 199, 0.4)',
            }}
          />
          <div
            data-speed="0.8"
            style={{
              position: 'absolute',
              bottom: '-8%',
              left: 0,
              width: '120%',
              height: '38%',
              background: '#252d43',
              transform: 'rotate(-5deg)',
              transformOrigin: 'left center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '13%',
              left: '-5%',
              width: '110%',
              borderTop: '7px dashed #ffe8a3',
              transform: 'rotate(-5deg)',
            }}
          />
          <Character variant="boy" style={{ position: 'absolute', left: '42%', bottom: '24%' }} data-speed="1" />
          <Character variant="girl" style={{ position: 'absolute', left: '53%', bottom: '24%' }} data-speed="1.15" />
        </div>
        <div id="stars-ch3" className="absolute inset-0 pointer-events-none" />
        <div className="sceneTitle">
          <div className="eyebrow">chapter three</div>
          <div className="story-no font-display">03</div>
        </div>
        <div className="sceneText">
          <div className="eyebrow">the turning point</div>
          <h2 className="font-display">
            We Fought<br /><span className="font-script">For Each Other</span>
          </h2>
          <p className="copy-text">
            This was the turning point. My family became strongly opposed to the
            relationship. The conflict went beyond disagreements — it affected my
            devices, communication, movement, documents and ability to independently
            make decisions about our relationship. I fought to keep control of my
            own life, including calling 112 when I needed to recover my documents.
          </p>
          <div className="mt-4 text-sm opacity-50" style={{ fontSize: '13px', lineHeight: 1.6 }}>
            I fought to preserve our ability to communicate. I refused to simply
            abandon the relationship because of external pressure. I started taking
            concrete steps toward independence. She stayed with me through
            circumstances that could have easily overwhelmed a relationship.
          </div>
        </div>
      </section>

      {/* CHAPTER 4 — Building a Future */}
      <section
        id="ch4"
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fff8f5, #f0e8ff 50%, #fff8f5)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Building blocks visualization */}
          <div className="flex items-end gap-3" style={{ marginBottom: '5%' }}>
            <div
              className="build-block"
              style={{
                width: 50,
                height: 80,
                background: 'linear-gradient(180deg, #ff6f91, #e04867)',
                borderRadius: '8px 8px 0 0',
                opacity: 0.85,
              }}
            />
            <div
              className="build-block"
              style={{
                width: 50,
                height: 120,
                background: 'linear-gradient(180deg, #c9b8ff, #9c8ddc)',
                borderRadius: '8px 8px 0 0',
                opacity: 0.85,
              }}
            />
            <div
              className="build-block"
              style={{
                width: 50,
                height: 160,
                background: 'linear-gradient(180deg, #ffd66b, #e7a74e)',
                borderRadius: '8px 8px 0 0',
                opacity: 0.85,
              }}
            />
            <div
              className="build-block"
              style={{
                width: 50,
                height: 200,
                background: 'linear-gradient(180deg, #ff6f91, #e04867)',
                borderRadius: '8px 8px 0 0',
                opacity: 0.85,
              }}
            />
          </div>
        </div>
        <div className="sceneTitle">
          <div className="eyebrow">chapter four</div>
          <div className="story-no font-display">04</div>
        </div>
        <div className="sceneText">
          <div className="eyebrow">building a future</div>
          <h2 className="font-display">
            We Built<br /><span className="font-script">For Each Other</span>
          </h2>
          <p className="copy-text">
            This is where our relationship became connected to my personal growth. I
            started building my career, earning my own money, securing my documents
            and accounts, planning my relocation, and thinking seriously about
            becoming independent. Those things matter because they create the
            conditions in which we can eventually make our own decisions about our
            life and our future together.
          </p>
          <div className="mt-4 text-sm opacity-50" style={{ fontSize: '13px', lineHeight: 1.6 }}>
            I began building financial independence. I started creating a
            professional path capable of supporting our future. I worked toward
            physical independence from the environment creating pressure. She
            continued being part of my life while I was rebuilding mine. We both kept
            the relationship alive through uncertainty rather than expecting
            everything to be easy.
          </div>
        </div>
      </section>

      {/* CHAPTER 5 — Still Here, Still Building */}
      <section
        id="ch5"
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fff4f7, #ffdbe6)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="stay-orb"
            style={{
              width: 'clamp(180px, 25vw, 300px)',
              height: 'clamp(180px, 25vw, 300px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fff, #ffd2df 40%, #c9b8ff)',
              boxShadow: '0 30px 80px rgba(255, 111, 145, 0.25)',
            }}
          />
        </div>
        <div className="sceneTitle">
          <div className="eyebrow">chapter five</div>
          <div className="story-no font-display">05</div>
        </div>
        <div className="sceneText">
          <div className="eyebrow">still here</div>
          <h2 className="font-display">
            Still Here,<br /><span className="font-script">Still Building</span>
          </h2>
          <p className="copy-text">
            We're no longer just asking "Can we stay together?" We're gradually
            working toward "Can we build a life where being together doesn't require
            constantly fighting circumstances?" That's a major difference.
          </p>
          <div className="mt-4 text-sm opacity-50" style={{ fontSize: '13px', lineHeight: 1.6 }}>
            We traveled for each other. We stayed for each other. We fought for each
            other. We endured uncertainty for each other. And we're still trying to
            build toward each other.
          </div>
        </div>
      </section>

      {/* CHAPTER 6 — We Got Engaged */}
      <section
        id="ch6"
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fff4f7, #ffdbe6)' }}
      >
        <div
          className="promiseText"
          style={{ position: 'absolute', top: '10%', width: '100%', textAlign: 'center', zIndex: 5 }}
        >
          <div className="eyebrow">chapter six</div>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(44px, 7vw, 100px)', margin: '8px 0', letterSpacing: '-0.06em', fontWeight: 800 }}
          >
            We Finally<br /><span className="font-script">Said Yes</span> 💍
          </h2>
        </div>
        <div className="ring-visual" />
        <div className="hands-visual">
          <div className="hand-visual" />
          <div className="hand-visual b" />
        </div>
        <div
          className="sceneText"
          style={{ left: '50%', transform: 'translateX(-50%)', bottom: '6%', textAlign: 'center', maxWidth: '640px' }}
        >
          <p className="copy-text mx-auto">
            After everything we've been through, we're finally taking a concrete step
            toward marriage. On Bali Pratipada, after the initial puja and Diwali
            wishes and gift exchange, we'll have our private engagement ritual.
          </p>
          <div className="mt-4 text-sm opacity-50" style={{ fontSize: '13px', lineHeight: 1.6 }}>
            Puja first, according to Bali Pratipada tradition. Diwali wishes and
            exchange of gifts. Sweets, tilak, clothes. After the gifts and puja are
            complete, we'll change clothes. We'll exchange and wear the rings. Gold
            ring — permanent. Silver payal as part of the engagement gifting. She
            will perform aarti for me, in the husband and wife tradition we've
            described. Timing: 11:00 AM to 1:45 PM, and 3:15 PM to 4:30 PM.
          </div>
          <div
            className="mt-3 font-script"
            style={{ fontSize: '20px', color: '#e04867', lineHeight: 1.5 }}
          >
            It isn't a huge public ceremony. It's private. But private doesn't mean
            insignificant. This is the moment where we are saying: "We've chosen each
            other. Now we're making that choice official."
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section
        id="final"
        className="relative min-h-screen overflow-hidden text-white"
        style={{
          background: 'radial-gradient(circle at 50% 45%, #ffcad8, #20182b 75%)',
        }}
      >
        <div className="absolute inset-0 starfield-bg pointer-events-none" style={{ opacity: 0.55 }} />
        <div className="bigHeart" data-speed="0.35" />
        <div className="absolute inset-0 grid place-items-center text-center z-10 px-6">
          <div className="finalText">
            <div className="eyebrow">and that's not the end</div>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(65px, 13vw, 180px)', lineHeight: 0.8, letterSpacing: '-0.07em', margin: '15px 0', fontWeight: 800 }}
            >
              Still
              <br />
              <span className="font-script">you.</span>
            </h2>
            <p style={{ fontSize: '18px', opacity: 0.8 }}>
              My favorite person. My favorite story. ❤️
            </p>
            <div
              className="glass-card-dark"
              style={{ margin: '25px auto 0', padding: '18px 24px', borderRadius: '18px', width: 'min(90%, 500px)' }}
            >
              <strong>To my favorite human</strong>
              <br />
              <span style={{ opacity: 0.72 }}>
                We found each other. We chose each other. We fought for each other.
                We grew for each other. And now, we're getting engaged.
              </span>
            </div>
            <button
              className="btn-romantic"
              style={{ marginTop: '28px' }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ↻ replay our story
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
