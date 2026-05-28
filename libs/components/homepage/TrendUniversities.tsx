import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { University } from '../../types/university/university';
import { UniversitiesInquiry } from '../../types/university/university.input';
import TrendUniversityCard from './TrendUniversityCard';
import { GET_UNIVERSITIES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_UNIVERSITY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TrendUniversitiesProps {
	initialInput: UniversitiesInquiry;
}

const TrendUniversities = (props: TrendUniversitiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
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

	if (trendUniversities) console.log('trendUniversities:', trendUniversities);
	if (!trendUniversities) return null;

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
		return (
			<Stack className={'trend-universities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trend Universities</span>
							<p>Trend is based on likes</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
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
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
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
	}
};

TrendUniversities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'universityLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendUniversities;
