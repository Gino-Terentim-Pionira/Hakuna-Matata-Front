import { useRecoilState } from "recoil"
import { moduleState } from "../recoil/moduleRecoilState"
import api from "../services/api";

export const useModule = () => {
    const [moduleData, setModuleData] = useRecoilState(moduleState);

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
