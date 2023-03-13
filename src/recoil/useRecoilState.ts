import { atom } from "recoil";

interface IUser {
	ignorance: number;
	_id: string;
	userName: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	birthday_date: string;
	is_confirmed: boolean;
	status: number[];
	coins: number;
	contribution: number;
	first_certificate: string;
	second_certificate: string;
	isFirstTimeAppLaunching: boolean;
	narrative_status: {
		trail1: number;
		trail2: number;
		mambaQuiz: number;
	};
    finalQuizComplete: {
        cheetahFinal: boolean
    };
}

const userState = atom({
    key: "useInfo",
    default: {} as IUser
});

const insigniaState = atom({
    key: "insigniaState",
    default: []
});

export {
    userState,
    insigniaState
};
