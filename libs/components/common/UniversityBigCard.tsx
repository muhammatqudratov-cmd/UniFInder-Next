import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { University } from '../../types/university/university';
import { REACT_APP_API_URL, topUniversityRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface UniversityBigCardProps {
	university: University;
	likeUniversityHandler?: any;
}

const UniversityBigCard = (props: UniversityBigCardProps) => {
	const { university, likeUniversityHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goUniversityDetailPage = (universityId: string) => {
		router.push(`/university/detail?id=${universityId}`);
	};

	if (device === 'mobile') {
		return <div>APARTMENT BIG CARD</div>;
	} else {
		return (
			<Stack className="university-big-card-box" onClick={() => goUniversityDetailPage(university?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${university?.universityImages?.[0]})` }}
				>
					{university && university?.universityRank >= topUniversityRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}

					<div className={'price'}>${formatterStr(university?.universityTuition)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{university?.universityName}</strong>
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
						<div>
							{university?.universityDormitory ? <p>Rent</p> : <span>Rent</span>}
							{university?.universityScholarship ? <p>Barter</p> : <span>Barter</span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{university?.universityViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: any) => {
									e.stopPropagation();
									likeUniversityHandler(user, university?._id);
								}}
							>
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

export default UniversityBigCard;
