import { useEffect, useRef, useState } from 'react';

export function useHeroNavAnimation() {
  const navRef = useRef(null);
  const [solid, setSolid] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;

      setSolid(currentY > 8);

      if (currentY <= 8) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false);
      } else if (currentY < lastScrollY.current) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { navRef, solid, visible };
}