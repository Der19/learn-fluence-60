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

interface ParticleCursorProps {
  enabled?: boolean;
  particleCount?: number;
  colors?: string[];
}

const ParticleCursor = ({ 
  enabled = true, 
  particleCount = 8, // Réduit pour plus de fluidité
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43']
}: ParticleCursorProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();
  const lastMouseTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const createParticle = useCallback((x: number, y: number): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5; // Vitesse réduite
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: Math.random() * 40 + 20, // Durée de vie réduite
        size: Math.random() * 3 + 1.5 // Taille réduite
      };
    }, [colors]);

    const updateParticles = useCallback(() => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx * 0.95, // Friction augmentée
            vy: particle.vy * 0.95,
            life: particle.life - 1
          }))
          .filter(particle => particle.life > 0)
      );
    }, []);

    const animate = () => {
      updateParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
      const now = Date.now();
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Créer de nouvelles particules moins fréquemment pour plus de fluidité
      if (now - lastMouseTime.current > 16 && Math.random() < 0.2) { // 60fps max
        lastMouseTime.current = now;
        const newParticle = createParticle(e.clientX, e.clientY);
        setParticles(prev => [...prev, newParticle].slice(-particleCount));
      }
    }, [createParticle, particleCount]);

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleClick = useCallback(() => {
      // Créer une explosion de particules au clic (réduite)
      for (let i = 0; i < 5; i++) {
        const newParticle = createParticle(mousePos.x, mousePos.y);
        setParticles(prev => [...prev, newParticle].slice(-particleCount));
      }
    }, [createParticle, particleCount, mousePos.x, mousePos.y]);

    // Écouter les événements
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', () => setIsVisible(true));
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleClick);

    // Démarrer l'animation
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', () => setIsVisible(true));
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, colors, particleCount, handleMouseMove, handleClick, updateParticles]);

  if (!enabled) return null;

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
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}80`,
          }}
        />
      ))}
    </>
  );
};

export default ParticleCursor;
