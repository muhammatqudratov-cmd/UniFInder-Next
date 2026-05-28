import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { UniversityPanelList } from '../../../libs/components/admin/universities/UniversityList';
import { AllUniversitiesInquiry } from '../../../libs/types/university/university.input';
import { University } from '../../../libs/types/university/university';
import { UniversityLocation, UniversityStatus } from '../../../libs/enums/university.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { UniversityUpdate } from '../../../libs/types/university/university.update';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_UNIVERSITY_BY_ADMIN, UPDATE_UNIVERSITY_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_UNIVERSITIES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';

const AdminUniversities: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [universitiesInquiry, setUniversitiesInquiry] = useState<AllUniversitiesInquiry>(initialInquiry);
	const [universities, setUniversities] = useState<University[]>([]);
	const [universitiesTotal, setUniversitiesTotal] = useState<number>(0);
	const [value, setValue] = useState(
		universitiesInquiry?.search?.universityStatus ? universitiesInquiry?.search?.universityStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateUniversityByAdmin] = useMutation(UPDATE_UNIVERSITY_BY_ADMIN);
	const [removeUniversityByAdmin] = useMutation(REMOVE_UNIVERSITY_BY_ADMIN);
	const {
		loading: getAllUniversitiesLoading,
		data: getAllUniversitiesData,
		error: getAllUniversitiesError,
		refetch: getAllUniversitiesRefetch,
	} = useQuery(GET_ALL_UNIVERSITIES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: universitiesInquiry,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setUniversities(data?.getAllUniversitiesByAdmin?.list);
			setUniversitiesTotal(data?.getAllUniversitiesByAdmin?.metaCounter[0]?.total);
		},
	});
	/** LIFECYCLE **/
	useEffect(() => {
		getAllUniversitiesRefetch({ input: universitiesInquiry }).then();
	}, [universitiesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		universitiesInquiry.page = newPage + 1;
		// await getAllUniversitiesRefetch({ input: universitiesInquiry });
		setUniversitiesInquiry({ ...universitiesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		universitiesInquiry.limit = parseInt(event.target.value, 10);
		universitiesInquiry.page = 1;
		// await getAllUniversitiesRefetch({ input: universitiesInquiry });
		setUniversitiesInquiry({ ...universitiesInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setUniversitiesInquiry({ ...universitiesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setUniversitiesInquiry({ ...universitiesInquiry, search: { universityStatus: UniversityStatus.ACTIVE } });
				break;
			case 'INACTIVE':
				setUniversitiesInquiry({ ...universitiesInquiry, search: { universityStatus: UniversityStatus.INACTIVE } });
				break;
			case 'DELETE':
				setUniversitiesInquiry({ ...universitiesInquiry, search: { universityStatus: UniversityStatus.DELETE } });
				break;
			default:
				delete universitiesInquiry?.search?.universityStatus;
				setUniversitiesInquiry({ ...universitiesInquiry });
				break;
		}
	};

	const removeUniversityHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeUniversityByAdmin({
					variables: {
						input: id,
					},
				});
			}
			await getAllUniversitiesRefetch({ input: universitiesInquiry });
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setUniversitiesInquiry({
					...universitiesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...universitiesInquiry.search,
						universityLocationList: [newValue as UniversityLocation],
					},
				});
			} else {
				delete universitiesInquiry?.search?.universityLocationList;
				setUniversitiesInquiry({ ...universitiesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateUniversityHandler = async (updateData: UniversityUpdate) => {
		try {
			await updateUniversityByAdmin({
				variables: {
					input: updateData,
				},
			});
			await getAllUniversitiesRefetch({ input: universitiesInquiry });
			menuIconCloseHandler();
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				University List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'INACTIVE')}
									value="INACTIVE"
									className={value === 'INACTIVE' ? 'li on' : 'li'}
								>
									Inactive
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(UniversityLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<UniversityPanelList
							universities={universities}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateUniversityHandler={updateUniversityHandler}
							removeUniversityHandler={removeUniversityHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[5, 10, 20, 40, 60]}
							component="div"
							count={universitiesTotal}
							rowsPerPage={universitiesInquiry?.limit}
							page={universitiesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminUniversities.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminUniversities);
