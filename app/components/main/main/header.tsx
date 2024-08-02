import { useGlobalState } from '@/globalstate'
import { Box, Input, InputGroup, InputLeftElement, InputRightElement, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaHashtag, FaSearch, FaUserFriends, FaDiscord } from 'react-icons/fa'


export default function header() {

  const [ServerData, SetServerData] = useGlobalState('defaultCurrency')
  const [ServerChannelsData, SetServerChannelsData] = useGlobalState('ServerChannelsData')
  const [ChannelSelectedId, SetChannelSelectedId] = useGlobalState('ChannelSelectedId')
  const [frienduserData, setFriendUserData] = useGlobalState('friendChatUserData')
  const [isFriendChatOpen, setIsFriendChatOpen] = useGlobalState('friendchatopen')
  const selectedChannel = ServerChannelsData.find(channel => channel.id === ChannelSelectedId);

  useEffect(() => {
    console.log(ServerData)
  }, [])

  return (
    <Box display={'flex'} justifyContent={'center'} width={'100%'} height={'50px'} borderBottom={'1px solid #202225'} bg={'#313338'}>
      <Box justifyContent={'space-between'} display={'flex'} width={'98%'} height={'100%'}>
        <Box>
          <Box alignItems={'center'} height={'100%'} display={'flex'}>
            {ServerChannelsData.length > 0 && selectedChannel && !isFriendChatOpen ? (
              <>
                <FaHashtag fontSize={'18px'} color='#96989D' />
                <Text ml={'7px'} color={'white'}>{selectedChannel?.name}</Text>

              </>
            ) : (
              <>
                <Box width={'35px'} height={'35px'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderRadius={'35px'} bg={frienduserData?.bgIconColor} >
                  <FaDiscord fontSize={'20px'} color='white' />
                </Box>
                <Text ml={'7px'} color={'white'}>{frienduserData?.username}</Text>

              </>
            )}

          </Box>
        </Box>
        <Box display={'flex'} alignItems={'center'}>
          <FaUserFriends style={{ marginRight: '15px' }} fontSize={'26px'} color='rgb(220, 221, 222)' />

          <InputGroup display={'flex'} alignItems={'center'} h={'100%'}>

            <Input type='text' _placeholder={{ fontSize: '13px' }} fontSize={'13px'} bg={'#1e1f22'} width={'150px'} height={'28px'} placeholder='Buscar' border={'none'} />
            <InputRightElement pointerEvents='none'>
              <FaSearch style={{ marginTop: '9px' }} fontSize={'13px'} color='#96989D' />

            </InputRightElement>

          </InputGroup>
        </Box>

      </Box>
    </Box>
  )
}
