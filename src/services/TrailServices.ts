import api from './api';
import { Question } from '../recoil/trailRecoilState';

export interface IStamps {
    trailName: string;
    stampImage: string;
    stamps: number;
    statusName: string;
}

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

    getAllStamps = async (userId: string): Promise<IStamps[]> => {
        const result = await api.get(`/trail/stamps/${userId}`);

        return result.data.result;
    }
}
