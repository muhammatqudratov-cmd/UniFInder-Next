import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	index?: number;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', index, likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';
	const avatarPath: string = boardArticle?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';
	const stripHtml = (html?: string) => (html ? html.replace(/<[^>]*>/g, '').trim() : '');

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<Stack
				sx={{ width: index === 0 ? '100%' : size === 'small' ? '285px' : '317px' }}
				className={`community-general-card-config ${index === 0 ? 'featured' : ''}`}
				onClick={(e: any) => chooseArticleHandler(e, boardArticle)}
			>
				<Stack className="image-box">
					<img src={imagePath} alt="" className="card-img" />
				</Stack>
				<Stack className="content-box">
					<Stack className="tag-row">
						<span className="category-tag">{boardArticle?.articleCategory} BOARD</span>
						{index === 0 && <span className="pinned-tag">PINNED</span>}
					</Stack>
					<Typography className="title">{boardArticle?.articleTitle}</Typography>
					<Typography className="excerpt">{stripHtml(boardArticle?.articleContent)}</Typography>
					<span className="card-divider" />
					<Stack className="footer-row">
						<Stack className="author-info">
							<img
								src={avatarPath}
								alt=""
								className="avatar-img"
								onClick={(e: any) => {
									e.stopPropagation();
									goMemberPage(boardArticle?.memberData?._id as string);
								}}
							/>
							<Stack className="author-text">
								<Typography
									className="author-name"
									onClick={(e: any) => {
										e.stopPropagation();
										goMemberPage(boardArticle?.memberData?._id as string);
									}}
								>
									{boardArticle?.memberData?.memberNick}
								</Typography>
								<Typography className="author-meta">
									INU · <Moment format={'MMM DD'}>{boardArticle?.createdAt}</Moment>
								</Typography>
							</Stack>
						</Stack>
						<Stack className={'buttons'}>
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{boardArticle?.articleViews}</Typography>
							<IconButton color={'default'} onClick={(e: any) => likeArticleHandler(e, user, boardArticle?._id)}>
								{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon color={'primary'} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{boardArticle?.articleLikes}</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityCard;
