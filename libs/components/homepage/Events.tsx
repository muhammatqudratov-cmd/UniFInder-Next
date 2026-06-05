import React, { useRef } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
    eventTitle: string;
    city: string;
    description: string;
    imageSrc: string;
    code: string;
}

const eventsData: EventData[] = [
    {
        eventTitle: 'Paradise City Theme Park',
        city: 'Incheon',
        description: 'Experience magic and wonder in Incheon with a visit to the night-themed indoor theme park Wonderbox!',
        imageSrc: '/img/events/INCHEON.webp',
        code: '#IC01',
    },
    {
        eventTitle: 'Taebaeksan Snow Festival',
        city: 'Seoul',
        description: 'If you have the opportunity to travel to South Korea, do not miss the Taebaeksan Snow Festival!',
        imageSrc: '/img/events/SEOUL.webp',
        code: '#SE02',
    },
    {
        eventTitle: 'Suseong Lake Event',
        city: 'Daegu',
        description: 'The Suseong Lake Festival is a culture and arts festival held alongside Suseongmot Lake!',
        imageSrc: '/img/events/DAEGU.webp',
        code: '#DG03',
    },
    {
        eventTitle: 'Sand Festival',
        city: 'Busan',
        description: 'Haeundae Sand Festival, the nation\'s largest eco-friendly exhibition on sand, is held at Haeundae Beach!',
        imageSrc: '/img/events/BUSAN.webp',
        code: '#BS04',
    },
];

const EventCard = ({ event }: { event: EventData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) scale(1.02)`;
        card.style.boxShadow = `${-dx * 6}px ${-dy * 6}px 30px rgba(245,197,24,0.12)`;
        if (imgRef.current) imgRef.current.style.transform = `translate(${dx * 4}px, ${dy * 4}px) scale(1.08)`;
        if (badgeRef.current) badgeRef.current.style.transform = `translateZ(20px) translate(${dx * 2}px, ${dy * 2}px)`;
    };

    const handleMouseEnter = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.borderColor = 'rgba(245,197,24,0.3)';
        if (infoRef.current) { infoRef.current.style.transform = 'translateY(0)'; infoRef.current.style.opacity = '1'; }
        if (descRef.current) { descRef.current.style.maxHeight = '60px'; descRef.current.style.opacity = '1'; }
        if (btnRef.current) { btnRef.current.style.maxHeight = '40px'; btnRef.current.style.opacity = '1'; btnRef.current.style.marginTop = '12px'; }
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
        card.style.boxShadow = 'none';
        card.style.borderColor = 'rgba(255,255,255,0.07)';
        if (imgRef.current) imgRef.current.style.transform = 'translate(0,0) scale(1)';
        if (badgeRef.current) badgeRef.current.style.transform = 'translateZ(0)';
        if (infoRef.current) { infoRef.current.style.transform = 'translateY(8px)'; infoRef.current.style.opacity = '0.7'; }
        if (descRef.current) { descRef.current.style.maxHeight = '0'; descRef.current.style.opacity = '0'; }
        if (btnRef.current) { btnRef.current.style.maxHeight = '0'; btnRef.current.style.opacity = '0'; btnRef.current.style.marginTop = '0'; }
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#1a1d26',
                border: '0.5px solid rgba(255,255,255,0.07)',
                cursor: 'pointer',
                transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease, border-color 0.3s',
                willChange: 'transform',
                transformStyle: 'preserve-3d',
                position: 'relative',
            }}
        >
            <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
                <div
                    ref={imgRef}
                    style={{
                        position: 'absolute',
                        inset: '-10px',
                        backgroundImage: `url(${event.imageSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'saturate(0.5) brightness(0.7)',
                        transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(13,17,23,0.95) 100%)' }} />
                <div
                    ref={badgeRef}
                    style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        background: 'rgba(245,197,24,0.15)',
                        border: '0.5px solid rgba(245,197,24,0.35)',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        transition: 'transform 0.3s ease',
                        zIndex: 2,
                    }}
                >
                    <span style={{ color: '#f5c518', fontSize: '11px', fontWeight: 500 }}>{event.city}</span>
                </div>
                <div
                    ref={infoRef}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '20px',
                        transform: 'translateY(8px)',
                        opacity: 0.7,
                        transition: 'all 0.35s ease',
                        zIndex: 2,
                    }}
                >
                    <div style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>{event.eventTitle}</div>
                    <div
                        ref={descRef}
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '11px',
                            lineHeight: 1.5,
                            maxHeight: 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.35s ease, opacity 0.35s ease',
                            opacity: 0,
                        }}
                    >
                        {event.description}
                    </div>
                    <div
                        ref={btnRef}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            maxHeight: 0,
                            overflow: 'hidden',
                            opacity: 0,
                            marginTop: 0,
                            transition: 'max-height 0.35s ease 0.05s, margin 0.35s ease, opacity 0.35s ease',
                        }}
                    >
                        <div style={{ width: '20px', height: '20px', background: '#f5c518', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: '#0d1117', fontSize: '10px', fontWeight: 700 }}>→</span>
                        </div>
                        <span style={{ color: '#f5c518', fontSize: '12px' }}>Explore</span>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px 12px', fontFamily: 'monospace' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{event.eventTitle}</span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>{event.code}</span>
            </div>
        </div>
    );
};

const Events = () => {
    const device = useDeviceDetect();

    if (device === 'mobile') {
        return <div>EVENTS</div>;
    }

    return (
        <Stack style={{ background: '#0d1117', padding: '80px 0' }}>
            <Stack className={'container'} style={{ flexDirection: 'column' }}>
                <Box style={{ marginBottom: '36px' }}>
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <Box style={{ width: '28px', height: '2px', background: '#f5c518' }} />
                        <span style={{ color: '#f5c518', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' }}>
                            Discover Korea
                        </span>
                    </Box>
                    <Box component={'h2'} style={{ color: '#fff', fontSize: '32px', fontWeight: 500, margin: '0 0 6px' }}>
                        Events & Festivals
                    </Box>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>
                        Events waiting your attention!
                    </p>
                </Box>
                <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', perspective: '1000px' }}>
                    {eventsData.map((event) => (
                        <EventCard key={event.eventTitle} event={event} />
                    ))}
                </Box>
            </Stack>
        </Stack>
    );
};

export default Events;
