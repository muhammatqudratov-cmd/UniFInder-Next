import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../config';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<'NEWS' | 'FREE'>('NEWS');
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getNewsArticlesLoading,
		data: getNewsArticlesData,
		error: getNewsArticlesError,
		refetch: getNewsArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.NEWS } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getBoardArticles?.list);
		},
	});

	const {
		loading: getFreeArticlesLoading,
		data: getFreeArticlesData,
		error: getFreeArticlesError,
		refetch: getFreeArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.FREE } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFreeArticles(data?.getBoardArticles?.list);
		},
	});

	const displayedArticles = activeTab === 'NEWS' ? newsArticles : freeArticles;

	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	} else {
		return (
			<div className="community-board">
				<div className="community-header">
					<div className="community-header-left">
						<h2>Community Board</h2>
						<p>What students are talking about right now</p>
					</div>
					<div className="community-tabs">
						<button
							className={`community-tab ${activeTab === 'NEWS' ? 'active' : ''}`}
							onClick={() => setActiveTab('NEWS')}
						>
							News
						</button>
						<button
							className={`community-tab ${activeTab === 'FREE' ? 'active' : ''}`}
							onClick={() => setActiveTab('FREE')}
						>
							Free Board
						</button>
					</div>
				</div>

				<div className="community-grid">
					{displayedArticles?.map((article: BoardArticle, index: number) => (
						<div
							key={article._id}
							className="community-card"
							onClick={() => router.push(`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`)}
						>
							<img
								className="community-card-thumb"
								src={article.articleImage ? `${REACT_APP_API_URL}/${article.articleImage}` : '/img/community/communityImg.png'}
								alt=""
							/>
							<div className="community-card-content">
								<div className="community-card-tags">
									<span className={`community-tag ${article.articleCategory === BoardArticleCategory.NEWS ? 'community-tag-news' : 'community-tag-free'}`}>
										{article.articleCategory}
									</span>
									{article.articleViews > 50 && (
										<span className="community-tag community-tag-hot">HOT</span>
									)}
								</div>
								<div className="community-card-row">
									<span className="community-card-num">{String(index + 1).padStart(2, '0')}</span>
									<span className="community-card-title">{article.articleTitle}</span>
									<span className="community-card-arrow">›</span>
								</div>
								<div className="community-card-meta">
									<span>👁 {article.articleViews}</span>
									<span>💬 {article.articleComments}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
};

export default CommunityBoards;
