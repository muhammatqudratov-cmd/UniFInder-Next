import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { University } from '../../types/university/university';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopUniversityCardProps {
	university: University;
	likeUniversityHandler: any;
}

const TopUniversityCard = (props: TopUniversityCardProps) => {
	const { university, likeUniversityHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (universityId: string) => {
		await router.push({ pathname: `/university/detail`, query: { id: universityId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${university?.universityImages[0]})` }}
					onClick={() => {
						pushDetailHandler(university._id);
					}}
				>
					<div>${university?.universityTuition}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(university._id);
						}}
					>
						{university?.universityName}
					</strong>
					<p className={'desc'}>{university?.universityAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{university?.universityCapacity} bed</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{university?.universityFaculties} rooms</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{university?.universityCampusSize} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{university.universityDormitory ? 'Rent' : ''} {university.universityDormitory && university.universityScholarship && '/'}{' '}
							{university.universityScholarship ? 'Barter' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{university?.universityViews}</Typography>
							<IconButton color={'default'} onClick={() => likeUniversityHandler(user, university?._id)}>
								{university?.meLiked && university?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{university?.universityLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${university?.universityImages[0]})` }}
					onClick={() => {
						pushDetailHandler(university._id);
					}}
				>
					<div>${university?.universityTuition}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(university._id);
						}}
					>
						{university?.universityName}
					</strong>
					<p className={'desc'}>{university?.universityAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{university?.universityCapacity} bed</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{university?.universityFaculties} rooms</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{university?.universityCampusSize} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{university.universityDormitory ? 'Rent' : ''} {university.universityDormitory && university.universityScholarship && '/'}{' '}
							{university.universityScholarship ? 'Barter' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{university?.universityViews}</Typography>
							<IconButton color={'default'} onClick={() => likeUniversityHandler(user, university?._id)}>
								{university?.meLiked && university?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{university?.universityLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TopUniversityCard;
