import { soundtrackEnum } from "../utils/enums/soundtrackEnums";
import { useRecoilState } from "recoil";
import { soundtrackState } from "../recoil/soundtrackRecoilState";

export const useSoundtrack = () => {
    const audio = document.getElementById('audio') as HTMLAudioElement;
    const isSoundtrackMuted = localStorage.getItem("isSoundtrackMuted");
    const [soundtrackData, setSoundtrackData] = useRecoilState(soundtrackState);

    const changeVolumeSoundtrack = () => {
        audio.volume = 0.2;
    }

    const playSoundtrack = () => {
        if (audio) {
            changeVolumeSoundtrack();
            setTimeout(() => {
                audio.play();
            }, 200);

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
        if(audio.src !== soundtrackEnum[path]) {
            audio.src = soundtrackEnum[path] ;
            sessionStorage.setItem('lastSoundtrack', soundtrackEnum[path]);

            pauseSoundtrack();
            if(soundtrackData.isPlaying)
                playSoundtrack();
        }
    }

    const muteSoundtrack = (fallback?: VoidFunction) => {
        if (audio) {
            localStorage.setItem("isSoundtrackMuted", "true");
            audio.volume = 0;
            fallback && fallback();
        }
    }

    const unmuteSoundtrack = (fallback?: VoidFunction) => {
        if (audio) {
            localStorage.setItem("isSoundtrackMuted", "false");
            changeVolumeSoundtrack();
            fallback && fallback();
        }
    }

    return {
        audio: audio as HTMLAudioElement,
        playSoundtrack,
        pauseSoundtrack,
        changeSoundtrack,
        muteSoundtrack,
        unmuteSoundtrack,
        soundtrackData,
        setSoundtrackData
    }
}
