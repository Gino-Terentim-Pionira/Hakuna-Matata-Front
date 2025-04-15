import { atom } from "recoil";

export interface IScript {
    name: string;
    image: string;
    texts: string[];
}
export interface Question {
    _id: string;
    description: string;
    alternatives: string[];
    answer: number;
    coins: number;
    videoName: string;
}

export interface Video {
    _id: string;
    videoIndex: number;
    videoName: string;
    description: string;
    url: string;
    thumbnail?: string;
    coins: number;
}

export interface Module {
    _id: string;
    moduleIndex: number;
    trailName: string;
    moduleName: string;
    isFinalChallenge: boolean;
    videos: Video[];
    questions: Question[];
    isBlocked: boolean;
    questionsRemaining: number;
    coinsRemaining: number;
    finalChallengeImage?: string;
    isCompleted: boolean;
    top?: string;
    left?: string;
    topMobile?: string;
    leftMobile?: string;
}

export interface TrailPage {
    backgroundDay: string;
    backgroundNight: string;
    trailPageIndex: number;
    modules: Module[];
}

export interface Trail {
    trailName: string;
    statusName: string;
    soundtrack: string;
    stamps: number;
    totalModules: number;
    trailPages: TrailPage[];
    stampImage: string;
    finalChallenge: {
        isBlocked: boolean;
        isAvailable: boolean;
        isComplete: boolean;
        icon?: string;
        image?: string;
        id: string;
    };
    oracle: {
        isAvailable: boolean,
        availableAnimation: string,
        updatedAnimation: string
    };
    newScript?: {
        _id: string;
        quantModule: number;
        trailName: string;
        scriptObject: IScript[];
    }
}

const trailState = atom<Trail | null>({
    key: "trailState",
    default: null,
});

export { trailState };
