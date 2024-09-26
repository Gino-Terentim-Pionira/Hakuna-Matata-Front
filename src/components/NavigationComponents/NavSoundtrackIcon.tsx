import NavIcon from "./NavIcon";
import {MUTE_SOUNDTRACK, UNMUTE_SOUNDTRACK} from "../../utils/constants/mouseOverConstants";
import React from "react";
import {useSoundtrack} from "../../hooks/useSoundtrack";
import { Box, BoxProps } from "@chakra-ui/react";

export const NavSoundtrackIcon = (props: BoxProps) => {
    const { soundtrackData, playSoundtrack, pauseSoundtrack } = useSoundtrack();

    const handleSoundtrackButton = () => {
        if (soundtrackData.isPlaying) {
            pauseSoundtrack();
        } else {
            playSoundtrack();
        }
    }
    return (
        <Box {...props}>
            <NavIcon
                image={soundtrackData.isPlaying ? 'soundtrackUnmute' : 'soundtrackMute'}
                onClick={handleSoundtrackButton}
                size='small'
                isMap={false}
                mouseOver={soundtrackData.isPlaying ? MUTE_SOUNDTRACK : UNMUTE_SOUNDTRACK}
            />
        </Box>
    )
}