import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { University } from '../../types/university/university';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { UniversityStatus } from '../../enums/university.enum';

interface UniversityCardProps {
	university: University;
	deleteUniversityHandler?: any;
	memberPage?: boolean;
	updateUniversityHandler?: any;
}

export const UniversityCard = (props: UniversityCardProps) => {
	const { university, deleteUniversityHandler, memberPage, updateUniversityHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditUniversity = async (id: string) => {
		console.log('+pushEditUniversity: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addUniversity', universityId: id },
		});
	};

	const pushUniversityDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/university/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE UNIVERSITY CARD</div>;
	} else
		return (
			<Stack className="university-card-box">
				<Stack className="image-box" onClick={() => pushUniversityDetail(university?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${university.universityImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushUniversityDetail(university?._id)}>
					<Typography className="name">{university.universityName}</Typography>
					<Typography className="address">{university.universityAddress}</Typography>
					<Typography className="price">
						<strong>${formatterStr(university?.universityTuition)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{university.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{university.universityStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && university.universityStatus !== 'INACTIVE' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{university.universityStatus === 'ACTIVE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateUniversityHandler(UniversityStatus.INACTIVE, university?._id);
									}}
								>
									inactive
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{university.universityViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && university.universityStatus === UniversityStatus.ACTIVE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditUniversity(university._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteUniversityHandler(university._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
