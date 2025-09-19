import { useEffect, useRef, useState, useCallback } from 'react';

interface BrushStroke {
  x: number;
  y: number;
  color: string;
  size: number;
  opacity: number;
  life: number;
  angle: number;
}

const PaintBrushCursor = () => {
  const [strokes, setStrokes] = useState<BrushStroke[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();
  const lastMouseTime = useRef<number>(0);

  const colors = [
    '#ff1744', '#e91e63', '#9c27b0', '#673ab7', 
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
  ];

  const createBrushStroke = useCallback((x: number, y: number): BrushStroke => {
    return {
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 6,
      opacity: 1,
      life: 1,
      angle: Math.random() * 360
    };
  }, [colors]);

  const updateStrokes = useCallback(() => {
    setStrokes(prev => 
      prev
        .map(stroke => ({
          ...stroke,
          opacity: stroke.opacity * 0.88,
          life: stroke.life + 1,
          size: stroke.size * 0.98
        }))
        .filter(stroke => stroke.opacity > 0.03 && stroke.life < 60)
    );
  }, []);

  const animate = useCallback(() => {
    updateStrokes();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateStrokes]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    
    // Créer des coups de pinceau
    if (now - lastMouseTime.current > 5) { // Très fréquent
      lastMouseTime.current = now;
      const newStroke = createBrushStroke(e.clientX, e.clientY);
      setStrokes(prev => [newStroke, ...prev].slice(-25)); // Max 25 coups
    }
  }, [createBrushStroke]);

  const handleScroll = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleClick = useCallback(() => {
    // Explosion de coups de pinceau au clic
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = Math.random() * 40 + 20;
      const x = mousePos.x + Math.cos(angle) * distance;
      const y = mousePos.y + Math.sin(angle) * distance;
      const newStroke = createBrushStroke(x, y);
      setStrokes(prev => [newStroke, ...prev].slice(-25));
    }
  }, [createBrushStroke, mousePos.x, mousePos.y]);

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
      {strokes.map((stroke, index) => (
        <div
          key={index}
          className="brush-stroke"
          style={{
            position: 'fixed',
            left: stroke.x - stroke.size / 2,
            top: stroke.y - stroke.size / 2,
            width: stroke.size,
            height: stroke.size,
            backgroundColor: stroke.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: stroke.opacity,
            transform: `translate(-50%, -50%) rotate(${stroke.angle}deg)`,
            boxShadow: `0 0 ${stroke.size}px ${stroke.color}90, 0 0 ${stroke.size * 2}px ${stroke.color}50`,
            willChange: 'transform, opacity',
            transition: 'all 0.05s ease',
          }}
        />
      ))}
    </>
  );
};

export default PaintBrushCursor;
