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
        score_point: number,
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
        coins: number
    }];
    total_coins: number;
    trail: string;
}

const moduleState = atom({
    key: "videoInfo",
    default: [] as IQuiz[],
});

// Criar outros quizes

export {
 moduleState,
}
