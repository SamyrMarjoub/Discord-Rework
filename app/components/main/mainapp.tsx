import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Nochannelselected from './main/nochannelselected'
import Header from './main/header'
import { useState } from 'react'
import { useGlobalState } from '@/globalstate'
import MessagesBox from './main/messagesBox'
export default function mainapp() {

  const [isServerSelected, setIsServerSelected] = useGlobalState('isServerSelected')

  return (
    <Box w={'100%'} bg={'#313338'} height={'100%'}>

      {!isServerSelected ? <>
        <Nochannelselected />

      </> : <>
        <Header />
        <MessagesBox />
      </>}

    </Box>
  )
}
