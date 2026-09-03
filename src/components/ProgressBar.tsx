import { useEffect, useState } from 'react';

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState(1);
  const totalChapters = 8;

  useEffect(() => {
    const onScroll = () => {
      const scrollMax =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollMax > 0 ? window.scrollY / scrollMax : 0;
      setProgress(p);
      const idx = Math.min(
        totalChapters,
        Math.floor(p * totalChapters) + 1
      );
      setChapter(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="progress-track">
        <span
          className="progress-fill"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
      <div className="chapter-counter">
        {String(chapter).padStart(2, '0')} / {String(totalChapters).padStart(2, '0')}
      </div>
    </>
  );
}
