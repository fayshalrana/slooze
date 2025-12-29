import { useEffect, useState } from 'react';

interface ThemeTransitionProps {
  isAnimating: boolean;
  onAnimationEnd: () => void;
}

export const ThemeTransition = ({ isAnimating, onAnimationEnd }: ThemeTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      setIsVisible(true);
      // Animation duration is 700ms, hide after it completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        onAnimationEnd();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, onAnimationEnd]);

  if (!isVisible) return null;

  return (
    <div
      className="theme-transition-overlay fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    />
  );
};

