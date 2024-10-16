import { db } from '@/db/firebase';
import { setGlobalState, useGlobalState } from '@/globalstate';
import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { collection, doc, setDoc, updateDoc, query, orderBy, where, getDocs, serverTimestamp, onSnapshot, writeBatch, getDoc, deleteDoc, increment } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { MdDelete, MdEdit } from "react-icons/md";
import randomId from 'random-id'
import { useRef } from 'react';

export default function MessageBoxUser() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [friendtargetUid, setTargetUid] = useGlobalState('chatfriendopenuid');
    const [frienduserData, setFriendUserData] = useGlobalState('friendChatUserData');
    const [userData, setUserData] = useGlobalState('userData');
    const [chatId, setChatId] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [editMessageId, setEditMessageId] = useState(null);
    const [isEditingMessage, setIsEditingMessage] = useState(null)
    const [messageEdited, setMessageEdited] = useState('')
    const [unreadMessages, setUnreadMessages] = useState({});
    const [friendchatOpen, setFriendchatopen] = useGlobalState('friendchatopen')
    const [userMessagesMode, setUserMessageMode] = useGlobalState('userMessagesMode')

    const pattern = 'A0f'
    const len = 10

    useEffect(() => {
        async function fetchFriendData() {
            const uid = friendtargetUid;
            const amigosCollection = collection(db, "usuarios");
            const q = query(amigosCollection, where("uid", "==", uid));

            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const usuarioData = querySnapshot.docs[0].data();
                    setGlobalState('friendChatUserData', usuarioData);
                } else {
                    console.log("Nenhum usuário encontrado com o UID especificado.");
                }
            } catch (error) {
                console.error("Erro ao obter dados do usuário:", error);
            }
        }

        fetchFriendData();
    }, [friendtargetUid]);


    useEffect(() => {
        let unsubscribe;
        let isMounted = true; // Track if the component is mounted

        async function loadChat() {
            if (!userData?.uid || !frienduserData?.uid) return;

            const chatId = await getOrCreateChat();
            setChatId(chatId);

            const messagesRef = collection(db, 'chatsUsuariosFilho', chatId, 'mensagensUserParUser');
            const q = query(messagesRef, orderBy('originalTimestamp', 'asc'));

            if (userMessagesMode) {
                // Listen for real-time updates
                unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const messagesList = querySnapshot.docs.map(doc => doc.data());
                    if (isMounted) { // Check if component is still mounted
                        setMessages(messagesList);
                        // updateUnreadMessages(messagesList);
                        markMessagesAsRead(chatId, messagesList);
                    }
                });
            } else {
                console.log('null');
            }
        }

        loadChat();

        // Clean up the listener on unmount
        return () => {
            isMounted = false; // Mark the component as unmounted
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [userData, frienduserData, userMessagesMode]);




    async function getOrCreateChat() {
        const userId1 = userData.uid;
        const userId2 = frienduserData.uid;

        const combinedId = userId1 > userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
        const chatRef = doc(db, 'chatsUsuariosFilho', combinedId);

        const chatSnapshot = await getDoc(chatRef);

        if (chatSnapshot.exists()) {
            return chatRef.id;
        }

        const batch = writeBatch(db);
        const id = randomId(7, pattern);

        batch.set(chatRef, {
            id: id,
            user1: userId1,
            user2: userId2,
            lastMessage: '',
            timestamp: serverTimestamp(),

        });

        const user1ChatRef = doc(collection(db, 'chatsUsuariosPai', userId1, 'chatsUsuariosFilho'), combinedId);
        const user2ChatRef = doc(collection(db, 'chatsUsuariosPai', userId2, 'chatsUsuariosFilho'), combinedId);
        batch.set(user1ChatRef, { chatRef });
        batch.set(user2ChatRef, { chatRef });

        await batch.commit();

        return chatRef.id;
    }


    async function sendMessage(chatId: string, senderId: any, receiverId: any, message: string) {

        if (message.trim() === '') return; // Não enviar mensagem vazia

        const id = randomId(len, pattern)

        const messageRef = doc(collection(db, 'chatsUsuariosFilho', chatId, 'mensagensUserParUser'));
        // Verificar se a mensagem está sendo editada
        const docSnapshot = editMessageId ? await getDoc(messageRef) : null;
        const originalTimestamp = docSnapshot?.exists() ? docSnapshot.data().originalTimestamp : serverTimestamp();
        // const isEdited = editMessageId ? true : false;

        await setDoc(messageRef, {
            id: id,
            sender: senderId,
            receiver: receiverId,
            message: message,
            timestamp: serverTimestamp(),
            originalTimestamp: originalTimestamp,
            isEdited: false, // Mensagem nova não é editada,            
            isRead: false, // Mensagem nova não é lida,


        });

        const chatRef = doc(db, 'chatsUsuariosFilho', chatId);
        await updateDoc(chatRef, {
            lastMessage: message,
            timestamp: serverTimestamp()
        });


    }
    async function getMessageRefById(chatId: string, id: unknown) {
        const messagesRef = collection(db, 'chatsUsuariosFilho', chatId, 'mensagensUserParUser');
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

    async function deleteMessage(chatId: string | null, messageId: unknown) {
        try {
            // Referência à coleção de mensagens
            const messagesRef = collection(db, 'chatsUsuariosFilho', chatId, 'mensagensUserParUser');

            // Query para encontrar o documento com o id especificado
            const q = query(messagesRef, where('id', '==', messageId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log('Nenhuma mensagem encontrada com o ID especificado.');
                return;
            }

            // Obter a referência do documento encontrado
            const docRef = querySnapshot.docs[0].ref;

            // Deletar o documento
            await deleteDoc(docRef);

            console.log('Mensagem deletada com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar a mensagem:', error);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>, action: string) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent new line
            handleAction(action);
        }
    }

    function handleAction(action: string) {
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
        }

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

    async function markMessagesAsRead(chatId, messagesList) {
        const batch = writeBatch(db);

        for (const msg of messagesList) {
            if (msg.receiver === userData.uid && !msg.isRead) {
                try {
                    // Obtém a referência do documento da mensagem
                    const messagesRef = collection(db, 'chatsUsuariosFilho', chatId, 'mensagensUserParUser');
                    const q = query(messagesRef, where('id', '==', msg.id));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const messageRef = querySnapshot.docs[0].ref;
                        batch.update(messageRef, { isRead: true });
                    } else {
                        console.error(`Mensagem com ID ${msg.id} não encontrada para marcação como lida.`);
                    }
                } catch (error) {
                    console.error(`Erro ao tentar marcar mensagem ${msg.id} como lida:`, error);
                }
            }
        }

        try {
            if (!userMessagesMode) {
                console.log('Cai fora');

            } else {
                await batch.commit();
                console.log('Mensagens marcadas como lidas com sucesso.');

            }

        } catch (error) {
            console.error('Erro ao realizar batch commit:', error);
        }
    }

    return !userMessagesMode ? (
        <></>
    ) : (
        <Box
            height="calc(100vh - 50px)"
            display="flex"
            flexDirection="column"
            width="100%"


        >
            <Box

                flex="1"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                width="100%"
                p="4"
                overflow={'hidden'}

            >
                <Stack overflow={'auto'}
                    css={scrollStyle} spacing="3">
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="80px"
                        bg={frienduserData.bgIconColor}
                        height="80px"
                        borderRadius="80px"
                        flexShrink="0"  // Adiciona essa linha
                        minHeight="80px"  // Adiciona essa linha
                        backgroundSize={'cover'} backgroundImage={frienduserData.profilepicture}

                    >
                        {frienduserData.profilepicture ? <></> : <>
                            <FaDiscord fontSize="45px" color="white" />

                        </>}
                    </Box>
                    <Text fontSize="25px" color="white" fontWeight="800">
                        {frienduserData.username}
                    </Text>
                    <Text fontSize="15px" mt="-5px" color="#96989D">
                        Esse é o começo de sua conversa inesquecível com{" "}
                        <Text as="span" color="white">
                            {frienduserData.username}
                        </Text>
                    </Text>
                    <Box width="100%" bg="#2b2d31" height="1px" />
                    {messages.map((msg, index) => (
                        <Box
                            w="100%"
                            height="auto"
                            minH="55px"
                            display="flex"
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            _hover={{ bg: '#2b2d31' }}
                            alignItems="center"
                            transition="0.1s all"
                            bg={isEditingMessage === index ? '#2b2d31' : 'transparent'}

                        >
                            <Box display="flex" justifyContent="center" alignItems="center" width="70px" height="55px">
                                <Box
                                    bg={msg.sender === userData.uid ? userData.bgIconColor : frienduserData.bgIconColor}
                                    height="40px"
                                    width="40px"
                                    borderRadius="40px"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    mb="3px"
                                    backgroundSize="cover"
                                    backgroundImage={
                                        msg.sender === userData.uid ? `url(${userData.profilepicture})` : `url(${frienduserData.profilepicture})`
                                    }
                                >
                                    {((msg.sender === userData.uid && !userData.profilepicture) ||
                                        (msg.sender !== userData.uid && !frienduserData.profilepicture)) && (
                                            <FaDiscord fontSize="25px" color="white" />
                                        )}
                                </Box>
                            </Box>

                            <Box flex="1" height="100%">
                                <Box width="100%" display="flex" flexDir="column" justifyItems="center" height="100%">
                                    <Text color="white" as="span">
                                        {msg.sender === userData.uid ? userData.username : frienduserData.username}
                                        <Text ml="10px" as="span" fontSize="14px" color="#96989D">
                                            {formatTimestamp(msg.timestamp)}
                                        </Text>
                                    </Text>
                                    {isEditingMessage === index ? (
                                        <Box height="60px">
                                            <Input
                                                padding="0px"
                                                _focusVisible={{ border: 'none' }}
                                                outline="none"
                                                color="white"
                                                bg="#2b2d31"
                                                border="none"
                                                onChange={(e) => setMessageEdited(e.target.value)}
                                                value={messageEdited}
                                                onKeyDown={(event) => handleKeyDown(event, 'edit')}
                                            />
                                            <Stack flexDir="row">
                                                <Text
                                                    cursor="pointer"
                                                    fontSize="11px"
                                                    color="white"
                                                    onClick={() => [setHoveredIndex(null), console.log(hoveredIndex), setIsEditingMessage(false)]}
                                                >
                                                    Cancelar
                                                </Text>
                                                <Text
                                                    cursor="pointer"
                                                    fontSize="11px"
                                                    onClick={(event) => handleAction('edit')}
                                                    color="#00AFF4"
                                                >
                                                    Enviar
                                                </Text>
                                            </Stack>
                                        </Box>
                                    ) : (
                                        <Text mb="-2px" fontSize="16px" color="#96989D">
                                            {msg.message}
                                            {msg.isEdited && <Text as="span" fontSize="11px" color="#00AFF4"> (editado)</Text>}
                                        </Text>
                                    )}
                                </Box>
                            </Box>
                            {hoveredIndex === index && !isEditingMessage && msg.sender === userData.uid && (
                                <>
                                    <MdDelete
                                        cursor="pointer"
                                        color="#96989D"
                                        onClick={() => deleteMessage(chatId, msg.id)}
                                        fontSize="20px"
                                        style={{ marginRight: '10px' }}
                                    />
                                    <MdEdit
                                        style={{ marginRight: '10px' }}
                                        onClick={() => handleEditMessage(msg.id, msg.message, index)}
                                        cursor="pointer"
                                        color="#96989D"
                                        fontSize="20px"
                                    />
                                </>
                            )}
                        </Box>
                    ))}
                </Stack>
            </Box>
            <Box p="4" pt="0px">
                <Input
                    bg="#383a40"
                    placeholder="Digite sua mensagem..."
                    size="lg"
                    border="none"
                    color="white"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    onKeyDown={(event) => handleKeyDown(event, 'post')}
                    required
                />
            </Box>
        </Box>

    );


}


