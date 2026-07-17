import { useEffect, useRef, useState } from 'react';

export function useHeroFillReveal() {
  const [playKey, setPlayKey] = useState(0);
  const wasAtTop = useRef(true);

  useEffect(() => {
    function onScroll() {
      const atTop = window.scrollY <= 4;
      if (atTop && !wasAtTop.current) {
        setPlayKey((k) => k + 1);
      }
      wasAtTop.current = atTop;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return playKey;
}