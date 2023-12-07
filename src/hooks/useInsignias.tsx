import { useRecoilState } from "recoil"
import { insigniaState } from "../recoil/useRecoilState"
import api from "../services/api";

const useInsignias = () => {
    const [insigniasData, setInsigniasData] = useRecoilState(insigniaState);

    const getInsignias = async () => {
        try {
            const res = await api.get('/insignias/');
            setInsigniasData(res.data);
        } catch (error) {
            console.log('');
        }
    }

    return {
        insigniasData,
        setInsigniasData,
        getInsignias
    }
}

export default useInsignias;
