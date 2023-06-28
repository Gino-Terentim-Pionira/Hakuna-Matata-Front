import { atom } from "recoil";
interface IQuiz {
    user_id: string;
    _id: string
    name: string;
    questions_id: [{
        _id: string,
        description: string,
        alternatives: string[],
        answer: number,
        coins: number,
        score: number[],
        user_id: string[]
    }];
    category: string;
    dificulty: string;
    videos_id: [{
        user_id: string[],
        name: string,
        url: string,
        nick: string,
        _id: string,
    }];
    total_coins: number;
}

const cheetahQuizState = atom({
    key: "videoInfo",
    default: [] as IQuiz[],
});

// Criar outros quizes

export {
    cheetahQuizState,
}
