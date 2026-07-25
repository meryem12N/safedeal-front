import { useState } from 'react';

export function useAccordion(initialOpen = 0) {
  const [openIndex, setOpenIndex] = useState(initialOpen);

  function toggle(index) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return { openIndex, toggle };
}