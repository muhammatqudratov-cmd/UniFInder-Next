import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { useRouter } from 'next/router';
import { LayoutGrid } from '../ui/LayoutGrid';
import { REACT_APP_API_URL } from '../../config';
import PopularUniversityCard from './PopularUniversityCard';
import { University } from '../../types/university/university';
import Link from 'next/link';
import { UniversitiesInquiry } from '../../types/university/university.input';
import { useQuery } from '@apollo/client';
import { GET_UNIVERSITIES } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface PopularUniversitiesProps {
	initialInput: UniversitiesInquiry;
}

const PopularUniversities = (props: PopularUniversitiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [popularUniversities, setPopularUniversities] = useState<University[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getUniversitiesLoading,
		data: getUniversitiesData,
		error: getUniversitiesError,
		refetch: getUniversitiesRefetch,
	} = useQuery(GET_UNIVERSITIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPopularUniversities(data?.getUniversities?.list);
		},
	});
	/** HANDLERS **/

	if (!popularUniversities) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-universities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular universities</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-university-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularUniversities.map((university: University) => {
								return (
									<SwiperSlide key={university._id} className={'popular-university-slide'}>
										<PopularUniversityCard university={university} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<div className="popular-universities">
				<div className="popular-section-header">
					<div>
						<h2>Popular Universities</h2>
						<p>Popularity is based on views this month</p>
					</div>
					<span className="popular-see-all" onClick={() => router.push('/university')}>
						See all categories ↗
					</span>
				</div>

				<div className="popular-cards-grid">
					{popularUniversities.map((university: University, index: number) => (
						<div
							key={university._id}
							className="popular-uni-card"
							onClick={() => router.push({ pathname: '/university/detail', query: { id: university._id } })}
							style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '380px', cursor: 'pointer', background: '#1a1a2e' }}
						>
							{/* Full-bleed photo */}
							{university.universityImages?.[0] ? (
								<img
									src={`${REACT_APP_API_URL}/${university.universityImages[0]}`}
									alt={university.universityName}
									style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							) : (
								<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #2d2d44, #1a1a2e)' }} />
							)}

							{/* Gradient overlay */}
							<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)' }} />

							{/* Type badge — top left */}
							{university.universityType && (
								<span style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', borderRadius: '20px', padding: '4px 12px', color: '#fff', fontSize: 12, fontWeight: 500, zIndex: 2 }}>
									{university.universityType}
								</span>
							)}

							{/* Text content */}
							<div style={{ position: 'absolute', bottom: 68, left: 18, right: 18, zIndex: 2 }}>
								<h3 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
									{university.universityName}
								</h3>
								<p style={{ margin: '4px 0 10px', color: 'rgba(255,255,255,0.72)', fontSize: 13, fontWeight: 400 }}>
									{university.universityAddress || university.universityLocation}
								</p>
								<div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#fff', fontSize: 13 }}>
									<span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
										<LocalOfferIcon style={{ fontSize: 14, opacity: 0.85 }} />
										from ${university.universityTuition?.toLocaleString()}
									</span>
									<span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
										<AspectRatioIcon style={{ fontSize: 14, opacity: 0.85 }} />
										{university.universityCampusSize} m²
									</span>
								</div>
							</div>

							{/* CTA pill button */}
							<button
								onClick={(e) => { e.stopPropagation(); router.push({ pathname: '/university/detail', query: { id: university._id } }); }}
								style={{ position: 'absolute', bottom: 16, left: 16, right: 16, height: 44, borderRadius: '50px', background: '#fff', border: 'none', color: '#1a1a1a', fontSize: 14, fontWeight: 600, cursor: 'pointer', zIndex: 2, letterSpacing: '0.01em' }}
							>
								View Details
							</button>
						</div>
					))}
				</div>
			</div>
		);
	}
};

PopularUniversities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'universityViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularUniversities;
