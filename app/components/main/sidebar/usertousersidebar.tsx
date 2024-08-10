import React, { useEffect, useState } from 'react';
import { Box, Input, Text } from '@chakra-ui/react';
import { IoAddSharp } from 'react-icons/io5';
import { FaDiscord, FaUserFriends } from "react-icons/fa";
import { db } from '@/db/firebase';
import { setGlobalState, useGlobalState } from '@/globalstate';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ChatInterface = () => {
  const [userData] = useGlobalState('userData');
  const [userMessagesMode] = useGlobalState('userMessagesMode');
  const [chatsNumberMessageNotRead, setChatsNumberMessageNotRead] = useGlobalState('chatsNumberMessageNotRead');
  const [totalNumberMessageNotRead] = useGlobalState('totalNumberMessageNotRead');
  const [amigos, setAmigos] = useState([]);

  useEffect(() => {
    async function fetchAmigosData() {
      const amigosData = [];
      const amigosCollection = collection(db, "usuarios"); // Coleção de usuários

      if (userData.friends) {
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
        console.log('Dados dos amigos:', amigosData);
      } else {
        console.log('Sem amigos');
      }
    }

    fetchAmigosData();
  }, [userData.friends]);

  useEffect(() => {
    console.log('Modo de mensagens do usuário:', userMessagesMode);
  }, [userMessagesMode]);

  useEffect(() => {
    console.log('chatsNumberMessageNotRead:', chatsNumberMessageNotRead);
  }, [chatsNumberMessageNotRead]);

  function AmigosComponent() {
    return (
      <Box mt={'10px'} borderRadius={'5px'} width="100%" height="40px" backgroundColor="rgba(255, 255, 255, 0.08)">
        <Box width="100%" height="100%" display="flex" alignItems="center">
          <FaUserFriends style={{ marginLeft: '10px' }} color="white" fontSize="20px" />
          <Text ml="20px" color="white">Amigos</Text>
        </Box>
      </Box>
    );
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

        {amigos.length === 0 ? (
          [...Array(5)].map((_, index) => renderBoxes(index))
        ) : (
          amigos.map((request, index) => {
            const userUID = String(userData.uid); 
            const friendUID = String(request.uid); 

            // Construindo a chave do chat
            const possibleKeys = [`${userUID}_${friendUID}`, `${friendUID}_${userUID}`];
            const messageCount = chatsNumberMessageNotRead[possibleKeys[0]] || chatsNumberMessageNotRead[possibleKeys[1]];

            return (
              <Box
                onClick={() => {
                  setGlobalState('friendchatopen', true);
                  setGlobalState('chatfriendopenuid', request.uid);

                  // Atualizando o contador de mensagens não lidas
                  setChatsNumberMessageNotRead((prev) => ({
                    ...prev,
                    [possibleKeys[0]]: 0,
                    [possibleKeys[1]]: 0,
                  }));
                }}
                cursor={'pointer'}
                _hover={{ 'bg': '#0000001a' }}
                transition={'all 0.2s'}
                width="100%"
                key={index}
                p='10px'
                display="flex"
                alignItems="center"
                mb="10px"
              >
                <Box
                  display={'flex'}
                  justifyContent='center'
                  alignItems={'center'}
                  mr="10px"
                  width="30px"
                  height="30px"
                  borderRadius="30px"
                  bg={request.bgIconColor}
                  position="relative"
                >
                  <FaDiscord color='white' fontSize={'17px'} />
                  {messageCount > 0 && (
                    <Box
                      width={'15px'}
                      height={'15px'}
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      position={'absolute'}
                      right={'-2px'}
                      rounded={'15px'}
                      bottom={'-2px'}
                      bg={'red'}
                      color={'white'}
                    >
                      <Text color={'white'} fontSize={'13px'} fontWeight={'700'}>
                        {messageCount}
                      </Text>
                    </Box>
                  )}
                </Box>
                <Box flex="1" mr="10px">
                  <Text color="white">{request.username}</Text>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default ChatInterface;
