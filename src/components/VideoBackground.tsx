import React, { FC } from 'react';

type VideoBackgroundProps = {
    source: string;
    isLoading: VoidFunction
}

const VideoBackground: FC<VideoBackgroundProps> = ({ source, isLoading }) => {

    return (
        <video
            id="background-video"
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
            onLoadedData={()=>isLoading()}
        >
            <source src={source} type="video/webm" />
        </video>
    )
}

export default VideoBackground;
