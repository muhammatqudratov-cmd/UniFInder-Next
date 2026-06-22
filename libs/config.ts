export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['universityScholarship', 'universityDormitory'];

const thisYear = new Date().getFullYear();

export const universityYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	universityYears.push(String(i));
}

export const universityCampusSize = [0, 200000, 400000, 600000, 900000, 1200000, 1600000];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topUniversityRank = 2;
