import { Html, Head, Main, NextScript } from 'next/document';

const SITE_URL = 'https://unifinder.uz';
const OG_TITLE = 'UniFinder — Find Your Campus in South Korea';
const OG_DESCRIPTION =
	'Compare top universities, connect with trusted agents, and plan your move — all in one calm, clear place.';
const OG_IMAGE = `${SITE_URL}/img/banner/incheon.jpg`;

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="color-scheme" content="light" />
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
				<link rel="shortcut icon" href="/favicon.svg?v=2" />

				{/* SEO */}
				<meta name="keyword" content={', unifinder.uz, devex mern, mern nestjs fullstack'} />
				<meta
					name={'description'}
					content={
						'Buy and sell universities anywhere anytime in South Korea. Best Universities at Best prices on unifinder.uz | ' +
						'Покупайте и продавайте недвижимость в любой точке Южной Кореи в любое время. Лучшая недвижимость по лучшим ценам на unifinder.uz | ' +
						'대한민국 언제 어디서나 부동산을 사고팔 수 있습니다. UniFinder.uz에서 최적의 가격으로 최고의 부동산을 만나보세요'
					}
				/>

				{/* Open Graph (Telegram, Facebook, WhatsApp, etc.) */}
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="UniFinder" />
				<meta property="og:title" content={OG_TITLE} />
				<meta property="og:description" content={OG_DESCRIPTION} />
				<meta property="og:image" content={OG_IMAGE} />
				<meta property="og:image:width" content="4608" />
				<meta property="og:image:height" content="3456" />
				<meta property="og:url" content={SITE_URL} />

				{/* Twitter Card */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={OG_TITLE} />
				<meta name="twitter:description" content={OG_DESCRIPTION} />
				<meta name="twitter:image" content={OG_IMAGE} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
