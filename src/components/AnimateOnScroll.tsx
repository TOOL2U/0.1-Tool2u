import React, { useEffect, useRef, useState } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  className = '',
  threshold = 0.1,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay]);

  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

  // If user prefers reduced motion, show content immediately
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
    }
  }, [prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'fade-in' : 'opacity-0'}`}
      style={{ 
        animationDelay: `${delay}ms`,
        transition: 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      aria-hidden={!isVisible}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
