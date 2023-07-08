import { atom } from "recoil";
interface IQuiz {
    user_id: string;
    _id: string
    module_name: string;
    questions_id: [{
        _id: string,
        module_name: string,
        description: string,
        alternatives: string[],
        answer: number,
        coins: number,
        score_points: number[],
    }];
    category: string;
    dificulty: string;
    videos_id: [{
        _id: string,
        index: number,
        module_name: string,
        name: string,
        url: string,
        nick: string,
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
