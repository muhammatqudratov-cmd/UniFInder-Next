import React, { useState } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopUniversityCard from './TopUniversityCard';
import { UniversitiesInquiry } from '../../types/university/university.input';
import { University } from '../../types/university/university';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_UNIVERSITIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_UNIVERSITY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { userVar } from '../../../apollo/store';

interface TopUniversitiesProps {
	initialInput: UniversitiesInquiry;
}

const TopUniversities = (props: TopUniversitiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [topUniversities, setTopUniversities] = useState<University[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetUniversity] = useMutation(LIKE_TARGET_UNIVERSITY);

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
			setTopUniversities(data?.getUniversities?.list);
		},
	});
	/** HANDLERS **/

	const likeUniversityHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			// Execute like
			await likeTargetUniversity({ variables: { input: id } });
			// Refetch
			await getUniversitiesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likeUniversityHandler', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-universities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top universities</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-university-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topUniversities.map((university: University) => {
								return (
									<SwiperSlide className={'top-university-slide'} key={university?._id}>
										<TopUniversityCard university={university} likeUniversityHandler={likeUniversityHandler} />
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
			<div className="top-universities">
				<div className="top-section-header">
					<div>
						<h2>Top Universities</h2>
						<p>Check out our highest-rated universities</p>
					</div>
					<div className="top-nav-arrows">
						<button>←</button>
						<button>→</button>
					</div>
				</div>

				<div className="top-cards-grid">
					{topUniversities.map((university: University, index: number) => (
						<div
							key={university._id}
							className="top-uni-card"
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

							{/* Heart button — top right */}
							<button
								onClick={(e) => { e.stopPropagation(); likeUniversityHandler(user, university._id); }}
								style={{ position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
							>
								{university?.meLiked?.[0]?.myFavorite
									? <FavoriteIcon style={{ fontSize: 18, color: '#ff6b6b' }} />
									: <FavoriteBorderIcon style={{ fontSize: 18, color: '#fff' }} />
								}
							</button>

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

TopUniversities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'universityRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopUniversities;
