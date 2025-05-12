import { useEffect, useState } from 'react';

const useWindowSize = () => {
	const [width, setWidth] = useState(window.innerWidth);
	useEffect(() => {
		const handleResize = () => {
			setWidth(window.innerWidth);
		}
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		}
	}, []);

	const isDesktop = width > 767;
	return { width, isDesktop };
}

export { useWindowSize };