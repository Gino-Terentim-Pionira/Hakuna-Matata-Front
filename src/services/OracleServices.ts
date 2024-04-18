import api from './api';
import trailEnum from '../utils/enums/trail';

export interface IMessages {
    role: 'user' | 'assistant',
    content: string
}

export interface IOracle {
    oracle_name: string;
    trail: trailEnum;
    assistant_id: string;
    background: string;
    image: string;
}

export interface IHistoryResponse {
    messages: IMessages[];
    thread_id: string;
    oracle: Partial<IOracle>
}

export interface ICommonQuestion {
    _id: string
    question: string;
    module_name: string;
    topic: string;
}

export class OracleServices {

    getOracleHistory = async (
        userId: string,
        trail: trailEnum
    ): Promise<IHistoryResponse> => {
        const response = await api.post(`oracle/history/${userId}`, {
            trail
        });

        return response.data;
    }

    getCommonQuestions = async (
        userId: string,
        trail: trailEnum
    ): Promise<ICommonQuestion[]> => {
        const response = await api.post(`oracle/commonquestions/${userId}`, {
            trail
        });

        return response.data;
    }
}
