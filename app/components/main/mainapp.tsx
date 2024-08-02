import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Nochannelselected from './main/nochannelselected'
import Header from './main/header'
import { useGlobalState } from '@/globalstate'
import MessagesBox from './main/messagesBox'
import FriendsComponent from './main/friendsComponent'
import MessageBoxUser from './main/messageBoxUser'
export default function mainapp() {

  const [isServerSelected, setIsServerSelected] = useGlobalState('isServerSelected')
  const [userMessagesMode, setMessagesMode] = useGlobalState('userMessagesMode')
  const [friendchatopen, setFriendChatOpen] = useGlobalState('friendchatopen')

  return (
    <Box w={'100%'} bg={'#313338'} height={'100%'}>

      {!isServerSelected && !userMessagesMode ? <>
        <Nochannelselected />

      </> : userMessagesMode && !friendchatopen ? <FriendsComponent /> : userMessagesMode && friendchatopen ? <> <Header /> <MessageBoxUser /></> : <>
        <Header />
        <MessagesBox />
      </>}

    </Box>
  )
}
