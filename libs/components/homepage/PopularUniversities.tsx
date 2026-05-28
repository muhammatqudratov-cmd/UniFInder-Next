import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
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
			<Stack className={'popular-universities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular universities</span>
							<p>Popularity is based on views</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/university'}>
									<span>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-university-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
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
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
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
