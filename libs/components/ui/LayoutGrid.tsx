import React, { useState } from 'react';

interface CardItem {
  id: number;
  title: string;
  description?: string;
  thumbnail: string;
  span?: 'wide' | 'normal';
  onClick?: () => void;
}

const Card = ({ card, hovered, setHovered }: {
  card: CardItem & { index: number };
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}) => (
  <div
    onMouseEnter={() => setHovered(card.index)}
    onMouseLeave={() => setHovered(null)}
    onClick={card.onClick}
    style={{
      gridColumn: card.span === 'wide' ? 'span 2' : 'span 1',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative',
      height: '300px',
      cursor: 'pointer',
      transition: 'all 0.3s ease-out',
      filter: hovered !== null && hovered !== card.index ? 'blur(3px)' : 'none',
      transform: hovered !== null && hovered !== card.index ? 'scale(0.97)' : 'scale(1)',
      opacity: hovered !== null && hovered !== card.index ? 0.4 : 1,
    }}
  >
    <img
      src={card.thumbnail}
      alt={card.title}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      opacity: hovered === card.index ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      <p style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>
        {card.title}
      </p>
      {card.description && (
        <p style={{ color: '#d4d4d4', fontSize: '14px', marginTop: '8px', lineHeight: '1.5' }}>
          {card.description}
        </p>
      )}
    </div>
  </div>
);

export function LayoutGrid({ cards }: { cards: CardItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      width: '100%',
    }}>
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={{ ...card, index }}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
