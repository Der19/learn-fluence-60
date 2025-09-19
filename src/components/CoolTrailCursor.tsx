import { useEffect, useRef, useState, useCallback } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  color: string;
  size: number;
  opacity: number;
  life: number;
}

const CoolTrailCursor = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();
  const lastMouseTime = useRef<number>(0);

  const colors = [
    '#ff0080', '#00ff80', '#8000ff', '#ff8000', 
    '#0080ff', '#ff4040', '#40ff40', '#4040ff',
    '#ff8040', '#40ff80', '#8040ff', '#ff4080'
  ];

  const createTrailPoint = useCallback((x: number, y: number): TrailPoint => {
    return {
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      opacity: 1,
      life: 1
    };
  }, [colors]);

  const updateTrail = useCallback(() => {
    setTrail(prev => 
      prev
        .map(point => ({
          ...point,
          opacity: point.opacity * 0.92,
          life: point.life + 1
        }))
        .filter(point => point.opacity > 0.05 && point.life < 50)
    );
  }, []);

  const animate = useCallback(() => {
    updateTrail();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateTrail]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    
    // Créer des points de traînée
    if (now - lastMouseTime.current > 8) { // Très fréquent
      lastMouseTime.current = now;
      const newPoint = createTrailPoint(e.clientX, e.clientY);
      setTrail(prev => [newPoint, ...prev].slice(-20)); // Max 20 points
    }
  }, [createTrailPoint]);

  const handleScroll = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleClick = useCallback(() => {
    // Explosion de points au clic
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 30;
      const x = mousePos.x + Math.cos(angle) * distance;
      const y = mousePos.y + Math.sin(angle) * distance;
      const newPoint = createTrailPoint(x, y);
      setTrail(prev => [newPoint, ...prev].slice(-20));
    }
  }, [createTrailPoint, mousePos.x, mousePos.y]);

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
      {trail.map((point, index) => (
        <div
          key={index}
          className="trail-point"
          style={{
            position: 'fixed',
            left: point.x - point.size / 2,
            top: point.y - point.size / 2,
            width: point.size,
            height: point.size,
            backgroundColor: point.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: point.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${point.size * 2}px ${point.color}80, 0 0 ${point.size * 4}px ${point.color}40`,
            willChange: 'transform, opacity',
            transition: 'all 0.1s ease',
          }}
        />
      ))}
    </>
  );
};

export default CoolTrailCursor;
