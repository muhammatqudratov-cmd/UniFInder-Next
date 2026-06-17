import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>total free customer care</span>
							<p>+82 10 5748 2425</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>nee live</span>
							<p>+82 10 5748 2425</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Search</strong>
								<span>University for Rent</span>
								<span>University Low to hide</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© UniFinder - All rights reserved. UniFinder {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<div className="newsletter-section">
				<div className="newsletter-inner">
					<div className="newsletter-text">
						<h3>Keep yourself up to date</h3>
						<p>Admissions news, scholarships and deadlines — a calm digest, once a month.</p>
					</div>
					<div className="newsletter-form">
						<input className="newsletter-input" type="email" placeholder="your@email.com" />
						<button className="newsletter-btn">Subscribe</button>
					</div>
				</div>

				<div className="footer-grid">
					{/* Column 1 — Brand */}
					<div>
						<div className="footer-logo">
							<div
								style={{
									width: '28px',
									height: '28px',
									borderRadius: '50%',
									border: '2px solid #1C1B18',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
								}}
							>
								<div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E8856A' }}></div>
							</div>
							<span className="footer-logo-text">UniFinder</span>
						</div>
						<div className="footer-contact-label">Total free customer care</div>
						<div className="footer-contact-phone">+82 10 5748 2425</div>
						<div className="footer-contact-label">Need live support?</div>
						<div className="footer-contact-phone">+82 10 5748 2425</div>
						<div className="footer-follow-label">Follow Us</div>
						<div className="footer-social-row">
							<button className="footer-social-btn">
								<FacebookOutlinedIcon fontSize="small" />
							</button>
							<button className="footer-social-btn">
								<TelegramIcon fontSize="small" />
							</button>
							<button className="footer-social-btn">
								<InstagramIcon fontSize="small" />
							</button>
							<button className="footer-social-btn">
								<TwitterIcon fontSize="small" />
							</button>
						</div>
					</div>

					{/* Column 2 — Popular Search */}
					<div>
						<div className="footer-col-title">Popular Search</div>
						<span className="footer-col-link">Universities for rent</span>
						<span className="footer-col-link">Scholarships</span>
						<span className="footer-col-link">English-taught</span>
						<span className="footer-col-link">Dormitories</span>
					</div>

					{/* Column 3 — Quick Links */}
					<div>
						<div className="footer-col-title">Quick Links</div>
						<span className="footer-col-link">Terms of Use</span>
						<span className="footer-col-link">Privacy Policy</span>
						<span className="footer-col-link">Pricing Plans</span>
						<span className="footer-col-link">Our Services</span>
						<span className="footer-col-link">Contact Support</span>
						<span className="footer-col-link">FAQs</span>
					</div>

					{/* Column 4 — Discover */}
					<div>
						<div className="footer-col-title">Discover</div>
						<span className="footer-col-link">
							<span className="footer-pin">📍</span> Seoul
						</span>
						<span className="footer-col-link">
							<span className="footer-pin">📍</span> Gyeonggi-do
						</span>
						<span className="footer-col-link">
							<span className="footer-pin">📍</span> Busan
						</span>
						<span className="footer-col-link">
							<span className="footer-pin">📍</span> Daegu
						</span>
						<span className="footer-col-link">
							<span className="footer-pin">📍</span> Jejudo
						</span>
					</div>
				</div>

				<div className="footer-bottom">
					<span>© UniFinder {moment().year()} · UniFinder. All rights reserved.</span>
					<div className="footer-bottom-links">
						<span className="footer-bottom-link">Privacy</span>
						<span className="footer-bottom-link">Terms</span>
						<span className="footer-bottom-link">Sitemap</span>
					</div>
				</div>
			</div>
		);
	}
};

export default Footer;
