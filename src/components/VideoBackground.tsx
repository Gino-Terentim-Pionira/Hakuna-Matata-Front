import React, { FC } from 'react';
import { webmToOther } from '../utils/algorithms/webmToOther';
import "./styles/VideoBackground.css"

type VideoBackgroundProps = {
    source: string | undefined;
    handleLoading?: VoidFunction;
    className?: string;
}

const VideoBackground: FC<VideoBackgroundProps> = ({ source, handleLoading, className }) => {

    return source ? (
		<video
			className={className ?? 'video_background_container'}
			id='background-video'
			autoPlay
			loop
			muted
			playsInline
			style={{
				position: 'absolute',
				width: '100%',
				height: '100vh',
				objectFit: 'fill',
				zIndex: -3
			}}
			onLoadedData={() => (handleLoading ? handleLoading() : null)}
		>
			<source src={webmToOther(source, '.mov')} key={webmToOther(source, '.mov')} />
			<source src={source} type="video/webm" key={source} />
		</video>
	) : null;
}

export default VideoBackground;
