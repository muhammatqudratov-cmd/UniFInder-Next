import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopUniversityCard from './TopUniversityCard';
import { UniversitiesInquiry } from '../../types/university/university.input';
import { University } from '../../types/university/university';
import { useMutation, useQuery } from '@apollo/client';
import { GET_UNIVERSITIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_UNIVERSITY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TopUniversitiesProps {
	initialInput: UniversitiesInquiry;
}

const TopUniversities = (props: TopUniversitiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
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
			<Stack className={'top-universities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top universities</span>
							<p>Check out our Top Universities</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-university-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
							}}
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
