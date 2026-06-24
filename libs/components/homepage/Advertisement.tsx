import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';

const Advertisement = () => {
	const router = useRouter();

	return (
		<Stack className={'advertisement'}>
			<Stack className={'ad-text'}>
				<Typography className={'ad-title'}>A world of universities, one platform</Typography>
				<Typography className={'ad-subtitle'}>
					Search, compare, and apply to universities across South Korea with confidence.
				</Typography>
				<button className={'ad-button'} onClick={() => router.push('/university')}>
					Explore Universities
				</button>
			</Stack>
			<Stack className={'ad-video-card'}>
				<video autoPlay muted loop playsInline preload="auto" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
					<source src="/video/koreauni.mp4" type="video/mp4" />
				</video>
			</Stack>
		</Stack>
	);
};

export default Advertisement;
