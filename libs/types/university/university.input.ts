import { UniversityLocation, UniversityStatus, UniversityType } from '../../enums/university.enum';
import { Direction } from '../../enums/common.enum';

export interface UniversityInput {
	universityType: UniversityType;
	universityLocation: UniversityLocation;
	universityAddress: string;
	universityName: string;
	universityTuition: number;
	universityCampusSize: number;
	universityCapacity: number;
	universityFaculties: number;
	universityImages: string[];
	universityDesc?: string;
	universityScholarship?: boolean;
	universityDormitory?: boolean;
	memberId?: string;
	constructedAt?: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: UniversityLocation[];
	typeList?: UniversityType[];
	facultiesList?: Number[];
	options?: string[];
	capacityList?: Number[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	squaresRange?: Range;
	text?: string;
}

export interface UniversitiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	universityStatus?: UniversityStatus;
}

export interface AgentUniversitiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	universityStatus?: UniversityStatus;
	universityLocationList?: UniversityLocation[];
}

export interface AllUniversitiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
