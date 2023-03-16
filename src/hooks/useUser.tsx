import { SetStateAction } from "react";
import { useRecoilState } from "recoil"
import { userState } from "../recoil/useRecoilState"
import api from "../services/api";


export const useUser = () => {
    const [userData, setUserData] = useRecoilState(userState);

    const getNewUserInfo = async () => {
        try {
            const _userId: SetStateAction<string> | null = sessionStorage.getItem(
                '@pionira/userId',
            );
            const res = await api.get(`/user/${_userId}`);
            setUserData(res.data);
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
