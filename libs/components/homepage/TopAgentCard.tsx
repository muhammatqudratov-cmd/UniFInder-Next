import React from 'react';
import { useRouter } from 'next/router';
import StarIcon from '@mui/icons-material/Star';
import IosShareIcon from '@mui/icons-material/IosShare';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Member } from '../../types/member/member';

interface TopAgentProps {
	agent: Member;
}

const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	return (
		<div
			onClick={() => router.push({ pathname: '/agent/detail', query: { agentId: agent._id } })}
			style={{
				position: 'relative',
				borderRadius: '28px',
				background: 'linear-gradient(160deg, #ffffff 45%, #cde8f6 100%)',
				border: '1px solid rgba(255,255,255,0.9)',
				boxShadow: '0 8px 32px rgba(100,160,210,0.12)',
				padding: '18px 18px 16px',
				cursor: 'pointer',
				display: 'flex',
				flexDirection: 'column',
				gap: '10px',
				minHeight: '340px',
				width: '100%',
			}}
		>
			{/* Share icon */}
			<button
				onClick={(e) => { e.stopPropagation(); router.push({ pathname: '/agent/detail', query: { agentId: agent._id } }); }}
				style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}
			>
				<IosShareIcon style={{ fontSize: 18 }} />
			</button>

			{/* Avatar */}
			<div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid #a8d4ef', overflow: 'hidden', background: '#d0e8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#2a6496' }}>
				<img src={agentImage} alt={agent?.memberNick} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
			</div>

			{/* Name + type */}
			<div>
				<div style={{ fontSize: 18, fontWeight: 700, color: '#111', lineHeight: 1.2 }}>
					{agent?.memberNick}
				</div>
				<div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
					{agent?.memberType}
				</div>
			</div>

			{/* Tag */}
			{agent?.memberType && (
				<span style={{ alignSelf: 'flex-start', border: '1px solid #d0d0d0', borderRadius: '20px', padding: '3px 12px', fontSize: 11, color: '#444', background: 'rgba(255,255,255,0.7)' }}>
					{agent?.memberType}
				</span>
			)}

			{/* Stats */}
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
				<div style={{ textAlign: 'center' }}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, fontSize: 15, fontWeight: 700, color: '#111' }}>
						<StarIcon style={{ fontSize: 15 }} />
						{agent?.memberRank?.toFixed(1) || '—'}
					</div>
					<div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>Rating</div>
				</div>
				<div style={{ width: 1, height: 28, background: '#ddd' }} />
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{agent?.memberLikes || 0}</div>
					<div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>Clients</div>
				</div>
				<div style={{ width: 1, height: 28, background: '#ddd' }} />
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{agent?.memberViews || 0}</div>
					<div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>Views</div>
				</div>
			</div>

			{/* Bottom buttons */}
			<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
				<button
					onClick={(e) => { e.stopPropagation(); router.push({ pathname: '/agent/detail', query: { agentId: agent._id } }); }}
					style={{ flex: 1, height: 42, borderRadius: '50px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 600, color: '#111', cursor: 'pointer' }}
				>
					Get in touch
				</button>
				<button
					onClick={(e) => e.stopPropagation()}
					style={{ width: 42, height: 42, borderRadius: '50%', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
				>
					<BookmarkBorderIcon style={{ fontSize: 18, color: '#333' }} />
				</button>
			</div>
		</div>
	);
};

export default TopAgentCard;
