import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { MemberPanelList } from '../../../libs/components/admin/users/MemberList';
import { Box, Button, InputAdornment, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Tooltip from '@mui/material/Tooltip';
import { MembersInquiry } from '../../../libs/types/member/member.input';
import { Member } from '../../../libs/types/member/member';
import { MemberStatus, MemberType } from '../../../libs/enums/member.enum';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { MemberUpdate } from '../../../libs/types/member/member.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { UPDATE_MEMBER_BY_ADMIN } from '../../../apollo/admin/mutation';

const AdminUsers: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [membersInquiry, setMembersInquiry] = useState<MembersInquiry>(initialInquiry);
	const [members, setMembers] = useState<Member[]>([]);
	const [membersTotal, setMembersTotal] = useState<number>(0);
	const [value, setValue] = useState(
		membersInquiry?.search?.memberStatus ? membersInquiry?.search?.memberStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);
	const {
		loading: getMembersLoading,
		data: getMembersData,
		error: getMembersError,
		refetch: getMembersRefetch,
	} = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: membersInquiry,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMembers(data?.getAllMembersByAdmin?.list);
			setMembersTotal(data?.getAllMembersByAdmin?.metaCounter[0]?.total);
		},
	});

	/** STAT CARDS — reuse GET_ALL_MEMBERS_BY_ADMIN with different filters, no new backend query **/
	const { data: totalCountData } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 1, sort: 'createdAt', search: {} } },
	});
	const { data: activeCountData } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 1, sort: 'createdAt', search: { memberStatus: MemberStatus.ACTIVE } } },
	});
	const { data: flaggedListData } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 1000, sort: 'createdAt', search: {} } },
	});

	const totalMembersCount = totalCountData?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0;
	const activeMembersCount = activeCountData?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0;
	const flaggedMembersCount = (flaggedListData?.getAllMembersByAdmin?.list ?? []).filter(
		(m: any) => (m?.memberWarnings ?? 0) + (m?.memberBlocks ?? 0) > 0,
	).length;

	/** LIFECYCLE **/
	useEffect(() => {
		getMembersRefetch({ input: membersInquiry }).then();
	}, [membersInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		membersInquiry.page = newPage + 1;
		getMembersRefetch({ input: membersInquiry }).then();
		setMembersInquiry({ ...membersInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		membersInquiry.limit = parseInt(event.target.value, 10);
		membersInquiry.page = 1;
		setMembersInquiry({ ...membersInquiry });
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
		setSearchText('');

		setMembersInquiry({ ...membersInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setMembersInquiry({ ...membersInquiry, search: { memberStatus: MemberStatus.ACTIVE } });
				break;
			case 'BLOCK':
				setMembersInquiry({ ...membersInquiry, search: { memberStatus: MemberStatus.BLOCK } });
				break;
			case 'DELETE':
				setMembersInquiry({ ...membersInquiry, search: { memberStatus: MemberStatus.DELETE } });
				break;
			default:
				delete membersInquiry?.search?.memberStatus;
				setMembersInquiry({ ...membersInquiry });
				break;
		}
	};

	const updateMemberHandler = async (updateData: MemberUpdate) => {
		try {
			await updateMemberByAdmin({
				variables: {
					input: updateData,
				},
			});
			await getMembersRefetch({ input: membersInquiry });
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTextHandler = () => {
		try {
			setMembersInquiry({
				...membersInquiry,
				search: {
					...membersInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setMembersInquiry({
					...membersInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...membersInquiry.search,
						memberType: newValue as MemberType,
					},
				});
			} else {
				delete membersInquiry?.search?.memberType;
				setMembersInquiry({ ...membersInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const statusCount = (status: MemberStatus) => members.filter((member) => member.memberStatus === status).length;

	return (
		<Box component={'div'} className={'content'}>
			<Stack className={'admin-breadcrumb'} direction={'row'}>
				<Typography component={'span'}>Users</Typography>
				<Typography component={'span'}>/</Typography>
				<Typography component={'strong'}>List</Typography>
			</Stack>
			<Box component={'div'} className={'page-header'}>
				<Box component={'div'}>
					<Typography variant={'h2'} className={'tit'}>
						Member List
					</Typography>
					<Typography component={'p'} className={'subtitle'}>
						Manage every member, agent and admin across the platform.
					</Typography>
				</Box>
				<Tooltip title="Member creation is managed directly in the database">
					<span>
						<Button disabled className={'btn-add-member'} startIcon={<AddRoundedIcon />}>
							Add member
						</Button>
					</span>
				</Tooltip>
			</Box>

			<Stack className={'stat-cards'}>
				<Stack className={'stat-card'}>
					<Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
						<Typography className={'stat-label'}>Total Members</Typography>
						<span className={'stat-icon total'} />
					</Stack>
					<Typography className={'stat-value'}>{totalMembersCount}</Typography>
				</Stack>
				<Stack className={'stat-card'}>
					<Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
						<Typography className={'stat-label'}>Active</Typography>
						<span className={'stat-icon active'} />
					</Stack>
					<Typography className={'stat-value'}>{activeMembersCount}</Typography>
				</Stack>
				<Stack className={'stat-card'}>
					<Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
						<Typography className={'stat-label'}>Flagged</Typography>
						<span className={'stat-icon flagged'} />
					</Stack>
					<Typography className={'stat-value'}>{flaggedMembersCount}</Typography>
				</Stack>
			</Stack>

			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'} className={'list-toolbar'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All <span>{membersTotal}</span>
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active <span>{statusCount(MemberStatus.ACTIVE)}</span>
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'BLOCK')}
									value="BLOCK"
									className={value === 'BLOCK' ? 'li on' : 'li'}
								>
									Blocked <span>{statusCount(MemberStatus.BLOCK)}</span>
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Deleted <span>{statusCount(MemberStatus.DELETE)}</span>
								</ListItem>
							</List>
							<Stack className={'search-area'}>
								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									className={'search'}
									placeholder="Search members"
									onKeyDown={(event) => {
										if (event.key == 'Enter') searchTextHandler();
									}}
									startAdornment={
										<InputAdornment position="start" onClick={() => searchTextHandler()}>
											<img src="/img/icons/search_icon.png" alt={'searchIcon'} style={{ cursor: 'pointer' }} />
										</InputAdornment>
									}
									endAdornment={
										searchText && (
											<CancelRoundedIcon
												style={{ cursor: 'pointer' }}
												onClick={async () => {
													setSearchText('');
													setMembersInquiry({
														...membersInquiry,
														search: {
															...membersInquiry.search,
															text: '',
														},
													});
													await getMembersRefetch({ input: membersInquiry });
												}}
											/>
										)
									}
								/>
								<Select sx={{ width: '160px', ml: '12px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										All
									</MenuItem>
									<MenuItem value={'USER'} onClick={() => searchTypeHandler('USER')}>
										User
									</MenuItem>
									<MenuItem value={'AGENT'} onClick={() => searchTypeHandler('AGENT')}>
										Agent
									</MenuItem>
									<MenuItem value={'ADMIN'} onClick={() => searchTypeHandler('ADMIN')}>
										Admin
									</MenuItem>
								</Select>
							</Stack>
						</Box>
						<Divider />
						<MemberPanelList
							members={members}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateMemberHandler={updateMemberHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={membersTotal}
							rowsPerPage={membersInquiry?.limit}
							page={membersInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
							sx={{
								'.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-input': {
									display: 'none',
								},
							}}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminUsers.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(AdminUsers);
