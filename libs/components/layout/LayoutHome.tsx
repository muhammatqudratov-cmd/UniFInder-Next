import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import HeaderFilter from '../homepage/HeaderFilter';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const router = useRouter();

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Nestar</title>
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
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<section className="hero-section">
							<div className="hero-orbs">
								<div className="hero-orb orb-coral"></div>
								<div className="hero-orb orb-sage"></div>
								<div className="hero-orb orb-lav"></div>
							</div>
							<div className="hero-content">
								<div className="hero-tag">The ultimate guide to universities</div>
								<h1 className="hero-title">
									Find your campus<br />
									in <span className="hero-accent">South Korea</span>
								</h1>
								<p className="hero-sub">
									Compare top universities, connect with trusted agents, and plan your move — all in one calm, clear place.
								</p>
								<div className="hero-buttons">
									<button className="hero-btn-primary">🎓 Explore Universities</button>
									<button className="hero-btn-secondary">👤 Talk to an agent</button>
								</div>
								<div className="hero-search-card">
									<HeaderFilter />
								</div>
							</div>
						</section>

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

export default withLayoutMain;
