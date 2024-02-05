import { atom } from "recoil";

export interface IUser {
	ignorance: number;
	_id: string;
	userName: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	birthday_date: string;
	is_confirmed: boolean;
	status: [{
        name: string;
        points: number;
    }];
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
		cheetahFinal: boolean;
		blackMamba: boolean;
	};
	consecutiveDays: number;
	luck: number;
	items_id: string[];
	question_id: string[];
    video_id: string[];
	module_id: string[];
	equiped_relics: {
		first_slot: {
			relic_name: string,
			date: Date
		},
		second_slot: {
			relic_name: string,
			date: Date
		}
	};
	user_relics: [{
		relic_name: string;
		date: Date;
	}];
	custom_avatar: {
        hair: string;
        hair_color: string;
        facial_hair: string;
        clothes: string;
        eyes: string;
        eyebrow: string;
        mouth: string;
        skin: string
    }
}

const userState = atom({
	key: "useInfo",
	default: {} as IUser
});


export {
	userState
};
