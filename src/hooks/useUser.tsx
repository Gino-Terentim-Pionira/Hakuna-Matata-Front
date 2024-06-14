import { SetStateAction } from "react";
import { useRecoilState } from "recoil"
import { userState, IUser } from "../recoil/useRecoilState"
import api from "../services/api";
import { UserServices } from "../services/UserServices";


export const useUser = () => {
    const [userData, setUserData] = useRecoilState(userState);
    const userServices = new UserServices()

    const getNewUserInfo = async () => {
        const _userId: SetStateAction<string> | null = sessionStorage.getItem(
            '@pionira/userId',
        );
        const res = await api.get(`/user/${_userId}`);
        const resAvatar = await userServices.getUserAvatar(_userId as string);
        const user: IUser = {
            ...res.data,
            custom_avatar: resAvatar.data
        }
        setUserData(user);
    }

    return {
        userData,
        setUserData,
        getNewUserInfo
    }
}

export default useUser;
