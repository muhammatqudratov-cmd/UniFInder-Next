import { UniversityLocation, UniversityStatus, UniversityType } from '../../enums/university.enum';

export interface UniversityUpdate {
	_id: string;
	universityType?: UniversityType;
	universityStatus?: UniversityStatus;
	universityLocation?: UniversityLocation;
	universityAddress?: string;
	universityName?: string;
	universityTuition?: number;
	universityCampusSize?: number;
	universityCapacity?: number;
	universityFaculties?: number;
	universityImages?: string[];
	universityDesc?: string;
	universityScholarship?: boolean;
	universityDormitory?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
