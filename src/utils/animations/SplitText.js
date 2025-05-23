import React from 'react'
import { motion } from 'framer-motion'
import { Text } from '@chakra-ui/react';

export function SplitText({ children, ...rest }) {
    let words = children.split(' ')
    return words.map((word, i) => {
        return (
            <div
                key={children + i}
                style={{ display: 'inline-block', overflow: 'hidden' }}
            >
                <motion.div
                    {...rest}
                    style={{ display: 'inline-block', willChange: 'transform' }}
                    custom={i}
                >
                    <Text
                        fontSize={{base: "16px", md: "20px"}}
                    >
                        {word + (i !== words.length - 1 ? '\u00A0' : '')}
                    </Text>
                </motion.div>
            </div>
        )
    })
}
