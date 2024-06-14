import { useRecoilState } from "recoil"
import { moduleState } from "../recoil/moduleRecoilState"
import api from "../services/api";
import trailEnum from "../utils/enums/trail";

export const useModule = () => {
    const [moduleData, setModuleData] = useRecoilState(moduleState);

    // Criar outros quizes

    const getNewModuleInfo = async () => {
        const res = await api.get(`/module/${trailEnum.CHEETAH}`);
        setModuleData(res.data);
    }
    return {
        moduleData,
        setModuleData,
        getNewModuleInfo,
    }
}

export default useModule;
