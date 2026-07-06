import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import IosShareIcon from '@mui/icons-material/IosShare';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
// Autoplay removed — mobile swiper does not use it
import TopAgentCard from './TopAgentCard';
import { REACT_APP_API_URL } from '../../config';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../../apollo/user/query';

interface TopAgentsProps {
	initialInput: AgentsInquiry;
}

const TopAgents = (props: TopAgentsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topAgents, setTopAgents] = useState<Member[]>([]);

	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		const cards = Array.from(grid.querySelectorAll<HTMLElement>('.agent-card'));
		if (cards.length === 0) return;

		cards.forEach((card) => {
			card.style.opacity = '0';
			card.style.transform = 'translateY(24px)';
			card.style.filter = 'blur(6px)';
			card.style.transition = 'none';
		});

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					cards.forEach((card, i) => {
						setTimeout(() => {
							card.style.transition =
								'opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1), filter 0.9s cubic-bezier(.16,1,.3,1)';
							card.style.opacity = '1';
							card.style.transform = 'translateY(0)';
							card.style.filter = 'blur(0px)';
						}, i * 200);
					});
					observer.disconnect();
				}
			},
			{ threshold: 0.08 },
		);

		observer.observe(grid);
		return () => observer.disconnect();
	}, [topAgents]);

	/** APOLLO REQUESTS **/
	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopAgents(data?.getAgents?.list);
		},
	});
	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Agents</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-agents-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[]}
						>
							{topAgents.map((agent: Member) => {
								return (
									<SwiperSlide className={'top-agents-slide'} key={agent?._id}>
										<TopAgentCard agent={agent} key={agent?.memberNick} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		const avatarColors = ['av-coral', 'av-lav', 'av-sage'];
		return (
			<div className="top-agents">
				<style>{`
					.agents-grid .agent-card {
						transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1),
									filter 0.32s cubic-bezier(0.4, 0, 0.2, 1),
									box-shadow 0.32s cubic-bezier(0.4, 0, 0.2, 1),
									opacity 0.32s ease;
					}
					.agents-grid:has(.agent-card:hover) .agent-card:not(:hover) {
						filter: blur(3px);
						transform: scale(0.96);
						opacity: 0.68;
					}
					.agents-grid .agent-card:hover {
						transform: scale(1.048);
						box-shadow: 0 28px 60px rgba(100,160,210,0.36);
						position: relative;
						z-index: 2;
					}
				`}</style>

				<div className="agents-section-header">
					<div>
						<h2>Top Agents</h2>
						<p>Our top agents are always ready to serve you</p>
					</div>
					<span className="agents-see-all" onClick={() => router.push('/agent')}>
						See All Agents →
					</span>
				</div>

				<div
					ref={gridRef}
					className="agents-grid"
					style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', width: '100%' }}
				>
					{topAgents.slice(0, 4).map((agent: Member, index: number) => (
						<div
							key={agent._id}
							className="agent-card"
							onClick={() => router.push({ pathname: '/agent/detail', query: { agentId: agent._id } })}
							style={{
								position: 'relative',
								borderRadius: '28px',
								background: 'linear-gradient(160deg, #ffffff 45%, #cde8f6 100%)',
								border: '1px solid rgba(255,255,255,0.9)',
								boxShadow: '0 8px 32px rgba(100,160,210,0.12)',
								padding: '20px 20px 18px',
								cursor: 'pointer',
								display: 'flex',
								flexDirection: 'column',
								gap: '10px',
								minHeight: '360px',
							}}
						>
							{/* Circular avatar with blue ring */}
							<div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #a8d4ef', overflow: 'hidden', background: '#d0e8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#2a6496', flexShrink: 0 }}>
								{agent.memberImage
									? <img src={`${REACT_APP_API_URL}/${agent.memberImage}`} alt={agent.memberNick} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
									: (agent.memberFullName || agent.memberNick)?.charAt(0).toUpperCase()
								}
							</div>

							{/* Name + type */}
							<div>
								<div style={{ fontSize: 20, fontWeight: 700, color: '#111', lineHeight: 1.2 }}>
									{agent.memberFullName || agent.memberNick}
								</div>
								<div style={{ fontSize: 14, color: '#888', marginTop: 3 }}>
									{agent.memberType}
								</div>
							</div>

							{/* Tag badge */}
							{agent.memberType && (
								<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
									<span style={{ border: '1px solid #d0d0d0', borderRadius: '20px', padding: '3px 12px', fontSize: 12, color: '#444', background: 'rgba(255,255,255,0.7)' }}>
										{agent.memberType}
									</span>
								</div>
							)}

							{/* Stats row */}
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
								<div style={{ textAlign: 'center' }}>
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 17, fontWeight: 700, color: '#111' }}>
										<StarIcon style={{ fontSize: 17, color: '#111' }} />
										{agent.memberRank?.toFixed(1) || '—'}
									</div>
									<div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Rating</div>
								</div>
								<div style={{ width: 1, height: 32, background: '#ddd' }} />
								<div style={{ textAlign: 'center' }}>
									<div style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>{agent.memberLikes || 0}</div>
									<div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Clients</div>
								</div>
								<div style={{ width: 1, height: 32, background: '#ddd' }} />
								<div style={{ textAlign: 'center' }}>
									<div style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>{agent.memberViews || 0}</div>
									<div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Views</div>
								</div>
							</div>

							{/* Bottom action row */}
							<div style={{ display: 'flex', marginTop: 4 }}>
								<button
									onClick={(e) => { e.stopPropagation(); router.push({ pathname: '/agent/detail', query: { agentId: agent._id } }); }}
									style={{ flex: 1, height: 46, borderRadius: '50px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.1)', fontSize: 14, fontWeight: 600, color: '#111', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
								>
									Get in touch
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
