import React, { useEffect, useRef } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import HeaderFilter from './HeaderFilter';
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

		const canvasRef = useRef<HTMLCanvasElement>(null);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		useEffect(() => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const resize = () => {
				canvas.width = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;
			};
			resize();
			window.addEventListener('resize', resize);

			const colors = ['#E8856A', '#C4B5D9', '#A8C5A0'];
			interface Particle {
				x: number;
				y: number;
				r: number;
				color: string;
				vy: number;
				vx: number;
				op: number;
				blur: boolean;
			}
			const particles: Particle[] = [];

			const spawn = () => {
				particles.push({
					x: Math.random() * canvas.width,
					y: canvas.height,
					r: 2 + Math.random() * 8,
					color: colors[Math.floor(Math.random() * colors.length)],
					vy: 0.5 + Math.random() * 0.6,
					vx: (Math.random() - 0.5) * 0.6,
					op: 0.25 + Math.random() * 0.25,
					blur: Math.random() < 0.3,
				});
			};

			let animId: number;
			const draw = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				for (let i = particles.length - 1; i >= 0; i--) {
					const p = particles[i];
					if (p.blur) ctx.filter = `blur(${Math.round(p.r * 0.4)}px)`;
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
					ctx.fillStyle = p.color;
					ctx.globalAlpha = p.op;
					ctx.fill();
					if (p.blur) ctx.filter = 'none';
					p.y -= p.vy;
					p.x += p.vx;
					p.op -= 0.0015;
					if (p.op <= 0 || p.y < -p.r) particles.splice(i, 1);
				}
				ctx.globalAlpha = 1;
				if (Math.random() < 0.16) spawn();
				animId = requestAnimationFrame(draw);
			};
			draw();

			return () => {
				cancelAnimationFrame(animId);
				window.removeEventListener('resize', resize);
			};
		}, []);

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
				<>
					<Head>
						<title>UniFinder</title>
						<meta name={'meta'} content={`UniFinder`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<section className="hero-section">
							<canvas
								ref={canvasRef}
								style={{
									position: 'absolute',
									inset: 0,
									width: '100%',
									height: '100%',
									zIndex: 0,
									pointerEvents: 'none',
								}}
							/>
							<div className="hero-orbs" style={{ position: 'relative', zIndex: 1 }}>
								<div className="hero-orb orb-coral"></div>
								<div className="hero-orb orb-sage"></div>
								<div className="hero-orb orb-lav"></div>
							</div>
							<div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
								<div className="hero-tag">The ultimate guide to universities</div>
								<h1 className="hero-title">
									Find your campus
									<br />
									in <span className="hero-accent">South Korea</span>
								</h1>
								<p className="hero-sub">
									Compare top universities, connect with trusted agents, and plan your move — all in one calm, clear
									place.
								</p>
								<div className="hero-buttons">
									<button className="hero-btn-primary" onClick={() => router.push('/university')}>
										🎓 Explore Universities
									</button>
									<button className="hero-btn-secondary" onClick={() => router.push('/agent')}>
										👤 Talk to an agent
									</button>
								</div>
								<div
									style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative', zIndex: 50 }}
								>
									<HeaderFilter />
								</div>
							</div>
						</section>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

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
