import { useRecoilState } from "recoil";
import { premiumTierState, IPremiumTier } from "../recoil/premiumRecoil";
import api from "../services/api";

export const usePremium = () => {
    const [premiumTiers, setPremiumTiers] = useRecoilState(premiumTierState);

    const getNewPremiumTiers = async (email: string): Promise<IPremiumTier[]> => {
        const res = await api.post("/premium", { email });
        setPremiumTiers(res.data);
        return res.data;
    };

    return {
        premiumTiers,
        setPremiumTiers,
        getNewPremiumTiers
    }
};

export default usePremium;
