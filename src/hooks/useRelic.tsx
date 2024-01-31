import { useRecoilState } from "recoil";
import api from "../services/api";
import { relicState } from "../recoil/relicRecoilState";

export const useRelic = () => {
    const [relicData, setRelicData] = useRecoilState(relicState);

    const getRelics = async (userId: string) => {
        try {
            const res = await api.get(`/relic/${userId}`);
            setRelicData(res.data);
            console.log(res.data);
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