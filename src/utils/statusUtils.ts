import { IUser } from "../recoil/useRecoilState";
import { AGILITY, LEADERSHIP } from "./constants/statusConstants";
import colorPalette from "../styles/colorPalette";
import trailEnum from "./enums/trail";
import { STATUS_POINTS_TO_UNLOCK_FINAL_QUIZ } from "./constants/constants";

export const hasEnougthStatusForFinalQuiz = (userData: IUser, statusName: string) => {
    return getStatusPoints(userData, statusName) >= STATUS_POINTS_TO_UNLOCK_FINAL_QUIZ ? "enoughStatus" : "notEnoughStatus";
}

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
        case trailEnum.CHEETAH:
            return AGILITY;

        case trailEnum.LION:
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