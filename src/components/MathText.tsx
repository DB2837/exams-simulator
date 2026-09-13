import { useEffect, useMemo, useRef } from 'react';
import { formatMathText } from '../utils/mathFormatting';

declare global {
  interface Window {
    MathJax?: {
      typesetClear?: (elements?: HTMLElement[]) => void;
      typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
    };
  }
}

type TProps = {
  text: string;
  enabled?: boolean;
  className?: string;
};

const MathText = ({ text, enabled = true, className }: TProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const displayText = useMemo(
    () => (enabled ? formatMathText(text) : text),
    [enabled, text],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Keep the original text readable while MathJax is loading or if the CDN is unavailable.
    element.textContent = text;

    if (!enabled) return;

    const typeset = () => {
      if (!window.MathJax?.typesetPromise) return;
      window.MathJax.typesetClear?.([element]);
      element.textContent = displayText;
      window.MathJax.typesetPromise([element]).catch((error) => {
        element.textContent = text;
        console.warn('Unable to render mathematical notation', error);
      });
    };

    typeset();
    window.addEventListener('mathjax-ready', typeset);

    return () => {
      window.removeEventListener('mathjax-ready', typeset);
      window.MathJax?.typesetClear?.([element]);
    };
  }, [displayText, enabled, text]);

  return <span ref={containerRef} className={className} />;
};

export default MathText;
