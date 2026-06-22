import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { UniversityCard } from './UniversityCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { University } from '../../types/university/university';
import { AgentUniversitiesInquiry } from '../../types/university/university.input';
import { T } from '../../types/common';
import { UniversityStatus } from '../../enums/university.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_UNIVERSITY } from '../../../apollo/user/mutation';
import { GET_AGENT_UNIVERSITIES } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyUniversities: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentUniversitiesInquiry>(initialInput);
	const [agentUniversities, setAgentUniversities] = useState<University[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateUniversity] = useMutation(UPDATE_UNIVERSITY);
	const {
		loading: getAgentUniversitiesLoading,
		data: getAgentUniversitiesData,
		error: getAgentUniversitiesError,
		refetch: getAgentUniversitiesRefetch,
	} = useQuery(GET_AGENT_UNIVERSITIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentUniversities(data?.getAgentUniversities?.list);
			setTotal(data?.getAgentUniversities?.metaCounter[0]?.total);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: UniversityStatus) => {
		setSearchFilter({ ...searchFilter, search: { universityStatus: value } });
	};

	const deleteUniversityHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this university?')) {
				await updateUniversity({
					variables: {
						input: {
							_id: id,
							universityStatus: 'DELETE',
						},
					},
				});

				await getAgentUniversitiesRefetch({ input: searchFilter });
			}
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const updateUniversityHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to update this university?')) {
				await updateUniversity({
					variables: {
						input: {
							_id: id,
							universityStatus: status,
						},
					},
				});

				await getAgentUniversitiesRefetch({ input: searchFilter });
			}
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};
	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>UNIFINDER UNIVERSITIES MOBILE</div>;
	} else {
		return (
			<div id="my-university-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Universities</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="university-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(UniversityStatus.ACTIVE)}
							className={searchFilter.search.universityStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							Active
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(UniversityStatus.INACTIVE)}
							className={searchFilter.search.universityStatus === 'INACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							Inactive
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.universityStatus === 'ACTIVE' && (
								<Typography className="title-text">Action</Typography>
							)}
						</Stack>

						{agentUniversities?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No University found!</p>
							</div>
						) : (
							agentUniversities.map((university: University) => {
								return (
									<UniversityCard
										university={university}
										deleteUniversityHandler={deleteUniversityHandler}
										updateUniversityHandler={updateUniversityHandler}
									/>
								);
							})
						)}

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
		search: {
			universityStatus: 'ACTIVE',
		},
	},
};

export default MyUniversities;
