import { verifyIsDayTime } from "./date";

export enum pathEnum {
    HOME = 'home',
    MAINPAGE = 'mainPage',
    CHEETAH = 'cheetah'
}

export const getBackgroundAnimation = (path: pathEnum) => {
    const backgroundDay = {
        home: 'https://pionira.s3.sa-east-1.amazonaws.com/backgrounds/home.webm',
        mainPage: 'https://pionira.s3.sa-east-1.amazonaws.com/backgrounds/trail_selection.webm',
        cheetah: 'https://pionira.s3.sa-east-1.amazonaws.com/backgrounds/cheetah_trail.webm'
    };

    const backgroundNight = {
        home: 'https://pionira.s3.sa-east-1.amazonaws.com/backgrounds/home_night.webm',
        mainPage: 'https://pionira.s3.sa-east-1.amazonaws.com/backgrounds/trail_selection_night.webm',
        cheetah: 'https://pionira.s3.sa-east-1.amazonaws.com/backgrounds/cheetah_trail_night.webm'
    };

    return verifyIsDayTime() ? backgroundDay[path] : backgroundNight[path]
}