import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import { REACT_APP_API_URL } from '../../config';
import PersonIcon from '@mui/icons-material/Person';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const AgentHeroNameContext = createContext<{
	agentHeroName: string;
	setAgentHeroName: (name: string) => void;
}>({
	agentHeroName: '',
	setAgentHeroName: () => {},
});

interface StatItem {
	numericValue: number;
	suffix: string;
	decimals: number;
	label: string;
}

const CountUpStat = ({
	target,
	suffix,
	decimals = 0,
	duration = 900,
}: {
	target: number;
	suffix: string;
	decimals?: number;
	duration?: number;
}) => {
	const [value, setValue] = useState(0);
	useEffect(() => {
		let start: number | null = null;
		const step = (timestamp: number) => {
			if (start === null) start = timestamp;
			const progress = Math.min((timestamp - start) / duration, 1);
			setValue(target * progress);
			if (progress < 1) requestAnimationFrame(step);
		};
		const raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [target, duration]);
	return (
		<strong>
			{value.toFixed(decimals)}
			{suffix}
		</strong>
	);
};

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const [heroVisible, setHeroVisible] = useState(false);
		const [rotatingWordIndex, setRotatingWordIndex] = useState(0);
		const [rotatingWordKey, setRotatingWordKey] = useState(0);

		const communityUniversities = [
			{ name: 'Incheon National University', initials: 'INU' },
			{ name: 'Seoul National University', initials: 'SNU' },
			{ name: 'Yonsei University', initials: 'YU' },
			{ name: 'Korea University', initials: 'KU' },
			{ name: 'Sungkyunkwan University', initials: 'SKKU' },
		];

		const [browsingIndex, setBrowsingIndex] = useState(0);
		const [browsingKey, setBrowsingKey] = useState(0);
		const user = useReactiveVar(userVar);
		const [agentHeroName, setAgentHeroName] = useState('');

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '',
				eyebrow: string | undefined = undefined,
				stats: StatItem[] | undefined = undefined,
				marqueeItems: string[] | undefined = undefined;

			switch (router.pathname) {
				case '/university':
					title = 'University Search';
					desc =
						'Explore 240+ institutions, compare programs, dormitories and scholarships — all in one place. We are glad to see you again!';
					bgImage = '';
					eyebrow = 'FIND YOUR FUTURE CAMPUS';
					stats = [
						{ numericValue: 240, suffix: '+', decimals: 0, label: 'Universities' },
						{ numericValue: 18, suffix: 'k', decimals: 0, label: 'Programs' },
						{ numericValue: 9.4, suffix: '★', decimals: 1, label: 'Avg. rating' },
					];
					break;
				case '/agent':
					title = 'Meet the agents';
					desc = 'behind';
					bgImage = '';
					eyebrow = 'AGENT DIRECTORY';
					stats = [
						{ numericValue: 2, suffix: '', decimals: 0, label: 'Active agents' },
						{ numericValue: 60, suffix: '+', decimals: 0, label: 'Universities covered' },
					];
					marqueeItems = [
						'Cambridge',
						'ETH Zürich',
						'NUS',
						'Harvard',
						'Toronto',
						'Melbourne',
						'Tokyo',
						'TUM',
						'Imperial',
						'Stanford',
						'MIT',
						'Oxford',
					];
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'Helping students find the right campus, dormitory and scholarship — one listing at a time.';
					bgImage = '';
					eyebrow = 'VERIFIED AGENT';
					break;
				case '/mypage':
					title = 'Welcome to your profile';
					desc = 'Manage your listings, profile and community — all in one calm place.';
					bgImage = '';
					eyebrow = 'MY PAGE';
					break;
				case '/community':
					title = 'Voices on campus';
					desc = '';
					bgImage = '';
					eyebrow = 'COMMUNITY';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Home / Community Post';
					bgImage = '';
					eyebrow = 'COMMUNITY POST';
					break;
				case '/cs':
					title = 'CS';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/korea2.jpg';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/korea2.jpg';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Home / Member Profile';
					bgImage = '';
					eyebrow = 'AGENT PROFILE';
					break;
				default:
					break;
			}

			return { title, desc, bgImage, eyebrow, stats, marqueeItems };
		}, [router.pathname, agentHeroName]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		useEffect(() => {
			setHeroVisible(false);
			const id = requestAnimationFrame(() => setHeroVisible(true));
			return () => cancelAnimationFrame(id);
		}, [router.pathname]);

		useEffect(() => {
			if (!memoizedValues.marqueeItems) return;
			const id = setInterval(() => {
				setRotatingWordIndex((prev) => (prev + 1) % memoizedValues.marqueeItems!.length);
				setRotatingWordKey((prev) => prev + 1);
			}, 1400);
			return () => clearInterval(id);
		}, [memoizedValues.marqueeItems]);

		useEffect(() => {
			if (router.pathname !== '/community') return;
			const id = setInterval(() => {
				setBrowsingIndex((prev) => (prev + 1) % communityUniversities.length);
				setBrowsingKey((prev) => prev + 1);
			}, 2000);
			return () => clearInterval(id);
		}, [router.pathname]);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>UniFinder</title>
						<meta name={'title'} content={`UniFinder`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<AgentHeroNameContext.Provider value={{ agentHeroName, setAgentHeroName }}>
				<>
					<Head>
						<title>UniFinder</title>
						<meta name={'title'} content={`UniFinder`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						{router.pathname !== '/cs' && (
						<Stack
							className={`header-basic ${authHeader && 'auth'} ${memoizedValues.marqueeItems ? 'agent-hero' : ''} ${
								router.pathname === '/university' ? 'university-hero' : ''
							} ${router.pathname === '/community' ? 'community-hero' : ''} ${
								router.pathname === '/mypage' ? 'mypage-hero' : ''
							} ${router.pathname === '/agent/detail' ? 'agent-detail-hero' : ''}`}
							style={
								memoizedValues.bgImage
									? { backgroundImage: `url(${memoizedValues.bgImage})`, backgroundSize: 'cover' }
									: undefined
							}
						>
							{!memoizedValues.marqueeItems && router.pathname !== '/community' && router.pathname !== '/mypage' && (
								<Stack className={'overlay'} />
							)}
							{memoizedValues.marqueeItems ? (
								<>
									<Stack className={'glow-circle'} />
									<Stack className={'container agent-hero-container'}>
										<Stack className={'eyebrow light'}>
											<span className={'dot'} />
											{t(memoizedValues.eyebrow!)}
										</Stack>
										<strong className={'agent-heading'}>{t(memoizedValues.title)}</strong>
										<Stack className={'agent-heading-row'}>
											<span className={'muted-word'}>{t(memoizedValues.desc)}</span>
											<span className={'rotating-word-stage'}>
												<span key={rotatingWordKey} className={'rotating-word'}>
													{memoizedValues.marqueeItems[rotatingWordIndex]}
												</span>
											</span>
										</Stack>
										<span className={'underline-bar'} />
										<Stack className={'stats-row dark'}>
											{memoizedValues.stats!.map((s, i) => (
												<React.Fragment key={s.label}>
													{i > 0 && <span className={'stat-divider dark'} />}
													<Stack className={'stat dark'}>
														<CountUpStat target={s.numericValue} suffix={s.suffix} decimals={s.decimals} />
														<span>{s.label}</span>
													</Stack>
												</React.Fragment>
											))}
										</Stack>
									</Stack>
									<Stack className={'marquee-row'}>
										<Stack className={'marquee-track'}>
											{[...memoizedValues.marqueeItems, ...memoizedValues.marqueeItems].map((name, i) => (
												<span className={'marquee-pill'} key={`${name}-${i}`}>
													{name}
												</span>
											))}
										</Stack>
									</Stack>
								</>
							) : router.pathname === '/community' ? (
								<Stack className={'container community-hero-container'}>
									<Stack className={'community-hero-text'}>
										<Stack className={'eyebrow plain'}>{t(memoizedValues.eyebrow!)}</Stack>
										<strong className={'community-heading'}>
											Voices on
											<br />
											<span className={'accent-chip'}>campus</span>
										</strong>
									</Stack>
									<Stack className={'browsing-card-stack'}>
										{[0, 1, 2].map((offset) => {
											const uni = communityUniversities[(browsingIndex + offset) % communityUniversities.length];
											return (
												<Stack key={offset} className={'browsing-card'}>
													<Stack className={'browsing-text'}>
														{offset === 0 && <span className={'browsing-label'}>You are browsing</span>}
														<span key={`${browsingKey}-${offset}`} className={'browsing-name'}>
															{uni.name}
														</span>
													</Stack>
													<Stack key={`badge-${browsingKey}-${offset}`} className={'browsing-badge'}>
														{uni.initials}
													</Stack>
												</Stack>
											);
										})}
									</Stack>
								</Stack>
							) : router.pathname === '/mypage' ? (
								<Stack className={'container mypage-hero-container'}>
									<Stack className={'mypage-blob-1'} />
									<Stack className={'mypage-blob-2'} />
									<Stack className={'mypage-hero-text'}>
										<strong className={`mypage-heading${heroVisible ? ' fade-in-up' : ''}`}>
											Welcome to
											<br />
											your profile
										</strong>
										<span className={'underline-bar'} />
										<p className={`mypage-lead${heroVisible ? ' fade-in-up delay-1' : ''}`}>{t(memoizedValues.desc)}</p>
									</Stack>
								</Stack>
							) : router.pathname === '/agent/detail' ? (
								<Stack className={'container agent-detail-hero-container'}>
									<span className={'agent-detail-breadcrumb'}>Home / Agents / {agentHeroName || '...'}</span>
									<Stack className={'verified-badge'}>
										<span className={'verified-dot'} />
										{t(memoizedValues.eyebrow!)}
									</Stack>
									<strong className={'agent-detail-heading'}>{t(memoizedValues.title)}</strong>
									<p className={'agent-detail-lead'}>{t(memoizedValues.desc)}</p>
								</Stack>
							) : router.pathname === '/member' ? (
								<Stack className={'container member-hero-container'}>
									<Stack className={'eyebrow member-eyebrow'}>
										<span className={'dash'} />
										{t(memoizedValues.eyebrow!)}
									</Stack>
									<strong className={'member-heading'}>{t(memoizedValues.title)}</strong>
									<span>{t(memoizedValues.desc)}</span>
								</Stack>
							) : router.pathname === '/community/detail' ? (
								<Stack className={'container community-detail-hero-container'}>
									<Stack className={'eyebrow'}>
										<span className={'dash'} />
										{t(memoizedValues.eyebrow!)}
									</Stack>
									<strong className={'community-detail-heading'}>{t(memoizedValues.title)}</strong>
									<span>{t(memoizedValues.desc)}</span>
								</Stack>
							) : (
								<Stack className={`container${memoizedValues.stats ? ' has-stats' : ''}`}>
									{memoizedValues.stats ? (
										<>
											<Stack className={'eyebrow'}>
												<span className={'dash'} />
												{t(memoizedValues.eyebrow!)}
											</Stack>
											<strong className={heroVisible ? 'fade-in-up' : ''}>{t(memoizedValues.title)}</strong>
											<p className={`lead${heroVisible ? ' fade-in-up delay-1' : ''}`}>{t(memoizedValues.desc)}</p>
											<Stack className={'stats-row'}>
												{memoizedValues.stats.map((s, i) => (
													<React.Fragment key={s.label}>
														{i > 0 && <span className={'stat-divider'} />}
														<Stack className={'stat'}>
															<CountUpStat target={s.numericValue} suffix={s.suffix} decimals={s.decimals} />
															<span>{s.label}</span>
														</Stack>
													</React.Fragment>
												))}
											</Stack>
										</>
									) : (
										<>
											<strong>{t(memoizedValues.title)}</strong>
											<span>{t(memoizedValues.desc)}</span>
										</>
									)}
								</Stack>
							)}
						</Stack>
						)}

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
				</AgentHeroNameContext.Provider>
			);
		}
	};
};

export default withLayoutBasic;
