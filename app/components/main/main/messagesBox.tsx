import { useGlobalState } from '@/globalstate';
import { Box, Input, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaDiscord, FaHashtag } from 'react-icons/fa';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '@/db/firebase';
import { MdDelete, MdEdit } from 'react-icons/md';
import { onSnapshot } from 'firebase/firestore';

export default function messagesBox() {

    const [userData, setUserData] = useGlobalState('userData')
    const [ServerChannelsData, SetServerChannelsData] = useGlobalState('ServerChannelsData')
    const [ChannelSelectedId, SetChannelSelectedId] = useGlobalState('ChannelSelectedId')
    const [serverData, setServerData] = useGlobalState('defaultCurrency')
    const selectedChannel = ServerChannelsData.find(channel => channel.id === ChannelSelectedId);
    const [message, setMessage] = useState('')
    const [getMessages, setMessages] = useState([])
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [editMessageId, setEditMessageId] = useState(null);
    const [isEditingMessage, setIsEditingMessage] = useState(null)
    const [messageEdited, setMessageEdited] = useState('')

    const sendMessage = async (e: { key: string; preventDefault: () => void; }) => {

        if (e.key === 'Enter') {
            e.preventDefault()

            try {
                await addDoc(collection(db, 'mensagens'), {
                    messageId: `msg_${Date.now()}`,
                    userId: userData?.uid,
                    username: userData?.username,
                    bgIconColor: userData?.bgIconColor, // Adiciona a cor de fundo
                    timestamp: Timestamp.now(),
                    serverId: serverData.id,
                    chatId: selectedChannel.id,
                    content: message
                });


                setMessage('')
                fetchMessages(serverData.id, selectedChannel.id)
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    };
    const fetchMessages = (serverId: unknown, chatId: unknown) => {
        try {
            const q = query(
                collection(db, 'mensagens'),
                where('serverId', '==', serverId),
                where('chatId', '==', chatId),
                orderBy('timestamp')
            );
    
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedMessages = querySnapshot.docs.map(doc => doc.data());
                setMessages(fetchedMessages);
            });
    
            // Cleanup listener on component unmount
            return () => unsubscribe();
        } catch (error) {
            console.error('Erro ao buscar as mensagens: ', error);
        }
    };


    const deleteMessage = async (chatId: string | null, messageId: string) => {
        if (!chatId || !messageId) {
            console.error('chatId e messageId são necessários.');
            return;
        }

        try {
            const q = query(
                collection(db, 'mensagens'),
                where('chatId', '==', chatId),
                where('messageId', '==', messageId)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.error('Nenhuma mensagem encontrada com o messageId fornecido.');
                return;
            }

            querySnapshot.forEach(async (docSnapshot) => {
                const docRef = doc(db, 'mensagens', docSnapshot.id);
                await deleteDoc(docRef);
                console.log(`Mensagem com ID ${docSnapshot.id} deletada com sucesso.`);

                // Re-fetch the messages after deletion
                await fetchMessages(serverData.id, selectedChannel.id);
            });
        } catch (error) {
            console.error('Erro ao deletar a mensagem: ', error);
        }
    };

    // Use o useEffect para buscar mensagens quando serverData e selectedChannel mudam
    useEffect(() => {
        if (serverData && selectedChannel) {
            // Fetch messages with real-time listener
            const unsubscribe = fetchMessages(serverData.id, selectedChannel.id);
    
            // Cleanup listener on component unmount
            return () => unsubscribe();
        }
    }, [serverData, selectedChannel]);

    async function getMessageRefById(chatId: string, id: unknown) {
        const messagesRef = collection(db, 'mensagens');
        const q = query(messagesRef, where('id', '==', id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].ref;
        }
        throw new Error('Mensagem não encontrada.');
    }

    async function editMessage(chatId: never, id: null, newMessage: string) {
        try {
            const messageRef = await getMessageRefById(chatId, id);
            await updateDoc(messageRef, {
                message: newMessage,
                timestamp: serverTimestamp(),
                isEdited: true // Marcar a mensagem como editada

            });
        } catch (error) {
            console.error("Erro ao editar mensagem:", error);
        }
    }

    function handleKeyDown(chatId: any, event: React.KeyboardEvent<HTMLInputElement>, action: string) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent new line
            handleAction(chatId, action);
        }
    }

    function handleAction(chatId: { key: string; preventDefault: () => void; }, action: string) {
        if (chatId && action === 'post') {
            sendMessage(chatId, userData.uid, frienduserData.uid, message);
            setMessage('');
        } else if (chatId && action === 'edit') {
            editMessage(chatId, editMessageId, messageEdited);
            setIsEditingMessage('');
        } else {
            console.log('erro');
        }
    }

    function handleEditMessage(id: React.SetStateAction<null>, currentMessage: React.SetStateAction<string>, index: React.SetStateAction<null>) {
        setMessageEdited(currentMessage);
        setEditMessageId(id);
        setIsEditingMessage(index)

    }

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

                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'80px'} bg='#383a40' height={'80px'} borderRadius={'80px'}>
                        <FaHashtag fontSize={'45px'} color='white' />
                    </Box>
                    <Text fontSize={'25px'} color={'white'} fontWeight={'800'}>Bem vindo(a) a {selectedChannel?.name}</Text>
                    <Text fontSize={'15px'} mt={'-5px'} color={'#96989D'}>Esse é o começo do canal {selectedChannel?.name}</Text>


                    {getMessages && getMessages.length > 0 && getMessages.map((e, index) => (
                        <Box w={'100%'} height={'auto'} minH={'55px'} display={'flex'} key={index} onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)} _hover={{ 'bg': '#2b2d31' }}
                            transition={'0.1s all'}
                            alignItems={'center'}
                        >
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'70px'} height={'55px'}>
                                <Box bg={e?.bgIconColor || '#383a40'} height={'40px'} width={'40px'} borderRadius={'40px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <FaDiscord fontSize={'25px'} color='white' />
                                </Box>
                            </Box>
                            <Box flex={'1'}>
                                <Box width={'100%'} display={'flex'} flexDir={'column'} height={'100%'}>
                                    <Text color={'white'} as={'span'}>{e?.username}</Text>
                                    <Text mb={'-2px'} fontSize={'16px'} color={'#96989D'}>{e?.content}</Text>
                                </Box>
                            </Box>
                            {hoveredIndex === index && !isEditingMessage && (
                                <>
                                    <MdDelete
                                        cursor={'pointer'}
                                        color='#96989D'
                                        onClick={() => deleteMessage(e.chatId, e.messageId)}
                                        fontSize={'20px'}
                                        style={{ 'marginRight': '10px' }}
                                    />
                                    <MdEdit
                                        style={{ 'marginRight': '10px' }}
                                        onClick={() => handleEditMessage(e.messageId, e.content, index)}
                                        cursor={'pointer'}
                                        color='#96989D'
                                        fontSize={'20px'}
                                    />
                                </>
                            )}
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
