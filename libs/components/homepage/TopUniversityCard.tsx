import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { University } from '../../types/university/university';
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
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const pushDetailHandler = async (universityId: string) => {
		await router.push({ pathname: `/university/detail`, query: { id: universityId } });
	};

	return (
		<div
			onClick={() => pushDetailHandler(university._id)}
			style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '340px', cursor: 'pointer', background: '#1a1a2e', width: '100%' }}
		>
			{university.universityImages?.[0] ? (
				<img
					src={`${REACT_APP_API_URL}/${university.universityImages[0]}`}
					alt={university.universityName}
					style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			) : (
				<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #2d2d44, #1a1a2e)' }} />
			)}

			<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)' }} />

			<button
				onClick={(e) => { e.stopPropagation(); likeUniversityHandler(user, university._id); }}
				style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
			>
				{university?.meLiked && university?.meLiked[0]?.myFavorite
					? <FavoriteIcon style={{ fontSize: 17, color: '#ff6b6b' }} />
					: <FavoriteBorderIcon style={{ fontSize: 17, color: '#fff' }} />
				}
			</button>

			<div style={{ position: 'absolute', bottom: 62, left: 16, right: 16, zIndex: 2 }}>
				<h3 style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>
					{university.universityName}
				</h3>
				<p style={{ margin: '4px 0 8px', color: 'rgba(255,255,255,0.72)', fontSize: 12 }}>
					{university.universityAddress}
				</p>
				<div style={{ display: 'flex', gap: 12, color: '#fff', fontSize: 12 }}>
					<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						<LocalOfferIcon style={{ fontSize: 13, opacity: 0.85 }} />
						from ${university.universityTuition?.toLocaleString()}
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						<AspectRatioIcon style={{ fontSize: 13, opacity: 0.85 }} />
						{university.universityCampusSize} m²
					</span>
				</div>
			</div>

			<button
				onClick={(e) => { e.stopPropagation(); pushDetailHandler(university._id); }}
				style={{ position: 'absolute', bottom: 14, left: 14, right: 14, height: 40, borderRadius: '50px', background: '#fff', border: 'none', color: '#1a1a1a', fontSize: 13, fontWeight: 600, cursor: 'pointer', zIndex: 2 }}
			>
				View Details
			</button>
		</div>
	);
};

export default TopUniversityCard;
