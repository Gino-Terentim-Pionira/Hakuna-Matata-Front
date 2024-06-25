import api from "./api";

export interface ITutorialTopic {
    name: string;
    icon: string;
    index: number
}

export interface ITutorialContent {
    name: string;
    image: string;
    content: string;
    index: number;
    tutorial_topic_name: string;
}
class TutorialServices {
    getAllTutorialTopics = async (): Promise<ITutorialTopic[]> => {
        const response = await api.get('/tutorial/topics')
        return response.data;
    }

    getContentsByTopic = async (topic_name: string): Promise<ITutorialContent[]> => {
        const response  = await api.get(`tutorial/contents/${topic_name}`);
        return response.data
    }

    checkFirstVisualization = (topic_name: string) => {
        const firstView = localStorage.getItem(`@pionira/tutorial/${topic_name}`);

        if (!firstView) {
            const currentDate = new Date();
            localStorage.setItem(`@pionira/tutorial/${topic_name}`, currentDate.toDateString());
            return true;
        }
        return false;
    }
}

export default  TutorialServices;
