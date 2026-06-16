import React, { useEffect, useMemo, useState } from 'react';
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
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '',
				eyebrow: string | undefined = undefined,
				stats: StatItem[] | undefined = undefined;

			switch (router.pathname) {
				case '/university':
					title = 'University Search';
					desc =
						'Explore 240+ institutions, compare programs, dormitories and scholarships — all in one place. We are glad to see you again!';
					bgImage = '/img/banner/universities.png';
					eyebrow = 'FIND YOUR FUTURE CAMPUS';
					stats = [
						{ numericValue: 240, suffix: '+', decimals: 0, label: 'Universities' },
						{ numericValue: 18, suffix: 'k', decimals: 0, label: 'Programs' },
						{ numericValue: 9.4, suffix: '★', decimals: 1, label: 'Avg. rating' },
					];
					break;
				case '/agent':
					title = 'Agents';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/agents.webp';
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/korea2.jpg';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/type/incheon.jpg';
					break;
				case '/community':
					title = 'Community';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/korea2.jpg';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/korea2.jpg';
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
					desc = 'Home / For Rent';
					bgImage = '/img/banner/incheon.jpg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage, eyebrow, stats };
		}, [router.pathname]);

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

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>UniFinder</title>
						<meta name={'title'} content={`Nestar`} />
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
				<>
					<Head>
						<title>UniFinder</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
							}}
						>
							<Stack className={'overlay'} />
							<Stack className={`container${memoizedValues.stats ? ' has-stats' : ''}`}>
								{memoizedValues.stats ? (
									<>
										<Stack className={'eyebrow'}>
											<span className={'dash'} />
											{t(memoizedValues.eyebrow!)}
										</Stack>
										<strong className={heroVisible ? 'fade-in-up' : ''}>
											{t(memoizedValues.title)}
										</strong>
										<p className={`lead${heroVisible ? ' fade-in-up delay-1' : ''}`}>
											{t(memoizedValues.desc)}
										</p>
										<Stack className={'stats-row'}>
											{memoizedValues.stats.map((s, i) => (
												<React.Fragment key={s.label}>
													{i > 0 && <span className={'stat-divider'} />}
													<Stack className={'stat'}>
														<CountUpStat
															target={s.numericValue}
															suffix={s.suffix}
															decimals={s.decimals}
														/>
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
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						{user?._id && <Chat />}

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
