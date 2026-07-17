import { useEffect, useRef, useState } from 'react';

export function useHeroNavAnimation() {
  const navRef = useRef(null);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    function onScroll() {
      setSolid(window.scrollY > 8);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { navRef, solid };
}