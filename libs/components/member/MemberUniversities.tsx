import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { UniversityCard } from '../mypage/UniversityCard';
import { University } from '../../types/university/university';
import { UniversitiesInquiry } from '../../types/university/university.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_UNIVERSITIES } from '../../../apollo/user/query';
import { Direction } from '../../enums/common.enum';

const MyUniversities: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<UniversitiesInquiry>({ ...initialInput });
	const [agentUniversities, setAgentUniversities] = useState<University[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getUniversitiesLoading,
		data: getUniversitiesData,
		error: getUniversitiesError,
		refetch: getUniversitiesRefetch,
	} = useQuery(GET_UNIVERSITIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentUniversities(data?.getUniversities?.list);
			setTotal(data?.getUniversities?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLE **/
	useEffect(() => {
		getUniversitiesRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>UNIFINDER UNIVERSITIES MOBILE</div>;
	} else {
		return (
			<div id="member-universities-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Universities</Typography>
					</Stack>
				</Stack>
				<Stack className="universities-list-box">
					<Stack className="list-box">
						{agentUniversities?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Listing title</Typography>
								<Typography className="title-text">Date Published</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">View</Typography>
							</Stack>
						)}
						{agentUniversities?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No University found!</p>
							</div>
						)}
						{agentUniversities?.map((university: University) => {
							return <UniversityCard university={university} memberPage={true} key={university?._id} />;
						})}

						{agentUniversities.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} university available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyUniversities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			memberId: '',
		},
	},
};

export default MyUniversities;
