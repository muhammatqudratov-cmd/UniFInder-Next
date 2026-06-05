import React, { useState } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { REACT_APP_API_URL } from '../../config';

interface TooltipItem {
  _id: string;
  memberNick: string;
  memberType: string;
  memberImage?: string;
  onClick?: () => void;
}

export function AnimatedTooltip({ items }: { items: TooltipItem[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const half = rect.width / 2;
    x.set(e.clientX - rect.left - half);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
      {items.map((item) => (
        <div
          key={item._id}
          style={{ position: 'relative', marginRight: '-16px', cursor: 'pointer' }}
          onMouseEnter={() => setHoveredIndex(item._id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={handleMouseMove}
          onClick={item.onClick}
        >
          {hoveredIndex === item._id && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 10 } }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '8px',
                zIndex: 100,
                translateX,
                rotate,
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #1a1d26, #2a2d36)',
                border: '0.5px solid rgba(245,197,24,0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                textAlign: 'center',
              }}>
                <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0 }}>{item.memberNick}</p>
                <p style={{ color: '#f5c518', fontSize: '11px', margin: '2px 0 0' }}>{item.memberType}</p>
              </div>
            </motion.div>
          )}
          <motion.img
            src={item.memberImage ? `${REACT_APP_API_URL}/${item.memberImage}` : '/img/profile/defaultUser.svg'}
            alt={item.memberNick}
            whileHover={{ scale: 1.15, zIndex: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #1a1d26',
              position: 'relative',
              display: 'block',
            }}
          />
          <p style={{
            color: '#1a1a2e',
            fontSize: '13px',
            fontWeight: 600,
            textAlign: 'center',
            marginTop: '10px',
            whiteSpace: 'nowrap',
          }}>
            {item.memberNick}
          </p>
        </div>
      ))}
    </div>
  );
}
