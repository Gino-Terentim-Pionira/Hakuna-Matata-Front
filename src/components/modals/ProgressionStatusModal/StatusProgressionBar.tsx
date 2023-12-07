import { Box, Flex, Center, Progress, Text, Image } from '@chakra-ui/react';
import React from 'react'
import fontTheme from '../../../styles/base';
import colorPalette from '../../../styles/colorPalette';
import icon_lock from '../../../assets/icons/icon_lock.svg'

const StatusProgressionBar = ({ status, label, isBlocked = false, isOnLeft, marginTop, color }: {
  status: number,
  label: string,
  color?: string,
  isBlocked?: boolean,
  isOnLeft?: boolean
  marginTop?: string
}) => {

  return (
    <Box fontFamily={fontTheme.fonts}>
      <Flex width='100%' flexDirection={isOnLeft ? 'row-reverse' : 'row'} justify='space-between' align='flex-end' mt={marginTop}>
        {
          isBlocked ?
            <>
              <Image width="20px" height="20px" src={icon_lock} />
              <Text fontSize='12px' color={colorPalette.textColor} >Bloqueado</Text>
            </>
            :
            <>
              <Text fontSize="20px">{label}</Text>
              <Text fontSize="12px" align="left" color={colorPalette.primaryColor}>{status}/100</Text>
            </>

        }
      </Flex>
      {
        isBlocked ?
          <Flex width="100%" height={{xl:"32px", lg: "32px", md: "28px", sm:"24px"}} justify={isOnLeft ? "flex-end" : "flex-start"} align="center" bg={colorPalette.grayBackground} padding="0 8px" borderRadius="md" mt="4px" border="1px" borderColor="rgba(0, 0, 0, 0.31)" >
            <Text color={colorPalette.textColor} fontSize={{xl: '10px', lg: '10px', md: '9px', sm: '9px'}}>Essa habilidade será desbloqueada ao explorar novos horizontes</Text>
          </Flex>
          :
          <Center borderRadius="md" padding="0 8px" mt="4px" width="100%" height={{xl:"32px", lg: "30px", md: "28px", sm:"24px"}} border="1px" borderColor="rgba(0, 0, 0, 0.31)">
            <Progress hasStripe colorScheme={color || "blue"} width="100%" height="16px" value={status} max={100} />
          </Center>

      }

    </Box>
  )
}

export default StatusProgressionBar;