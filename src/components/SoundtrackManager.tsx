import { useLocation } from "react-router-dom";
import { useSoundtrack } from "../hooks/useSoundtrack";
import { useEffect } from "react";
import React from "react";
import {soundtrackEnum} from "../utils/enums/soundtrackEnums";

export const SoundtrackManager = () => {
    const location = useLocation();
    const { soundtrackData, setSoundtrackData } = useSoundtrack();
    const defaultSrc = soundtrackEnum[location.pathname];

    useEffect(() => {
        const handleCanPlayThrough = () => {
            setSoundtrackData({
                ...soundtrackData,
                isLoaded: true
            })
        };

        const audioElement = document.getElementById('audio');

        if (audioElement) {
            audioElement.addEventListener('canplaythrough', handleCanPlayThrough);
        }

        return () => {
            if (audioElement) {
                audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
            }
        };
    }, [soundtrackData]);

    return (
        <audio id="audio" loop>
            <source src={defaultSrc} />
        </audio>
    );
};
