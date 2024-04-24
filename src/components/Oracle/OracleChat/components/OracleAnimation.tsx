import React, { useState, useEffect, useRef } from 'react';
import { IOracle } from '../../../../services/OracleServices';

function OracleAnimation({
    oracleObject,
    isTalking,
    onEnd
}: {
    oracleObject: Partial<IOracle>,
    isTalking: boolean,
    onEnd: VoidFunction
}) {
    const [opacityTalking, setOpacityTalking] = useState(0);
    const [opacityIdle, setOpacityIdle] = useState(1);
    const talkingRef = useRef<HTMLVideoElement>(null);
    const idleRef = useRef<HTMLVideoElement>(null);

    const playVideoFromStart = (videoRef: React.RefObject<HTMLVideoElement>) => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    };

    useEffect(() => {
        const targetRef = isTalking ? talkingRef : idleRef;

        setOpacityTalking(isTalking ? 1 : 0);
        setOpacityIdle(isTalking ? 0 : 1);

        playVideoFromStart(targetRef);
    }, [isTalking]);

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: "50%",
        height: "80%",
        minWidth: "320px",
        maxWidth: "537px",
        minHeight: "485px",
        maxHeight: "800px",
        overflow: 'hidden'
    };

    const videoStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    };

    return (
        <div style={containerStyle}>
            <video
                ref={idleRef}
                autoPlay
                loop
                muted
                playsInline
                style={{ ...videoStyle, opacity: opacityIdle }}
            >
                <source src={oracleObject.sprite_idle} type="video/webm" />
            </video>
            <video
                ref={talkingRef}
                autoPlay
                muted
                playsInline
                style={{ ...videoStyle, opacity: opacityTalking }}
                onEnded={onEnd}
            >
                <source src={oracleObject.sprite_talking} type="video/webm" />
            </video>
        </div>
    );
}

export default OracleAnimation;
