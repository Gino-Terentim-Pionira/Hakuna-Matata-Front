import React, { FC, useEffect } from 'react';

type VideoBackgroundProps = {
    source: string;
    isLoading: VoidFunction
}

const VideoBackground: FC<VideoBackgroundProps> = ({ source, isLoading }) => {

    useEffect(() => {
        const video = document.getElementById('background-video') as HTMLVideoElement;
        if (video) {
            const handleCanPlayThrough = () => {
                isLoading();
            };

            video.addEventListener('canplaythrough', handleCanPlayThrough);

            return () => {
                video.removeEventListener('canplaythrough', handleCanPlayThrough);
            };
        }
    }, [source]);

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
        >
            <source src={source} type="video/webm" />
        </video>
    )
}

export default VideoBackground;
