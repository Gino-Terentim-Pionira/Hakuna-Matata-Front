import React, { PropsWithChildren, FC } from 'react';
import { Text } from '@chakra-ui/react';
import fontTheme from '../../../../styles/base';

const SectionTitle: FC<PropsWithChildren<Record<string, unknown>>> = ({children}) => {
    return (
        <Text
            fontFamily={fontTheme.fonts}
            fontWeight='bold'
            fontSize='20px'
            marginBottom='10px'
        >
            {children}
        </Text>
    );
}

export default SectionTitle;