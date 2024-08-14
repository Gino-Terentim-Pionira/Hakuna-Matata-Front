import { soundtrackEnum } from "../utils/enums/soundtrackEnums";

export const useSoundtrack = () => {
    const audio = document.getElementById('audio') as HTMLAudioElement;
    const isSoundtrackMuted = localStorage.getItem("isSoundtrackMuted");

    const changeVolumeSoundtrack = () => {
        audio.volume = 0.2;
    }

    const playSoundtrack = () => {
        if (audio) {
            changeVolumeSoundtrack();
            audio.play();

            if (isSoundtrackMuted === "true") {
                muteSoundtrack();
            }
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

    const muteSoundtrack = (fallback?: VoidFunction) => {
        if (audio) {
            localStorage.setItem("isSoundtrackMuted", "true");
            audio.volume = 0;
            fallback && fallback()
        }
    }

    const unmuteSoundtrack = (fallback?: VoidFunction) => {
        if (audio) {
            localStorage.setItem("isSoundtrackMuted", "false");
            changeVolumeSoundtrack();
            fallback && fallback()
        }
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
