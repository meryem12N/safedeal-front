import { useRef } from 'react';

export function useTilt(intensity = 8) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateY(-4px)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)';
  }

  return { ref, handleMouseMove, handleMouseLeave };
}