import api from './api';
import { Question } from '../recoil/trailRecoilState';

export class TrailServices {

    startFinalChallenge = async (userId: string, trailName: string): Promise<{
        questions: Question[],
        totalQuestions: number
    }> => {
        const result = await api.post(`/trail/finalchallenge/${userId}`, {
            trailName
        });

        return result.data;
    }
}
