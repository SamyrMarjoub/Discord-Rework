import { useGlobalState } from '@/globalstate';
import { Box, Input, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaDiscord, FaHashtag } from 'react-icons/fa';
import { addDoc, collection, doc, getDocs, orderBy, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { db } from '@/db/firebase';

export default function messagesBox() {

    const [userData, setUserData] = useGlobalState('userData')
    const [ServerChannelsData, SetServerChannelsData] = useGlobalState('ServerChannelsData')
    const [ChannelSelectedId, SetChannelSelectedId] = useGlobalState('ChannelSelectedId')
    const [serverData, setServerData] = useGlobalState('defaultCurrency')
    const selectedChannel = ServerChannelsData.find(channel => channel.id === ChannelSelectedId);
    const [message, setMessage] = useState('')
    const [getMessages, setMessages] = useState([])


    const sendMessage = async (e: { key: string; preventDefault: () => void; }) => {

        if (e.key === 'Enter') {
            e.preventDefault()

            try {
                await addDoc(collection(db, 'mensagens'), {
                    messageId: `msg_${Date.now()}`, // Id da mensagem (pode usar uma biblioteca de geração de IDs únicos)
                    userId: userData?.uid, // Id do usuário
                    timestamp: Timestamp.now(), // Timestamp
                    serverId: serverData.id, // Id do servidor
                    chatId: selectedChannel.id, // Id do chat
                    content: message // Conteúdo da mensagem
                });
                setMessage('')
                fetchMessages(serverData.id, selectedChannel.id)
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    };

    const fetchMessages = async (serverId: unknown, chatId: unknown) => {
        try {
            // Cria a query para buscar mensagens do servidor e chat especificados
            const q = query(
                collection(db, 'mensagens'),
                where('serverId', '==', serverId),
                where('chatId', '==', chatId),
                orderBy('timestamp')
            );

            // Executa a query
            const querySnapshot = await getDocs(q);
            const fetchedMessages = querySnapshot.docs.map(doc => doc.data());

            // Atualiza o estado com as mensagens recuperadas
            setMessages(fetchedMessages);
            console.log(fetchedMessages)
        } catch (error) {
            console.error('Erro ao buscar as mensagens: ', error);
        }
    };

    useEffect(() => {
        // Busca as mensagens quando serverId e chatId mudam
        if (serverData && selectedChannel) {
            fetchMessages(serverData.id, selectedChannel.id);
        }
    }, [serverData, selectedChannel]);

    const scrollStyle = {
        '::-webkit-scrollbar': {
            width: '8px',
        },
        '::-webkit-scrollbar-track': {
            backgroundColor: '#2b2d31',
        },
        '::-webkit-scrollbar-thumb': {
            backgroundColor: '#1a1b1e',
            borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
        },
    };

    return (
        <Box
            height={["calc(100vh - 50px)"]}
            display="flex"
            flexDirection="column"
            overflow="hidden"
            width="100%"
        >
            <Box
                css={scrollStyle}
                flex="1"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"

                overflowY="auto"
                width="100%"
                p="4"
            >
                <Stack spacing="3">
                    {/* <Text color="gray.500">Mensagem 1</Text>
                    <Text color="gray.500">Mensagem 2</Text>
                    <Text color="gray.500">Mensagem 3</Text> */}

                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'80px'} bg='#383a40' height={'80px'} borderRadius={'80px'}>
                        <FaHashtag fontSize={'45px'} color='white' />
                    </Box>
                    <Text fontSize={'25px'} color={'white'} fontWeight={'800'}>Bem vindo(a) a {selectedChannel?.name}</Text>
                    <Text fontSize={'15px'} mt={'-5px'} color={'#96989D'}>Esse é o começo do canal {selectedChannel?.name}</Text>


                    {getMessages && getMessages.length > 0 && getMessages.map((e, index) => (
                        <Box w={'100%'} height={'auto'} minH={'55px'} display={'flex'} key={index}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'70px'} height={'55px'}>
                                <Box bg={userData?.bgIconColor} height={'40px'} width={'40px'} borderRadius={'40px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <FaDiscord fontSize={'25px'} color='white' />
                                </Box>
                            </Box>
                            <Box flex={'1'}>
                                <Box width={'100%'} display={'flex'} flexDir={'column'} height={'100%'}>
                                    <Text mt={'5px'} color={'white'} as={'span'}>{userData?.username}</Text>
                                    <Text mb={'-2px'} fontSize={'16px'} color={'#96989D'}>{e?.content}</Text>
                                </Box>
                            </Box>
                        </Box>
                    ))}



                    {/* Adicione mais mensagens aqui */}

                </Stack>
            </Box>
            <Box
                p="4"
                pt={'0px'}

            >
                <Input
                    bg="#383a40"
                    placeholder="Digite sua mensagem..."
                    size="lg"
                    border="none"
                    color="white" // Para que o texto seja visível em fundo escuro
                    onChange={((e) => setMessage(e.target.value))}
                    value={message}
                    onKeyDown={sendMessage}
                    required
                />
            </Box>
        </Box>
    )
}
