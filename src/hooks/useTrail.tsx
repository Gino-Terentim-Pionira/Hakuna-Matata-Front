import { useRecoilState } from "recoil";
import { trailState } from "../recoil/trailRecoilState";
import api from "../services/api";
import { SetStateAction } from "react";

export const useTrail = () => {
    const [trailData, setTrailData] = useRecoilState(trailState);

    const getNewTrailInfo = async (trailName: string) => {
        if (trailData && trailData.trailName == trailName) {
            return;
        }
        const _userId: SetStateAction<string> | null = sessionStorage.getItem(
            '@pionira/userId',
        );

        const res = await api.post(`/trail/${_userId}`, { trailName });
        setTrailData(res.data);
    };

    return {
        trailData,
        setTrailData,
        getNewTrailInfo,
    };
};

export default useTrail;
