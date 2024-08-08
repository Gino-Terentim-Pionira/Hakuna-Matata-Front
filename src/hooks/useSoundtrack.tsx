import { soundtrackEnum } from "../utils/enums/soundtrackEnums";

export const useSoundtrack = () => {
    const audio = document.getElementById('audio') as HTMLAudioElement;

    const changeVolumeSoundtrack = () => {
        audio.volume = 0.05;
    }

    const playSoundtrack = () => {
        if (audio) {
            changeVolumeSoundtrack();
            audio.play();
        }
    }

    const pauseSoundtrack = () => {
        changeVolumeSoundtrack();
        audio.pause();
    }

    const changeSoundtrack = (path: string) => {
        audio.src =  soundtrackEnum[path] ;
        pauseSoundtrack()
        playSoundtrack()
    }

    const muteSoundtrack = () => {
        audio.volume = 0;
    }

    const unmuteSoundtrack = () => {
        audio.volume = 0.05;
    }

    return {
        audio: audio as HTMLAudioElement,
        playSoundtrack,
        pauseSoundtrack,
        changeSoundtrack,
        muteSoundtrack,
        unmuteSoundtrack
    }
}
