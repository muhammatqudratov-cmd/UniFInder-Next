import { UniversityLocation, UniversityStatus, UniversityType } from '../../enums/university.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface University {
	_id: string;
	universityType: UniversityType;
	universityStatus: UniversityStatus;
	universityLocation: UniversityLocation;
	universityAddress: string;
	universityName: string;
	universityTuition: number;
	universityCampusSize: number;
	universityCapacity: number;
	universityFaculties: number;
	universityViews: number;
	universityLikes: number;
	universityComments: number;
	universityRank: number;
	universityImages: string[];
	universityDesc?: string;
	universityScholarship: boolean;
	universityDormitory: boolean;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Universities {
	list: University[];
	metaCounter: TotalCounter[];
}
