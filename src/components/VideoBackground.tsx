import React, { FC } from 'react';
import { webmOrMov } from '../utils/algorithms/webmToOther';

type VideoBackgroundProps = {
    source: string | undefined;
    handleLoading?: VoidFunction;
    position?: 'absolute' | '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | '-webkit-sticky' | 'fixed' | 'relative' | 'static' | 'sticky' | undefined;
	objectFit?: 'cover' | 'fill' | 'contain' | 'none';
}

const VideoBackground: FC<VideoBackgroundProps> = ({ source, handleLoading, position="absolute", objectFit = "fill" }) => {
    return source ? (
		<video
			id='background-video'
			autoPlay
			loop
			muted
			playsInline
			style={{
				position: position,
				width: '100%',
				height: '100dvh',
				objectFit: objectFit,
				zIndex: -3
			}}
			onLoadedData={() => (handleLoading ? handleLoading() : null)}
		>
			<source src={webmOrMov(source)} key={source} />
		</video>
	) : null;
}

export default VideoBackground;
