import { useRef, useState, useEffect, useCallback } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function HorizontalScroller({ children, className = '' }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: 'smooth' });
  };

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <HiChevronLeft size={24} />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth py-2"
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <HiChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
