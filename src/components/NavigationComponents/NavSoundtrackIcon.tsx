import NavIcon from "./NavIcon";
import {MUTE_SOUNDTRACK, UNMUTE_SOUNDTRACK} from "../../utils/constants/mouseOverConstants";
import React, {useState} from "react";
import {useSoundtrack} from "../../hooks/useSoundtrack";
import { Box, BoxProps } from "@chakra-ui/react";

export const NavSoundtrackIcon = (props: BoxProps) => {
    const isSoundtrackMuted = localStorage.getItem("isSoundtrackMuted");
    const [isAudioMuted, setIsAudioMuted] = useState(isSoundtrackMuted === "true");
    const { muteSoundtrack, unmuteSoundtrack, audio, soundtrackData } = useSoundtrack();

    const handleSoundtrackButton = () => {
        if (audio.volume > 0) {
            muteSoundtrack(() => setIsAudioMuted(true));
        } else {
            unmuteSoundtrack(() => setIsAudioMuted(false));
        }
    }
    return (
        soundtrackData.isPlaying ?
        <Box {...props}>
            <NavIcon
                image={isAudioMuted ? 'soundtrackUnmute' : 'soundtrackMute'}
                onClick={handleSoundtrackButton}
                size='small'
                isMap={false}
                mouseOver={isAudioMuted ? UNMUTE_SOUNDTRACK : MUTE_SOUNDTRACK}
            />
        </Box> : <></>
    )
}