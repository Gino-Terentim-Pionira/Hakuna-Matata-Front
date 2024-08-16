import React, { FC } from 'react';

type VideoBackgroundProps = {
    source: string;
    handleLoading?: VoidFunction
}

const VideoBackground: FC<VideoBackgroundProps> = ({ source, handleLoading }) => {

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
            onLoadedData={()=>handleLoading ? handleLoading() : null}
        >
            <source src={source} type="video/webm" />
        </video>
    )
}

export default VideoBackground;
