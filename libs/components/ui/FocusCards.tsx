import React, { useState } from 'react';

interface CardItem {
  title: string;
  src: string;
  onClick?: () => void;
}

const Card = React.memo(({ card, index, hovered, setHovered }: {
  card: CardItem;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    onClick={card.onClick}
    style={{
      transition: 'all 0.3s ease-out',
      filter: hovered !== null && hovered !== index ? 'blur(4px)' : 'none',
      transform: hovered !== null && hovered !== index ? 'scale(0.98)' : 'scale(1)',
      opacity: hovered !== null && hovered !== index ? 0.4 : 1,
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      height: '380px',
      cursor: 'pointer',
      flex: '1',
    }}
  >
    <img
      src={card.src}
      alt={card.title}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 60%)',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '24px',
      opacity: hovered === index ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      <span style={{
        color: '#fff',
        fontSize: '20px',
        fontWeight: 600,
        textTransform: 'capitalize',
      }}>
        {card.title}
      </span>
    </div>
  </div>
));

Card.displayName = 'Card';

export function FocusCards({ cards }: { cards: CardItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      width: '100%',
    }}>
      {cards.map((card, index) => (
        <Card key={card.title + index} card={card} index={index} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  );
}
