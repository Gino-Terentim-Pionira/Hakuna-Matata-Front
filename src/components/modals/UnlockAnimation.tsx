import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import colorPalette from '../../styles/colorPalette';
import { useSoundtrack } from "../../hooks/useSoundtrack";

const UnlockAnimation = (
    {
        isOpen,
        onClose,
        animation
    }: {
        isOpen: boolean,
        onClose: VoidFunction,
        animation: string
    },
) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { pauseSoundtrack } = useSoundtrack();

    useEffect(() => {
        if (isOpen && videoRef.current) {
            pauseSoundtrack();
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        } else if (!isOpen && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isOpen, animation]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                        background: 'linear-gradient(180deg, rgba(74, 74, 74, 0.95) 66%, rgba(140, 140, 140, 0.92) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box alignSelf='flex-end' onClick={onClose} cursor="pointer">
                        <IoClose size='72' color={colorPalette.closeButton} />
                    </Box>
                    <Box alignSelf='center' justifySelf='center'>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            width='1000px'
                            onEnded={onClose}
                        >
                            <source key={animation} src={animation} type="video/webm" />
                        </video>
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default UnlockAnimation;
