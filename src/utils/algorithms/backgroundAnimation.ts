import { verifyIsDayTime } from "./date";

export enum pathEnum {
    HOME = 'home',
    MAINPAGE = 'mainPage',
    CHEETAH = 'cheetah'
}

export const getBackgroundAnimation = (path: pathEnum) => {
    const backgroundDay = {
        home: 'https://d2musj5gyuvayp.cloudfront.net/backgrounds/home.webm',
        mainPage: 'https://d2musj5gyuvayp.cloudfront.net/backgrounds/trail_selection.webm',
        cheetah: 'https://d2musj5gyuvayp.cloudfront.net/backgrounds/cheetah_trail.webm'
    };

    const backgroundNight = {
        home: 'https://d2musj5gyuvayp.cloudfront.net/backgrounds/home_night.webm',
        mainPage: 'https://d2musj5gyuvayp.cloudfront.net/backgrounds/trail_selection_night.webm',
        cheetah: 'https://d2musj5gyuvayp.cloudfront.net/backgrounds/cheetah_trail_night.webm'
    };

    return verifyIsDayTime() ? backgroundDay[path] : backgroundNight[path]
}