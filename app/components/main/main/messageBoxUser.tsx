import { db } from '@/db/firebase';
import { setGlobalState, useGlobalState } from '@/globalstate';
import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { collection, doc, setDoc, updateDoc, query, orderBy, where, getDocs, serverTimestamp, onSnapshot, writeBatch, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaDiscord } from 'react-icons/fa';

export default function MessageBoxUser() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [friendtargetUid, setTargetUid] = useGlobalState('chatfriendopenuid');
    const [frienduserData, setFriendUserData] = useGlobalState('friendChatUserData');
    const [userData, setUserData] = useGlobalState('userData');
    const [chatId, setChatId] = useState(null);

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
        async function loadChat() {
            if (!userData?.uid || !frienduserData?.uid) return;

            const chatId = await getOrCreateChat();
            setChatId(chatId);

            const messagesRef = collection(db, 'chatsUsuariosFilho', chatId, 'mensagensUserParUser');
            const q = query(messagesRef, orderBy('timestamp', 'asc'));

            // Listen for real-time updates
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messagesList = querySnapshot.docs.map(doc => doc.data());
                setMessages(messagesList);
            });

            // Clean up the listener on unmount
            return () => unsubscribe();
        }

        loadChat();
    }, [userData, frienduserData]);

    async function getOrCreateChat() {
        const userId1 = userData.uid;
        const userId2 = frienduserData.uid;

        const userChatsRef = collection(db, 'chatsUsuariosPai', userId1, 'chatsUsuariosFilho');
        const q = query(userChatsRef, where('chatRef', '!=', null));
        const querySnapshot = await getDocs(q);

        for (let doc of querySnapshot.docs) {
            const chatData = await getDoc(doc.data().chatRef);
            if (chatData.exists() && ((chatData.data().user1 === userId1 && chatData.data().user2 === userId2) ||
                (chatData.data().user1 === userId2 && chatData.data().user2 === userId1))) {
                return chatData.id;
            }
        }

        const batch = writeBatch(db);
        const chatRef = doc(collection(db, 'chatsUsuariosFilho'));
        batch.set(chatRef, {
            user1: userId1,
            user2: userId2,
            lastMessage: '',
            timestamp: serverTimestamp()
        });

        const user1ChatRef = doc(collection(db, 'chatsUsuariosPai', userId1, 'chatsUsuariosFilho'), chatRef.id);
        const user2ChatRef = doc(collection(db, 'chatsUsuariosPai', userId2, 'chatsUsuariosFilho'), chatRef.id);
        batch.set(user1ChatRef, { chatRef });
        batch.set(user2ChatRef, { chatRef });

        await batch.commit();

        return chatRef.id;
    }

    async function sendMessage(chatId, senderId, receiverId, message) {
        if (message.trim() === '') return; // Não enviar mensagem vazia

        const messageRef = doc(collection(db, 'chatsUsuariosFilho', chatId, 'mensagensUserParUser'));
        await setDoc(messageRef, {
            sender: senderId,
            receiver: receiverId,
            message: message,
            timestamp: serverTimestamp()
        });

        const chatRef = doc(db, 'chatsUsuariosFilho', chatId);
        await updateDoc(chatRef, {
            lastMessage: message,
            timestamp: serverTimestamp()
        });

    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evitar a nova linha
            if (chatId) {
                sendMessage(chatId, userData.uid, frienduserData.uid, message);
                setMessage('')
            }
        }
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

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        
        const dayDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
        if (dayDiff === 0) {
            // Mensagem enviada hoje
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (dayDiff === 1) {
            // Mensagem enviada ontem
            return `Ontem, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            // Mensagem enviada em um dia diferente
            return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) +
                ` ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
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
                    {messages.map((msg, index) => (
                        <Box
                            w={'100%'}
                            height={'auto'}
                            minH={'55px'}
                            display={'flex'}
                            key={index}

                        >
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'70px'} height={'55px'}>
                                <Box bg={msg.sender === userData.uid ? userData.bgIconColor : frienduserData.bgIconColor} height={'40px'} width={'40px'} borderRadius={'40px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <FaDiscord fontSize={'25px'} color='white' />
                                </Box>
                            </Box>
                            <Box flex={'1'}>
                                <Box width={'100%'} display={'flex'} flexDir={'column'} height={'100%'}>
                                    <Text mt={'5px'} color={'white'} as={'span'}>
                                        {msg.sender === userData.uid ? userData.username : frienduserData.username}
                                        <Text ml={'10px'} as={'span'} fontSize={'14px'} color={'#96989D'}>
                                        {formatTimestamp(msg.timestamp)}
                                    </Text>
                                    </Text>
                                   
                                    <Text mb={'-2px'} fontSize={'16px'} color={'#96989D'}>
                                        {msg.message}
                                    </Text>
                                </Box>
                            </Box>
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
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    onKeyDown={handleKeyDown}
                    required
                />
            </Box>
        </Box>
    );
}
