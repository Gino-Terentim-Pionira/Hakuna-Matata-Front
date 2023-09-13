import { IUser } from "../recoil/useRecoilState";
import { AGILITY, LEADERSHIP } from "./constants/constants";

export const getStatusPoints = (userData: IUser, statusName: string) => {
    const status = userData.status.find((item) => item.name == statusName);

    if (status) {
        return status.points;
    } else {
        return 0;
    }
}

export const getStatusName = (trail: string) => {
    switch (trail) {
        case 'cheetah':
            return AGILITY;

        case 'lion':
            return LEADERSHIP;
    
        default:
            return '';
    }
}