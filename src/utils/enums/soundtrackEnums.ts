const authenticationSoundtrack =  "https://pionira.s3.sa-east-1.amazonaws.com/soundtrack/mainPage.mp3"

export const soundtrackEnum: {[key: string]: string} = {
    "/mainPage": "https://pionira.s3.sa-east-1.amazonaws.com/soundtrack/home.mp3",
    "/": authenticationSoundtrack,
    "/login": authenticationSoundtrack,
    "/register": authenticationSoundtrack,
    "/trilha-cheetah": "https://pionira.s3.sa-east-1.amazonaws.com/soundtrack/cheetahPath.mp3",
    "/oracle": "https://pionira.s3.sa-east-1.amazonaws.com/soundtrack/oracle.mp3"
}
