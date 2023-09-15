import { Image } from '@chakra-ui/react';
import React from 'react';
import useIgnoranceFilter from '../hooks/useIgnoranceFilter';

interface IgnoranceFilter {
    ignoranceImage: string;
}

const IgnoranceFilter = ({ ignoranceImage }: IgnoranceFilter) => {
    const { isIgnoranceFilterOn } = useIgnoranceFilter()
    return (
        <>
            {isIgnoranceFilterOn &&
                <Image
                    src={ignoranceImage}
                    position='absolute'
                    h='100vh'
                    w='100%'
                    zIndex='-3'
                    left='0'
                    top='0'
                    background=" rgba(77, 77, 77, 0.35);"
                />
            }
        </>
    )
}

export default IgnoranceFilter;
