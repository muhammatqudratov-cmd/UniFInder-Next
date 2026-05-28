import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { University } from '../../../types/university/university';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { UniversityStatus } from '../../../enums/university.enum';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'NAME',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'TUITION',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface UniversityPanelListType {
	universities: University[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateUniversityHandler: any;
	removeUniversityHandler: any;
}

export const UniversityPanelList = (props: UniversityPanelListType) => {
	const {
		universities,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateUniversityHandler,
		removeUniversityHandler,
	} = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{universities.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{universities.length !== 0 &&
							universities.map((university: University, index: number) => {
								const universityImage = `${REACT_APP_API_URL}/${university?.universityImages[0]}`;

								return (
									<TableRow hover key={university?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{university._id}</TableCell>
										<TableCell align="left" className={'name'}>
											{university.universityStatus === UniversityStatus.ACTIVE ? (
												<Stack direction={'row'}>
													<Link href={`/university/detail?id=${university?._id}`}>
														<div>
															<Avatar alt="Rem Sharp" src={universityImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/university/detail?id=${university?._id}`}>
														<div>{university.universityName}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction={'row'}>
													<div>
														<Avatar alt="Rem Sharp" src={universityImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: '10px' }}>{university.universityName}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">{university.universityTuition}</TableCell>
										<TableCell align="center">{university.memberData?.memberNick}</TableCell>
										<TableCell align="center">{university.universityLocation}</TableCell>
										<TableCell align="center">{university.universityType}</TableCell>
										<TableCell align="center">
											{university.universityStatus === UniversityStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeUniversityHandler(university._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{university.universityStatus === UniversityStatus.INACTIVE && (
												<Button className={'badge warning'}>{university.universityStatus}</Button>
											)}

											{university.universityStatus === UniversityStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{university.universityStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(UniversityStatus)
															.filter((ele) => ele !== university.universityStatus && ele !== UniversityStatus.DELETE)
															.map((status: string) => (
																<MenuItem
																	onClick={() =>
																		updateUniversityHandler({ _id: university._id, universityStatus: status })
																	}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
