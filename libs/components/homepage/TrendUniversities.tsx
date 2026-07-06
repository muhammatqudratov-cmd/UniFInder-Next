import React, { useState, useRef, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { useRouter } from 'next/router';
import { LayoutGrid } from '../ui/LayoutGrid';
import { REACT_APP_API_URL } from '../../config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { University } from '../../types/university/university';
import { UniversitiesInquiry } from '../../types/university/university.input';
import TrendUniversityCard from './TrendUniversityCard';
import { GET_UNIVERSITIES } from '../../../apollo/user/query';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { T } from '../../types/common';
import { userVar } from '../../../apollo/store';
import { LIKE_TARGET_UNIVERSITY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import TopUniversities from './TopUniversities';

interface TrendUniversitiesProps {
	initialInput: UniversitiesInquiry;
}

const TrendUniversities = (props: TrendUniversitiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [trendUniversities, setTrendUniversities] = useState<University[]>([]);

	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		const cards = Array.from(grid.querySelectorAll<HTMLElement>('.trend-uni-card'));
		if (cards.length === 0) return;

		// Set initial hidden state
		cards.forEach((card) => {
			card.style.opacity = '0';
			card.style.transform = 'translateY(24px)';
			card.style.filter = 'blur(6px)';
			card.style.transition = 'none';
		});

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					cards.forEach((card, i) => {
						setTimeout(() => {
							card.style.transition =
								'opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1), filter 0.9s cubic-bezier(.16,1,.3,1)';
							card.style.opacity = '1';
							card.style.transform = 'translateY(0)';
							card.style.filter = 'blur(0px)';
						}, i * 200);
					});
					observer.disconnect();
				}
			},
			{ threshold: 0.08 },
		);

		observer.observe(grid);
		return () => observer.disconnect();
	}, [trendUniversities]);

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
			setTrendUniversities(data?.getUniversities?.list);
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
	// RENDER
	if (device === 'mobile') {
		return (
			<Stack className={'trend-universities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Universities</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendUniversities.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-university-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendUniversities.map((university: University) => {
									return (
										<SwiperSlide key={university._id} className={'trend-university-slide'}>
											<TrendUniversityCard university={university} likeUniversityHandler={likeUniversityHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		const grads = ['grad-sage', 'grad-lav', 'grad-coral', 'grad-lav2'];
		return (
			<div className="trend-universities">
				<div className="trend-section-header">
					<div>
						<h2>Trend Universities</h2>
						<p>Trending now, based on likes</p>
					</div>
					<div className="trend-nav-arrows">
						<button className={'swiper-trend-prev'}>←</button>
						<button className={'swiper-trend-next'}>→</button>
					</div>
				</div>

				<div className="trend-cards-grid" ref={gridRef}>
					{trendUniversities.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							Trends Empty
						</Box>
					) : (
						trendUniversities.map((university: University, index: number) => {
							const grad = grads[index % 4];
							return (
								<div
									key={university._id}
									className="trend-uni-card"
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
										<div className={`trend-card-gradient ${grad}`} style={{ position: 'absolute', inset: 0 }} />
									)}

									{/* Gradient overlay */}
									<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)' }} />

									{/* Heart button — top right */}
									<button
										onClick={(e) => { e.stopPropagation(); likeUniversityHandler(user, university._id); }}
										style={{ position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
									>
										{university?.meLiked && university?.meLiked[0]?.myFavorite
											? <FavoriteIcon style={{ fontSize: 18, color: '#ff6b6b' }} />
											: <FavoriteBorderIcon style={{ fontSize: 18, color: '#fff' }} />
										}
									</button>

									{/* Text content — bottom, above button */}
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
							);
						})
					)}
				</div>
			</div>
		);
	}
};

TrendUniversities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default TrendUniversities;
