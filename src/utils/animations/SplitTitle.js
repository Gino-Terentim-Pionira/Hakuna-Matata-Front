import React from 'react'
import { motion } from 'framer-motion'
import { Text } from '@chakra-ui/react';
import "./styles/SplitTitle.css";

export function SplitTitle({ children, ...rest }) {
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
                        className="split_title_text"
                        fontSize={['1rem', '1.5rem', '1.8rem']}
                        fontWeight='semibold'
                        textAlign='left'
                        marginBottom='2rem'
                    >
                        {word + (i !== words.length - 1 ? '\u00A0' : '')}
                    </Text>
                </motion.div>
            </div>
        )
    })
}
