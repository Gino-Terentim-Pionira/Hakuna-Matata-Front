import { soundtrackEnum } from "../utils/enums/soundtrackEnums";
import { useRecoilState } from "recoil";
import { soundtrackState } from "../recoil/soundtrackRecoilState";

export const useSoundtrack = () => {
    const audio = document.getElementById('audio') as HTMLAudioElement;
    const [soundtrackData, setSoundtrackData] = useRecoilState(soundtrackState);

    const changeVolumeSoundtrack = () => {
        audio.volume = 0.2;
    }

    const playSoundtrack = () => {
        if (audio) {
            changeVolumeSoundtrack();

            setSoundtrackData({
                ...soundtrackData,
                isPlaying: true,
            });

            setTimeout(() => {
                audio.play();
            }, 200);
        }
    }

    const pauseSoundtrack = () => {
        if (audio) {
            audio.volume = 0;
            setSoundtrackData({
                ...soundtrackData,
                isPlaying: false,
            });
        }
    }

    const changeSoundtrack = (path: string, soundtrackUrl?: string) => {
        const newSoundtrack = soundtrackUrl || soundtrackEnum[path];
        if (audio.src !== newSoundtrack) {
            audio.src = newSoundtrack;
            sessionStorage.setItem('lastSoundtrack', newSoundtrack);

            pauseSoundtrack();
            if (soundtrackData.isPlaying)
                playSoundtrack();
        }
    }

    return {
        audio: audio as HTMLAudioElement,
        playSoundtrack,
        pauseSoundtrack,
        changeSoundtrack,
        soundtrackData,
        setSoundtrackData
    }
}
