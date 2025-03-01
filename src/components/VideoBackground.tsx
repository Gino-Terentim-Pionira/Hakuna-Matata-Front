import React, { FC } from 'react';
import "./styles/VideoBackground.css"

type VideoBackgroundProps = {
    source: string | null;
    handleLoading?: VoidFunction
}

const VideoBackground: FC<VideoBackgroundProps> = ({ source, handleLoading }) => {

    return (
        source ? (
            <video
                className="video_background_container"
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
                onLoadedData={() => handleLoading ? handleLoading() : null}
            >
                <source src={source} type="video/webm" />
            </video>
        ) : null
    )
}

export default VideoBackground;
