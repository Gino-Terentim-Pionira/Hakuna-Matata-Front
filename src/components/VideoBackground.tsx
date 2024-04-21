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
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: -1,
            }}
        >
            <source src={source} type="video/webm" />
        </video>
    )
}

export default VideoBackground;
