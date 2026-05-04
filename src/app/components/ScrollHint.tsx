import { useState, useEffect } from 'react';

interface Props {
  label: string;
  onScrollDown: () => void;
  visible: boolean;
}

export function ScrollHint({ label, onScrollDown, visible }: Props) {
  const [nearBottom, setNearBottom] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setNearBottom(e.clientY > window.innerHeight - 130);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const show = visible && nearBottom;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-8 pointer-events-none"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(1.5rem)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <button
        onClick={onScrollDown}
        className="pointer-events-auto text-[#A2834E] font-light tracking-[0.2em] uppercase cursor-pointer hover:opacity-60 transition-opacity text-3xl md:text-4xl"
      >
        {label}
      </button>
    </div>
  );
}
