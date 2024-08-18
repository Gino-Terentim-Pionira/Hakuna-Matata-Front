import { atom } from "recoil";

interface ISoundtrack {
    isPlaying: boolean;
    isLoaded: boolean;
}

const soundtrackState = atom({
    key: "soundtrackState",
    default: {} as ISoundtrack
});

export {
    soundtrackState
};