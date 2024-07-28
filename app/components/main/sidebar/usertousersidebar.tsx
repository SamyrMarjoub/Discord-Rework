import React from 'react';
import { Box, Input, Text } from '@chakra-ui/react';
import { IoAddSharp } from 'react-icons/io5';
import { FaUserFriends } from "react-icons/fa";

const ChatInterface = () => {

  function AmigosComponent() {
    return (
      <Box mt={'10px'} borderRadius={'5px'} width="100%" height="40px" backgroundColor="rgba(255, 255, 255, 0.08)">
        <Box width="100%" height="100%" display="flex" alignItems="center">
          <FaUserFriends style={{ marginLeft: '10px' }} color="white" fontSize="20px" />
          <Text ml="20px" color="white">Amigos</Text>
        </Box>
      </Box>

    )
  }


  const renderBoxes = (index) => {
    const initialTransparency = 0.1; // Initial transparency
    const transparencyStep = 0.1; // Transparency step for each subsequent box
    const transparency = Math.min(initialTransparency + transparencyStep * index, 0.1); // Ensure transparency doesn't exceed 90%
    const bgColor = `rgba(150, 152, 157, ${transparency})`;

    return (
      <Box key={index} mt={'20px'} display={'flex'} width={'95%'} justifyContent={'space-between'}>
        <Box mr={'10px'} width={'25px'} height={'25px'} borderRadius={'25px'} bg={bgColor}></Box>
        <Box borderRadius={'20px'} flex={'1'} bg={bgColor} h="full"></Box>
      </Box>
    );
  };

  return (
    <Box width={'100%'} height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <Box display={'flex'} flexDir={'column'} alignItems={'center'} width={'95%'} height={'98%'}>
        
        <Box width={'100%'}>
          <Input
            width={'100%'}
            height={'32px'}
            fontSize={'13px'}
            color={'white'}
            placeholder='Encontre ou começe uma conversa'
            border={'none'}
            bg='#202225'
          />
        </Box>
        <AmigosComponent />

        <Box mt={'10px'} display={'flex'} width={'95%'} justifyContent={'space-between'}>
          <Text color={'#96989D'} fontWeight={'700'} fontSize={'11px'}>MENSAGENS DIRETAS</Text>
          <IoAddSharp fontWeight={'700'} color='white' fontSize={'15px'} />
        </Box>

        {/* Render the box sets 5 times */}
        {[...Array(5)].map((_, index) => renderBoxes(index))}
      </Box>
    </Box>
  );
};

export default ChatInterface;
