import React, { useEffect, useState } from 'react';
import { Box, Input, Text } from '@chakra-ui/react';
import { IoAddSharp, IoChatbubbleSharp } from 'react-icons/io5';
import { FaDiscord, FaUserFriends } from "react-icons/fa";
import { db } from '@/db/firebase';
import { setGlobalState, useGlobalState } from '@/globalstate';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ChatInterface = () => {
  const [userData, setUserData] = useGlobalState('userData');

  const [amigos, setAmigos] = useState([]);

  useEffect(() => {
    async function fetchAmigosData() {
      const amigosData = [];
      const amigosCollection = collection(db, "usuarios"); // Coleção de usuários

      for (const uid of userData.friends) {
        const q = query(amigosCollection, where("uid", "==", uid)); // Consulta para o campo 'uid'

        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            amigosData.push({ id: doc.id, ...doc.data() }); // Adiciona o ID do documento e os dados
          });
        } catch (error) {
          console.error("Erro ao obter dados do usuário:", error);
        }
      }

      setAmigos(amigosData);
      console.log(amigosData)
    }

    fetchAmigosData();
  }, []);



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
        {amigos.length === 0 ? <>
          {[...Array(5)].map((_, index) => renderBoxes(index))}

        </> : <>
          {amigos.map((request, index) => (
            <Box onClick={() => { setGlobalState('friendchatopen', true), setGlobalState('chatfriendopenuid', request.uid) }} cursor={'pointer'} _hover={{ 'bg': '#0000001a' }} transition={'all 0.2s'}
              width="100%" key={index} p='10px' display="flex" alignItems="center" mb="10px">
              <Box display={'flex'} justifyContent='center' alignItems={'center'} mr="10px"
                width="30px" height="30px" borderRadius="30px" bg={request.bgIconColor}>
                <FaDiscord color='white' fontSize={'17px'} />

              </Box>
              <Box flex="1" mr="10px">
                <Text color="white">{request.username}</Text>
              </Box>
              {/* <Box width="90px">
                <Box justifyContent="flex-end" display="flex">
                  <Box display="flex" justifyContent="center" alignItems="center" width="40px" height="40px" borderRadius="40px" bg="#202225">
                    <IoChatbubbleSharp fontSize="20px" color="white" />
                  </Box>

                </Box>
              </Box> */}
            </Box>
          ))}
        </>}
      </Box>
    </Box>
  );
};

export default ChatInterface;

