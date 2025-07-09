import { SetStateAction } from "react";
import { useRecoilState } from "recoil"
import { userState, IUser } from "../recoil/useRecoilState"
import api from "../services/api";
import { UserServices } from "../services/UserServices";
import { PremiumServices } from "../services/PremiumServices";


export const useUser = () => {
    const [userData, setUserData] = useRecoilState(userState);
    const userServices = new UserServices();
    const premiumServices = new PremiumServices();

    const getNewUserInfo = async () => {
        const _userId: SetStateAction<string> | null = sessionStorage.getItem(
            '@pionira/userId',
        );
        const res = await api.get(`/user/${_userId}`);
        const resAvatar = await userServices.getUserAvatar(_userId as string);
        const isSubscribed = await premiumServices.isUserSubscribed(res.data.email);
        const user: IUser = {
            ...res.data,
            custom_avatar: resAvatar.data,
            isSubscribed
        }
        setUserData(user);
        return user;
    }

    return {
        userData,
        setUserData,
        getNewUserInfo
    }
}

export default useUser;
