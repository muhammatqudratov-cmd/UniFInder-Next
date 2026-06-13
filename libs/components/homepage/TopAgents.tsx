import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
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
							modules={[Autoplay]}
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
				<div className="agents-section-header">
					<div>
						<h2>Top Agents</h2>
						<p>Our top agents are always ready to serve you</p>
					</div>
					<span className="agents-see-all" onClick={() => router.push('/agent')}>
						See All Agents →
					</span>
				</div>

				<div className="agents-grid">
					{topAgents.map((agent: Member, index: number) => (
						<div
							key={agent._id}
							className="agent-card"
							onClick={() => router.push({ pathname: '/agent/detail', query: { agentId: agent._id } })}
						>
							<div className={`agent-avatar ${avatarColors[index % avatarColors.length]}`}>
								{agent.memberImage
									? <img src={`${REACT_APP_API_URL}/${agent.memberImage}`} alt={agent.memberNick} />
									: agent.memberNick?.charAt(0).toUpperCase()
								}
							</div>
							<div className="agent-name">{agent.memberFullName || agent.memberNick}</div>
							<div className="agent-company">{agent.memberType}</div>
							<div className="agent-rating">
								<span className="star">★</span>
								<span>{agent.memberRank?.toFixed(1) || '—'}</span>
								<span className="count">({agent.memberLikes || 0})</span>
							</div>
							<div className="agent-stats">
								<div className="stat-item">
									<span className="stat-val">{agent.memberLikes || 0}</span>
									<span className="stat-lbl">Students</span>
								</div>
								<div className="stat-item">
									<span className="stat-val">{agent.memberViews || 0}</span>
									<span className="stat-lbl">Views</span>
								</div>
								<div className="stat-item">
									<span className="stat-val">{agent.memberRank || 0}</span>
									<span className="stat-lbl">Rank</span>
								</div>
							</div>
							<button
								className="agent-btn"
								onClick={(e) => {
									e.stopPropagation();
									router.push({ pathname: '/agent/detail', query: { agentId: agent._id } });
								}}
							>
								View Profile
							</button>
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
		limit: 8,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
