import React, { useEffect, useRef, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const WORDS = ['campus', 'program', 'future', 'dream'];
const VIDEOS = ['/video/add1.mp4', '/video/add3.mp4', '/video/add4.mp4'];

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const router = useRouter();

		const canvasRef = useRef<HTMLCanvasElement>(null);
		const videoRef = useRef<HTMLVideoElement>(null);
		const videoFirstRender = useRef(true);

		const [wordIdx, setWordIdx] = useState(0);
		const [phase, setPhase] = useState<'in' | 'out'>('in');
		const [videoIdx, setVideoIdx] = useState(0);
		const [videoBlur, setVideoBlur] = useState(false);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		useEffect(() => {
			const tick = setInterval(() => {
				setPhase('out');
				setTimeout(() => {
					setWordIdx((i) => (i + 1) % WORDS.length);
					setPhase('in');
				}, 400);
			}, 2000);
			return () => clearInterval(tick);
		}, []);

		useEffect(() => {
			if (videoFirstRender.current) {
				videoFirstRender.current = false;
				return;
			}
			const video = videoRef.current;
			if (!video) return;
			video.src = VIDEOS[videoIdx];
			video.play().catch(() => {});
			setTimeout(() => setVideoBlur(false), 80);
		}, [videoIdx]);

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
							<style>{`
								@keyframes wordSlideIn {
									from { opacity: 0; transform: translateY(10px); }
									to   { opacity: 1; transform: translateY(0px); }
								}
								@keyframes wordSlideOut {
									from { opacity: 1; transform: translateY(0px); }
									to   { opacity: 0; transform: translateY(-10px); }
								}
							`}</style>
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
							<div className="hero-content" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '56px' }}>

								{/* LEFT 50% — text content */}
								<div style={{ flex: '0 0 50%', textAlign: 'left' }}>
									<div className="hero-tag">The ultimate guide to universities</div>
									<h1 className="hero-title">
										Find your{' '}
										<span
											key={wordIdx}
											style={{
												color: '#e8856a',
												display: 'inline-block',
												animation: `${phase === 'in' ? 'wordSlideIn' : 'wordSlideOut'} 0.5s ease-out forwards`,
											}}
										>
											{WORDS[wordIdx]}
										</span>
										<br />
										in <span className="hero-accent">South Korea</span>
									</h1>
									<p className="hero-sub" style={{ margin: '0 0 32px' }}>
										Compare top universities, connect with trusted agents, and plan your move — all in one calm, clear place.
									</p>
									<div className="hero-buttons" style={{ justifyContent: 'flex-start', marginBottom: '24px' }}>
										<button className="hero-btn-primary" onClick={() => router.push('/university')}>
											<SchoolIcon className="hero-btn-icon" />
											Explore Universities
										</button>
										<button className="hero-btn-secondary" onClick={() => router.push('/agent')}>
											<SupportAgentIcon className="hero-btn-icon" />
											Talk to an agent
										</button>
									</div>
									{/* Social proof */}
									<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
										<div style={{ display: 'flex' }}>
											{['#e8856a', '#c4b5d9', '#a8c5a0'].map((color, i) => (
												<div
													key={i}
													style={{
														width: '28px',
														height: '28px',
														borderRadius: '50%',
														background: color,
														border: '2px solid #15140f',
														marginLeft: i === 0 ? 0 : '-8px',
													}}
												/>
											))}
										</div>
										<div>
											<span style={{ color: '#e8856a', fontSize: '13px', fontWeight: 700 }}>★★★★★</span>
											<span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginLeft: '6px' }}>
												Loved by 500+ students
											</span>
										</div>
									</div>
								</div>

								{/* RIGHT 50% — video card with floating info cards */}
								<div style={{ flex: '0 0 50%', position: 'relative', height: '340px' }}>

									{/* Main video card */}
									<div
										style={{
											width: '100%',
											height: '100%',
											borderRadius: '20px',
											overflow: 'hidden',
											boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
										}}
									>
										<video
											ref={videoRef}
											autoPlay
											muted
											playsInline
											onEnded={() => {
												setVideoBlur(true);
												setTimeout(() => setVideoIdx((i) => (i + 1) % VIDEOS.length), 500);
											}}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												transition: 'opacity 0.5s ease, filter 0.5s ease',
												opacity: videoBlur ? 0 : 1,
												filter: videoBlur ? 'blur(12px)' : 'blur(0px)',
											}}
										>
											<source src={VIDEOS[0]} type="video/mp4" />
										</video>
									</div>

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
