import React, { useState } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
						>
							<div className="top-card-image">
								{university.universityImages?.[0] ? (
									<img
										src={`${REACT_APP_API_URL}/${university.universityImages[0]}`}
										alt={university.universityName}
									/>
								) : (
									<div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f4f3ef, #e8e0d5)' }} />
								)}
								<span className="top-card-badge">{university.universityType}</span>
								<button
									className={`top-card-heart${university?.meLiked?.[0]?.myFavorite ? ' liked' : ''}`}
									onClick={(e) => { e.stopPropagation(); likeUniversityHandler(user, university._id); }}
								>
									{university?.meLiked?.[0]?.myFavorite
										? <FavoriteIcon style={{ fontSize: 16, color: '#E8856A' }} />
										: <FavoriteBorderIcon style={{ fontSize: 16, color: '#8E8C83' }} />
									}
								</button>
							</div>
							<div className="top-card-body">
								<h3>{university.universityName}</h3>
								<div className="top-card-location"><LocationOnIcon style={{ fontSize: 14 }} /> {university.universityLocation}</div>
								<div className="top-card-footer">
									<div className="top-card-rating">
										<span className="star"><VisibilityIcon style={{ fontSize: 14 }} /></span>
										<span className="count">{university.universityViews || '—'}</span>
									</div>
									<div className="top-card-likes"><FavoriteBorderIcon style={{ fontSize: 13 }} /> {university.universityLikes || '—'}</div>
								</div>
							</div>
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
