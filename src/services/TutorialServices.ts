import api from "./api";

export interface ITutorialTopic {
    name: string;
    icon: string;
    index: number
}
class TutorialServices {
    getAllTutorialTopics = async (): Promise<ITutorialTopic[]> => {
        const response = await api.get('/tutorial/topics')
        return response.data;
    }
}

export default  TutorialServices;
