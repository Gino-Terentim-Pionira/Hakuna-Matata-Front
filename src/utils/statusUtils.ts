import { IUser } from "../recoil/useRecoilState";
import { AGILITY, LEADERSHIP } from "./constants/statusConstants";
import colorPalette from "../styles/colorPalette";

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

export const getStatusColor = (status: string) => {
    switch (status) {
        case AGILITY:
            return colorPalette.primaryColor;

        case LEADERSHIP:
            return colorPalette.secondaryColor;
    
        default:
            return colorPalette.secondaryColor;
    }
}

export const getStatusNick = (status: string) => {
    switch (status) {
        case AGILITY:
            return 'AGILIDADE';

        case LEADERSHIP:
            return 'LIDERANÇA';
    
        default:
            return '';
    }
}