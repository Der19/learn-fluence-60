import { useEffect, useRef, useState, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  color: string;
  size: number;
  opacity: number;
  life: number;
  twinkle: number;
  rotation: number;
}

const StarCursor = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();
  const lastMouseTime = useRef<number>(0);

  const colors = [
    '#ffd700', '#ff69b4', '#00bfff', '#ff1493', 
    '#32cd32', '#ff4500', '#9370db', '#00ced1',
    '#ff6347', '#1e90ff', '#ff8c00', '#da70d6',
    '#20b2aa', '#ffa500', '#ff69b4', '#00ff7f'
  ];

  const createStar = useCallback((x: number, y: number): Star => {
    return {
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      opacity: 1,
      life: 1,
      twinkle: Math.random() * Math.PI * 2,
      rotation: Math.random() * 360
    };
  }, [colors]);

  const updateStars = useCallback(() => {
    setStars(prev => 
      prev
        .map(star => ({
          ...star,
          opacity: star.opacity * 0.90,
          life: star.life + 1,
          twinkle: star.twinkle + 0.3,
          rotation: star.rotation + 2
        }))
        .filter(star => star.opacity > 0.05 && star.life < 80)
    );
  }, []);

  const animate = useCallback(() => {
    updateStars();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateStars]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    
    // Créer des étoiles
    if (now - lastMouseTime.current > 10) {
      lastMouseTime.current = now;
      const newStar = createStar(e.clientX, e.clientY);
      setStars(prev => [newStar, ...prev].slice(-15)); // Max 15 étoiles
    }
  }, [createStar]);

  const handleScroll = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleClick = useCallback(() => {
    // Explosion d'étoiles au clic
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const distance = Math.random() * 50 + 25;
      const x = mousePos.x + Math.cos(angle) * distance;
      const y = mousePos.y + Math.sin(angle) * distance;
      const newStar = createStar(x, y);
      setStars(prev => [newStar, ...prev].slice(-15));
    }
  }, [createStar, mousePos.x, mousePos.y]);

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
      {stars.map((star, index) => {
        const twinkleOpacity = (Math.sin(star.twinkle) + 1) / 2;
        const finalOpacity = star.opacity * (0.3 + twinkleOpacity * 0.7);
        
        return (
          <div
            key={index}
            className="star"
            style={{
              position: 'fixed',
              left: star.x - star.size / 2,
              top: star.y - star.size / 2,
              width: star.size,
              height: star.size,
              background: `radial-gradient(circle, ${star.color} 30%, transparent 70%)`,
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9999,
              opacity: finalOpacity,
              transform: `translate(-50%, -50%) rotate(${star.rotation}deg)`,
              boxShadow: `0 0 ${star.size}px ${star.color}80, 0 0 ${star.size * 2}px ${star.color}40, 0 0 ${star.size * 3}px ${star.color}20`,
              willChange: 'transform, opacity',
              transition: 'all 0.1s ease',
            }}
          />
        );
      })}
    </>
  );
};

export default StarCursor;
