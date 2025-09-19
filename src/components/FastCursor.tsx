import { useEffect, useRef, useState, useCallback } from 'react';

interface Dot {
  x: number;
  y: number;
  color: string;
  size: number;
  opacity: number;
  life: number;
}

const FastCursor = () => {
  const [dots, setDots] = useState<Dot[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();
  const lastMouseTime = useRef<number>(0);

  const colors = [
    '#ff0080', '#00ff80', '#8000ff', '#ff8000', 
    '#0080ff', '#ff4040', '#40ff40', '#4040ff'
  ];

  const createDot = useCallback((x: number, y: number): Dot => {
    return {
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 3, // Plus petit
      opacity: 1,
      life: 1
    };
  }, [colors]);

  const updateDots = useCallback(() => {
    setDots(prev => 
      prev
        .map(dot => ({
          ...dot,
          opacity: dot.opacity * 0.85, // Fade plus rapide
          life: dot.life + 1
        }))
        .filter(dot => dot.opacity > 0.1 && dot.life < 20) // Durée plus courte
    );
  }, []);

  const animate = useCallback(() => {
    updateDots();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateDots]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    
    // Créer des points moins fréquemment
    if (now - lastMouseTime.current > 30) { // Plus espacé
      lastMouseTime.current = now;
      const newDot = createDot(e.clientX, e.clientY);
      setDots(prev => [newDot, ...prev].slice(-8)); // Max 8 points seulement
    }
  }, [createDot]);

  const handleScroll = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleClick = useCallback(() => {
    // Explosion simple au clic
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const distance = 20;
      const x = mousePos.x + Math.cos(angle) * distance;
      const y = mousePos.y + Math.sin(angle) * distance;
      const newDot = createDot(x, y);
      setDots(prev => [newDot, ...prev].slice(-8));
    }
  }, [createDot, mousePos.x, mousePos.y]);

  useEffect(() => {
    // Désactiver sur mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;

    // Écouter les événements
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', () => setIsVisible(true), { passive: true });
    document.addEventListener('mouseleave', () => setIsVisible(false), { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Démarrer l'animation
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', () => setIsVisible(true));
      document.removeEventListener('mouseleave', () => setIsVisible(false));
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, handleClick, handleScroll, animate]);

  return (
    <>
      {dots.map((dot, index) => (
        <div
          key={index}
          className="fast-dot"
          style={{
            position: 'fixed',
            left: dot.x - dot.size / 2,
            top: dot.y - dot.size / 2,
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: dot.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${dot.size}px ${dot.color}60`,
            willChange: 'opacity',
          }}
        />
      ))}
    </>
  );
};

export default FastCursor;
