import React from 'react'
import { motion } from 'framer-motion'
import { Text } from '@chakra-ui/react';

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
						fontSize={{ base: '24px', md: '32px' }}
						fontWeight='semibold'
						textAlign='left'
						marginBottom={{ base: "24px", md: '2rem' }}
					>
						{word + (i !== words.length - 1 ? '\u00A0' : '')}
					</Text>
				</motion.div>
			</div>
		);
    })
}
