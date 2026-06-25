import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
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

				<div className="trend-cards-grid">
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
								>
									<div className="trend-card-image">
										{university.universityImages?.[0] ? (
											<img
												src={`${REACT_APP_API_URL}/${university.universityImages[0]}`}
												alt={university.universityName}
												style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
											/>
										) : (
											<div className={`trend-card-gradient ${grad}`}></div>
										)}
										<span className="trend-card-badge">{university.universityType}</span>
										<button
											className={`trend-card-heart${university?.meLiked && university?.meLiked[0]?.myFavorite ? ' liked' : ''}`}
											onClick={(e) => { e.stopPropagation(); likeUniversityHandler(user, university._id); }}
										>
											{university?.meLiked && university?.meLiked[0]?.myFavorite
												? <FavoriteIcon style={{ fontSize: 16, color: '#E8856A' }} />
												: <FavoriteBorderIcon style={{ fontSize: 16, color: '#8E8C83' }} />
											}
										</button>
									</div>
									<div className="trend-card-body">
										<h3>{university.universityName}</h3>
										<div className="trend-card-location"><LocationOnIcon style={{ fontSize: 14 }} /> {university.universityLocation}</div>
										<div className="trend-card-footer">
											<div className="trend-card-rating">
												<span className="star"><VisibilityIcon style={{ fontSize: 14 }} /></span>
												<span className="count">{university.universityViews || '—'}</span>
											</div>
											<div className="trend-card-likes"><FavoriteBorderIcon style={{ fontSize: 13 }} /> {university.universityLikes || '—'}</div>
										</div>
									</div>
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
