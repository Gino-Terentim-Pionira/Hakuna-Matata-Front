import React, { FC } from 'react';
import { webmToOther } from '../utils/algorithms/webmToOther';
import "./styles/VideoBackground.css"
import { useMediaQuery } from '@chakra-ui/react';
import MediaQueriesEnum from '../utils/enums/mediaQueries';

type VideoBackgroundProps = {
    source: string | undefined;
    handleLoading?: VoidFunction;
    position?: 'absolute' | '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | '-webkit-sticky' | 'fixed' | 'relative' | 'static' | 'sticky' | undefined;
	className?: string;
}

const VideoBackground: FC<VideoBackgroundProps> = ({ source, handleLoading, position="absolute", className }) => {
	const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    return source ? (
		<video
			className={className}
			id='background-video'
			autoPlay
			loop
			muted
			playsInline
			style={{
				position: position,
				width: '100%',
				height: '100vh',
				objectFit: isDesktop ? 'fill' : 'cover',
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
