import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typedText = useTyping();
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COLS: [number,number,number][] = [
      [66,133,244],[52,168,83],[251,188,4],[234,67,53],
      [138,180,248],[129,201,149],[197,138,249],[120,217,236],
      [255,160,120],[100,200,255],
    ];

    const orbs = Array.from({ length: 80 }, () => {
      const c = COLS[Math.floor(Math.random() * COLS.length)];
      return {
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        vy: 0.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.4,
        r: 2 + Math.random() * 5,
        cr: c[0], cg: c[1], cb: c[2],
        alpha: 0.5 + Math.random() * 0.5,
        t: Math.random() * 6.28,
        ts: 0.02 + Math.random() * 0.02,
      };
    });

    const trails = Array.from({ length: 25 }, () => {
      const c = COLS[Math.floor(Math.random() * COLS.length)];
      return {
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        vy: 1 + Math.random() * 2,
        len: 40 + Math.random() * 100,
        cr: c[0], cg: c[1], cb: c[2],
        alpha: 0.3 + Math.random() * 0.4,
        w: 0.5 + Math.random() * 1,
      };
    });

    let animId: number;
    const frame = () => {
      const W = cv.width; const H = cv.height;
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = '#0a0a14';
      cx.fillRect(0, 0, W, H);

      const rg = cx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.55);
      rg.addColorStop(0, 'rgba(66,133,244,0.07)');
      rg.addColorStop(0.6, 'rgba(52,168,83,0.04)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = rg;
      cx.fillRect(0, 0, W, H);

      trails.forEach(t => {
        t.y -= t.vy;
        if (t.y + t.len < 0) { t.y = H + t.len; t.x = Math.random() * W; }
        const lg = cx.createLinearGradient(t.x, t.y, t.x, t.y + t.len);
        lg.addColorStop(0, `rgba(${t.cr},${t.cg},${t.cb},${t.alpha})`);
        lg.addColorStop(1, `rgba(${t.cr},${t.cg},${t.cb},0)`);
        cx.beginPath(); cx.moveTo(t.x, t.y); cx.lineTo(t.x, t.y + t.len);
        cx.strokeStyle = lg; cx.lineWidth = t.w; cx.stroke();
      });

      orbs.forEach(o => {
        o.y -= o.vy; o.x += o.vx; o.t += o.ts;
        if (o.y + o.r < 0) { o.y = H + o.r; o.x = Math.random() * W; }
        if (o.x < 0) o.x = W; if (o.x > W) o.x = 0;
        const a = o.alpha * (0.7 + 0.3 * Math.sin(o.t));
        const rr = o.r * (0.9 + 0.1 * Math.sin(o.t));
        const g = cx.createRadialGradient(o.x, o.y, 0, o.x, o.y, rr * 3);
        g.addColorStop(0, `rgba(${o.cr},${o.cg},${o.cb},${a * 0.4})`);
        g.addColorStop(1, `rgba(${o.cr},${o.cg},${o.cb},0)`);
        cx.beginPath(); cx.arc(o.x, o.y, rr * 3, 0, 6.28); cx.fillStyle = g; cx.fill();
        cx.beginPath(); cx.arc(o.x, o.y, rr, 0, 6.28);
        cx.fillStyle = `rgba(${o.cr},${o.cg},${o.cb},${a})`; cx.fill();
      });

      animId = requestAnimationFrame(frame);
    };
    frame();

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
          onClick={() => router.push('/university')}
          style={{ background: '#f5c518', color: '#0d1117', border: 'none', borderRadius: '8px', padding: '14px 36px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
        >
          Explore Universities
        </button>
      </div>
    </div>
  );
}
