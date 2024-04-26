import React, { FC } from 'react';

type VideoBackgroundProps = {
    source: string;
}

const VideoBackground: FC<VideoBackgroundProps> = ({ source }) => {
    return (
        <video
            autoPlay
            loop
            muted
            playsInline
            style={{
                position: "fixed",
                width: "100%",
                height: "100vh",
                objectFit: "fill",
                zIndex: -3,
            }}
        >
            <source src={source} type="video/webm" />
        </video>
    )
}

export default VideoBackground;
