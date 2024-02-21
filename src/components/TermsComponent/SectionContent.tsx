import React, { PropsWithChildren, FC } from 'react';
import { Text } from '@chakra-ui/react';
import fontTheme from '../../styles/base';

const SectionContent: FC<PropsWithChildren<Record<string, unknown>>> = ({children}) => {
    return (
        <Text
            fontFamily={fontTheme.fonts}
            fontSize='16px'
            textAlign='justify'
            marginBottom='10px'
        >
            {children}
        </Text>
    );
}

export default SectionContent;