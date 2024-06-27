import api from './api';
import trailEnum from '../utils/enums/trail';

export interface IMessages {
    role: 'user' | 'assistant',
    content: string,
    isNew?: boolean
}

export interface IOracle {
    oracle_name: string;
    trail: trailEnum;
    assistant_id: string;
    background: string;
    sprite_idle: string;
    sprite_talking: string;
}

export interface IHistoryResponse {
    messages: IMessages[];
    thread_id: string;
    oracle: IOracle
}

export interface ICommonQuestion {
    _id: string
    question: string;
    module_name: string;
    topic: string;
}

export type PackageType = {
    package_name: string,
    price: string,
    messages: string,
    type: string,
    description: string,
    image: string
}

export class OracleServices {

    private createURL = (rec: string) => (`oracle/${rec}`);

    getOracleHistory = async (
        userId: string,
        trail: trailEnum
    ): Promise<IHistoryResponse> => {
        const response = await api.post(this.createURL(`history/${userId}`), {
            trail
        });

        return response.data;
    }

    getCommonQuestions = async (
        userId: string,
        trail: trailEnum
    ): Promise<ICommonQuestion[]> => {
        const response = await api.post(this.createURL(`commonquestions/${userId}`), {
            trail
        });

        return response.data;
    }

    getAllPackages = async () => {
        const response = await api.get(this.createURL('packages'))

        const packageData = response.data.map((item: PackageType) => ({
            title: item.package_name,
            price: item.price,
            messages: item.messages,
            type: item.type,
            description: item.description,
            image: item.image
        }));

        return packageData;
    };

    buyOracleMessages = async (userId: string, package_name: string) => {
        const response = await api.post(this.createURL(`packages/${userId}`), {
            package_name
        });

        return response.data;
    }

    sendMessage = async (
        userId: string,
        thread_id: string,
        assistant_id: string,
        content: string
    ): Promise<IMessages[]> => {
        const response = await api.post(this.createURL(`sendmessage/${userId}`), {
            thread_id,
            assistant_id,
            content
        });

        return response.data;
    }
}
