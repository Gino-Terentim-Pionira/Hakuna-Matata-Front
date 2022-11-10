import React from 'react';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/progress';

// Styles
import font from '../styles/base';
import colorPalette from '../styles/colorPalette';

const IgnoranceProgress = ({ ignorance, size, marginTop, fontSize, position }: {
    position: string;
    ignorance: number;
    size: string;
    marginTop: string;
    fontSize: string
}) => {
    return (
        <>
            <CircularProgress value={ignorance} min={0} max={100} bgPosition={position} mt={marginTop} size={size} color={colorPalette.ignorancePurple} thickness='5.5px' >
                <CircularProgressLabel fontFamily={font.fonts} fontWeight='semibold' color={colorPalette.ignorancePurple} fontSize={fontSize}>
                    {Math.trunc(ignorance)}%
                </CircularProgressLabel>
            </CircularProgress>
        </>
    );
}

export default IgnoranceProgress;