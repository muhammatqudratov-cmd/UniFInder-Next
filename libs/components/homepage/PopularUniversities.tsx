import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
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
						>
							<div className="popular-card-image">
								{university.universityImages?.[0] ? (
									<img
										src={`${REACT_APP_API_URL}/${university.universityImages[0]}`}
										alt={university.universityName}
									/>
								) : (
									<div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f0ede8, #e8e0d5)' }} />
								)}
								<span className="popular-card-badge">{university.universityType}</span>
							</div>
							<div className="popular-card-body">
								<h3>{university.universityName}</h3>
								<div className="popular-card-location">📍 {university.universityLocation}</div>
								<div className="popular-card-footer">
									<div className="popular-card-rating">
										<span className="star">★</span>
										<span className="count">{university.universityViews || '—'}</span>
									</div>
									<div className="popular-card-likes">♡ {university.universityLikes || '—'}</div>
								</div>
							</div>
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
