import { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

const AutoParticleCursor = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();
  const lastMouseTime = useRef<number>(0);
  const frameCount = useRef<number>(0);

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
    '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', 
    '#00d2d3', '#ff9f43', '#ff3838', '#2ed573'
  ];

  const createParticle = useCallback((x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.8 + 0.2; // Vitesse réduite pour plus de traînée
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      maxLife: Math.random() * 60 + 30, // Durée de vie augmentée
      size: Math.random() * 3 + 2 // Taille augmentée
    };
  }, [colors]);

  const updateParticles = useCallback(() => {
    setParticles(prev => 
      prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.96, // Friction réduite pour plus de mouvement
          vy: particle.vy * 0.96,
          life: particle.life - 1
        }))
        .filter(particle => particle.life > 0)
    );
  }, []);

  const animate = useCallback(() => {
    frameCount.current++;
    updateParticles();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    
    // Créer des particules de manière optimisée
    if (now - lastMouseTime.current > 15 && Math.random() < 0.25) { // Plus fréquent
      lastMouseTime.current = now;
      const newParticle = createParticle(e.clientX, e.clientY);
      setParticles(prev => [...prev, newParticle].slice(-10)); // Max 10 particules
    }
  }, [createParticle]);

  const handleScroll = useCallback(() => {
    // Maintenir la visibilité pendant le scroll
    setIsVisible(true);
    
    // Créer quelques particules pendant le scroll pour l'effet
    if (Math.random() < 0.1) {
      const newParticle = createParticle(mousePos.x, mousePos.y);
      setParticles(prev => [...prev, newParticle].slice(-10));
    }
  }, [createParticle, mousePos.x, mousePos.y]);

  const handleClick = useCallback(() => {
    // Explosion de particules au clic
    for (let i = 0; i < 4; i++) {
      const newParticle = createParticle(mousePos.x, mousePos.y);
      setParticles(prev => [...prev, newParticle].slice(-6));
    }
  }, [createParticle, mousePos.x, mousePos.y]);

  useEffect(() => {
    // Désactiver sur mobile pour les performances
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
  }, [handleMouseMove, handleClick, animate]);

  return (
    <>
      {particles.map((particle, index) => (
        <div
          key={index}
          className="particle"
          style={{
            position: 'fixed',
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: particle.life / particle.maxLife,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}60`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
};

export default AutoParticleCursor;
