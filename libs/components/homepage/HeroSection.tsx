import React, { useEffect, useRef, useState } from 'react';

const WORDS = ['Future', 'Dream', 'University', 'Career', 'Path'];

function useTyping() {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const charIndex = useRef(0);

  useEffect(() => {
    const word = WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting) {
      timeout = setTimeout(() => {
        setText(word.slice(0, charIndex.current + 1));
        charIndex.current++;
        if (charIndex.current === word.length) {
          setDeleting(true);
          charIndex.current = word.length;
        }
      }, 90);
    } else {
      timeout = setTimeout(() => {
        setText(word.slice(0, charIndex.current - 1));
        charIndex.current--;
        if (charIndex.current === 0) {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % WORDS.length);
        }
      }, deleting && charIndex.current === word.length ? 2000 : 50);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex]);

  return text;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typedText = useTyping();
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NODES = 120;
    const pts: { ox: number; oy: number; oz: number }[] = [];
    const edges: [number, number][] = [];

    for (let i = 0; i < NODES; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / NODES);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push({
        ox: Math.sin(phi) * Math.cos(theta),
        oy: Math.sin(phi) * Math.sin(theta),
        oz: Math.cos(phi),
      });
    }

    for (let i = 0; i < NODES; i++) {
      for (let j = i + 1; j < NODES; j++) {
        const dx = pts[i].ox - pts[j].ox;
        const dy = pts[i].oy - pts[j].oy;
        const dz = pts[i].oz - pts[j].oz;
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 0.42) edges.push([i, j]);
      }
    }

    let rotX = 0.3, rotY = 0;
    const R = 200;

    function project(x: number, y: number, z: number) {
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      return { x: canvas.width / 2 + x2 * R, y: canvas.height / 2 - 20 + y1 * R, z: z2 };
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotY += 0.003;
      rotX += 0.0008;

      const projected = pts.map((p) => project(p.ox, p.oy, p.oz));

      edges.forEach(([i, j]) => {
        const a = projected[i], b = projected[j];
        const avgZ = (a.z + b.z) / 2;
        const alpha = ((avgZ + 1) / 2) * 0.2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(245,197,24,${alpha})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      });

      projected.forEach((p) => {
        const alpha = (p.z + 1) / 2;
        const size = 0.8 + alpha * 1.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,197,24,${alpha * 0.7})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '560px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(13,17,23,0.2) 0%, rgba(13,17,23,0.75) 100%)', zIndex: 2 }} />
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 20px', maxWidth: '900px' }}>
        <p style={{ color: '#f5c518', fontSize: '12px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
          The Ultimate Guide to Universities
        </p>
        <h1 style={{ color: '#ffffff', fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 700, lineHeight: 1.1, marginBottom: '20px', overflow: 'visible', whiteSpace: 'nowrap' }}>
          Find Your{' '}
          <span style={{ color: '#f5c518' }}>
            {typedText}
            <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
          </span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', lineHeight: 1.6, marginBottom: '32px' }}>
          Discover top universities in South Korea. Find your perfect match.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
          style={{ background: '#f5c518', color: '#0d1117', border: 'none', borderRadius: '8px', padding: '14px 36px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
        >
          Explore Universities
        </button>
      </div>
    </div>
  );
}
