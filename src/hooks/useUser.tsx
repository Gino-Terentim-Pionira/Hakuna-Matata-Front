import { SetStateAction } from "react";
import { useRecoilState } from "recoil"
import { userState, IUser } from "../recoil/useRecoilState"
import api from "../services/api";


export const useUser = () => {
    const [userData, setUserData] = useRecoilState(userState);

    const getNewUserInfo = async () => {
        try {
            const _userId: SetStateAction<string> | null = sessionStorage.getItem(
                '@pionira/userId',
            );
            const res = await api.get(`/user/${_userId}`);
            const resAvatar = await api.get(`user/avatar/${_userId}`);
            const user: IUser = {
                ...res.data,
                custom_avatar: resAvatar.data
            }
            console.log(user)
            setUserData(user);
        } catch (error) {
            console.log('');
        }
    }

    return {
        userData,
        setUserData,
        getNewUserInfo
    }
}

export default useUser;
