import { useRecoilState } from "recoil";
import api from "../services/api";
import { relicState } from "../recoil/relicRecoilState";

export const useRelic = () => {
    const [relicData, setRelicData] = useRecoilState(relicState);

    const getRelics = async () => {
        try {
            const res = await api.get('/relic/');
            setRelicData(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    return {
        relicData,
        setRelicData,
        getRelics
    }
}

export default useRelic;