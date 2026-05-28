import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberUniversities
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        UNIVERSITY        *
 *************************/

export const UPDATE_UNIVERSITY_BY_ADMIN = gql`
	mutation UpdateUniversityByAdmin($input: UniversityUpdate!) {
		updateUniversityByAdmin(input: $input) {
			_id
			universityType
			universityStatus
			universityLocation
			universityAddress
			universityName
			universityTuition
			universityCampusSize
			universityCapacity
			universityFaculties
			universityViews
			universityLikes
			universityImages
			universityDesc
			universityScholarship
			universityDormitory
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_UNIVERSITY_BY_ADMIN = gql`
	mutation RemoveUniversityByAdmin($input: String!) {
		removeUniversityByAdmin(universityId: $input) {
			_id
			universityType
			universityStatus
			universityLocation
			universityAddress
			universityName
			universityTuition
			universityCampusSize
			universityCapacity
			universityFaculties
			universityViews
			universityLikes
			universityImages
			universityDesc
			universityScholarship
			universityDormitory
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;
