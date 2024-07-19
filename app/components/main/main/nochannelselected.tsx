import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import noChatSelected from '@/public/noChatSelected.svg'
import Image from 'next/image'

export default function nochannelselected() {
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'}height="100vh" bg={'#202225'}>

      <Box display={'flex'} justifyContent={'center'} flexDir={'column'} alignItems={'center'}>
        <Image  src={noChatSelected} alt={''} />

        <Box width={'400px'} >
          <Text mt={'10px'} mb={'10px'} textAlign={'center'} fontWeight={'800'} fontSize={'18px'} color={'#B9BBBE'}>SEM CANAIS DE TEXTO
          </Text>
          <Text textAlign={'center'} color={'#A3A6AA'}>Você se vê em um lugar estranho. Você não tem acesso a nenhum canal de texto, ou não há nenhum neste servidor </Text>
        </Box>
      </Box>

    </Box>
  )
}
