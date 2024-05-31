import api from "./api";

class TutorialServices {
    getAllTutorialTopics = async () => {
        return await api.get('/tutorial/topics');
    }
}

export default  TutorialServices;
