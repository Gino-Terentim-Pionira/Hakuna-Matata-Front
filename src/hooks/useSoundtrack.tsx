import { useRef } from 'react';

export const useSoundtrack = () => {
    const audio = useRef(new Audio("https://pionira.s3.sa-east-1.amazonaws.com/soundtrack/audio.mp3")) ;

    const playSoundtrack = () => {
        if (audio) {
            (audio.current as HTMLAudioElement).volume = 0.2;
            (audio.current as HTMLAudioElement).play();
        }
    }

    const pauseSoundtrack = () => {
        (audio.current as HTMLAudioElement).volume = 0.2;
        (audio.current as HTMLAudioElement).pause();
    }

    const changeSoundtrack = (url: string) => {
        (audio.current as HTMLAudioElement).volume = 0.2;
        (audio.current as HTMLAudioElement).src = url;
    }

    const muteSoundtrack = () => {
        (audio.current as HTMLAudioElement).volume = 0;
    }

    return {
        audio: audio.current as HTMLAudioElement,
        playSoundtrack,
        pauseSoundtrack,
        changeSoundtrack,
        muteSoundtrack
    }
}
