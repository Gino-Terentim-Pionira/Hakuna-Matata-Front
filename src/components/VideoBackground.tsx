import React, { FC } from 'react';
import { webmToOther } from '../utils/algorithms/webmToOther';

type VideoBackgroundProps = {
    source: string | undefined;
    handleLoading?: VoidFunction
}

const VideoBackground: FC<VideoBackgroundProps> = ({ source, handleLoading }) => {

    return (
        source ? (
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
                onLoadedData={() => handleLoading ? handleLoading() : null}
            >
                <source src={webmToOther(source, '.mov')} />
                <source src={source} type="video/webm" />
            </video>
        ) : null
    )
}

export default VideoBackground;
