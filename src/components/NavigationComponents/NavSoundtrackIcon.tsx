import NavIcon from "./NavIcon";
import {MUTE_SOUNDTRACK, UNMUTE_SOUNDTRACK} from "../../utils/constants/mouseOverConstants";
import React from "react";
import {useSoundtrack} from "../../hooks/useSoundtrack";
import { Box, BoxProps, useMediaQuery } from '@chakra-ui/react';
import { PiSpeakerSimpleSlashFill, PiSpeakerSimpleHighFill } from "react-icons/pi";
import colorPalette from "../../styles/colorPalette";
import MediaQueriesEnum from '../../utils/enums/mediaQueries';

export const NavSoundtrackIcon = (props: BoxProps) => {
    const { soundtrackData, playSoundtrack, pauseSoundtrack } = useSoundtrack();
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);


    const handleSoundtrackButton = () => {
        if (soundtrackData.isPlaying) {
            pauseSoundtrack();
        } else {
            playSoundtrack();
        }
    }
    return (
        <Box {...props} display={isDesktop ? "block" : "none"}>
            <NavIcon
                image={soundtrackData.isPlaying ?
                    <PiSpeakerSimpleHighFill
                        size={39}
                    /> :
                    <PiSpeakerSimpleSlashFill
                        color={colorPalette.closeButton}
                        size={39}
                    />}
                onClick={handleSoundtrackButton}
                size='small'
                isMap={false}
                mouseOver={soundtrackData.isPlaying ? MUTE_SOUNDTRACK : UNMUTE_SOUNDTRACK}
            />
        </Box>
    )
}