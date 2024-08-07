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
                    content: message,
                    createdAt:Timestamp.now()
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
                orderBy('createdAt')
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


    const deleteMessage = async (chatId: string | null, messageId: string, messageUserId: string) => {
        if (!chatId || !messageId) {
            console.error('chatId e messageId são necessários.');
            return;
        }
    
        // Verifica se o usuário atual é o proprietário da mensagem
        if (messageUserId !== userData?.uid) {
            console.error('Você não tem permissão para deletar esta mensagem.');
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
    
                // Atualiza as mensagens após a exclusão
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
        const q = query(messagesRef, where('messageId', '==', id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].ref;
        }
        throw new Error('Mensagem não encontrada.');
    }

    async function editMessage(chatId: never, editMessageId: null, newMessage: string) {
        try {
            const messageRef = await getMessageRefById(chatId, editMessageId);
            await updateDoc(messageRef, {
                content: newMessage,
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
            sendMessage(chatId);
            setMessage('');
        } else if (chatId && action === 'edit') {
            editMessage(chatId, editMessageId, messageEdited);
            setIsEditingMessage(null);
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

    const formatTimestamp = (timestamp: { seconds: number; }) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();

        const dayDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (dayDiff === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (dayDiff === 1) {
            return `Ontem, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) +
                ` ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    };
    return (
        (
            <Box height={["calc(100vh - 50px)"]} display="flex" flexDirection="column" overflow="hidden" width="100%">
                <Box css={scrollStyle} flex="1" display="flex" flexDirection="column" justifyContent="flex-end" overflowY="auto" width="100%" p="4">
                <Stack spacing="3">
                    {getMessages.map((msg, index) => (
                        <Box
                            w={'100%'}
                            height={'auto'}
                            minH={'55px'}
                            display={'flex'}
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            _hover={{ 'bg': '#2b2d31' }}
                            alignItems={'center'}
                            transition={'0.1s all'}
                            bg={isEditingMessage === index ? '#2b2d31' : 'transparent'}
                        >
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'70px'} height={'55px'}>
                                <Box
                                    bg={msg.bgIconColor}
                                    height={'40px'}
                                    width={'40px'}
                                    borderRadius={'40px'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    mb={'3px'}
                                >
                                    <FaDiscord fontSize={'25px'} color='white' />
                                </Box>
                            </Box>
                            <Box flex={'1'} height={'100%'}>
                                <Box width={'100%'} display={'flex'} flexDir={'column'} justifyItems={'center'} height={'100%'}>
                                    <Text color={'white'} as={'span'}>
                                        {msg.username}
                                        <Text ml={'10px'} as={'span'} fontSize={'14px'} color={'#96989D'}>
                                            {formatTimestamp(msg.timestamp)}
                                        </Text>
                                    </Text>

                                    {isEditingMessage === index ? (
                                        <Box height={'60px'}>
                                            <Input padding={'0px'} _focusVisible={{ 'border': 'none' }} outline={'none'} color={'white'} bg='#2b2d31' border={'none'} onChange={(e) => setMessageEdited(e.target.value)} value={messageEdited} onKeyDown={(event) => handleKeyDown(msg.chatId, event, 'edit')} />
                                            <Stack flexDir={'row'}>
                                                <Text cursor={'pointer'} fontSize={'11px'} color={'white'} onClick={() => [setHoveredIndex(null), console.log(hoveredIndex), setIsEditingMessage(false)]}>Cancelar</Text>
                                                <Text cursor={'pointer'} fontSize={'11px'} onClick={(event) => handleAction(msg.chatId, 'edit')} color={'#00AFF4'}>Enviar</Text>
                                            </Stack>


                                        </Box>
                                    ) : (
                                        <>
                                            <Text mb={'-2px'} fontSize={'16px'} color={'#96989D'}>
                                                {msg.content}
                                                {msg.isEdited && <Text as="span" fontSize={'11px'} color={'#00AFF4'}> (editado)</Text>}

                                            </Text>
                                        </>
                                    )}

                                </Box>
                            </Box>
                            {hoveredIndex === index && !isEditingMessage  && msg.userId === userData?.uid && (
                                <>
                                    <MdDelete
                                        cursor={'pointer'}
                                        color='#96989D'
                                        onClick={() => deleteMessage(msg.chatId, msg.messageId, msg.userId)}
                                        fontSize={'20px'}
                                        style={{ 'marginRight': '10px' }}
                                    />
                                    <MdEdit
                                        style={{ 'marginRight': '10px' }}
                                        onClick={() => handleEditMessage(msg.messageId, msg.content, index)}
                                        cursor={'pointer'}
                                        color='#96989D'
                                        fontSize={'20px'}
                                    />
                                </>
                            )}

                        </Box>
                    ))}
                </Stack>
                </Box>
                <Box p="4" pt={'0px'}>
                    <Input
                        bg="#383a40"
                        placeholder="Digite sua mensagem..."
                        size="lg"
                        border="none"
                        color="white"
                        onChange={((e) => setMessage(e.target.value))}
                        value={message}
                        onKeyDown={sendMessage}
                        required
                    />
                </Box>
            </Box>
        ))
    }

