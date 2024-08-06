import { useLocation } from "react-router-dom";
import { useSoundtrack } from "../hooks/useSoundtrack";
import { useEffect, useState } from "react";
import React from "react";
import {soundtrackEnum} from "../utils/enums/soundtrackEnums";

export const SoundtrackManager = () => {
    const location = useLocation();
    const { playSoundtrack } = useSoundtrack();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const defaultSrc = soundtrackEnum[location.pathname];

    useEffect(() => {
        const handleCanPlayThrough = () => {
            setIsLoaded(true);
        };

        const handleClick = () => {
            if (isLoaded && !isPlaying) {
                playSoundtrack();
                setIsPlaying(true);
            }
        };

        const audioElement = document.getElementById('audio');

        if (audioElement) {
            audioElement.addEventListener('canplaythrough', handleCanPlayThrough);
            document.addEventListener('click', handleClick);
        }

        return () => {
            if (audioElement) {
                audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
                document.removeEventListener('click', handleClick);
            }
        };
    }, [isLoaded, isPlaying]);

    return (
        <audio id="audio" loop>
            <source src={defaultSrc} />
        </audio>
    );
};
