import { useRecoilState } from "recoil"
import { cheetahQuizState } from "../recoil/quizRecoilState"
import api from "../services/api";

export const useModule = () => {
    const [moduleData, setModuleData] = useRecoilState(cheetahQuizState);

    // Criar outros quizes

    const getNewModuleInfo = async () => {
        try {
            const res = await api.get('/module/cheetah');
            setModuleData(res.data);
        } catch (error) {
            console.log('');
        }
    }
    return {
        moduleData,
        setModuleData,
        getNewModuleInfo,
    }
}

export default useModule;
