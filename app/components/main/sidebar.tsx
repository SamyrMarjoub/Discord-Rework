import { auth, db } from '@/db/firebase';
import { setGlobalState, useGlobalState } from '@/globalstate';
import { Box, Text } from '@chakra-ui/react'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, DocumentData, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaDiscord } from 'react-icons/fa'
import { IoAddSharp } from "react-icons/io5";
import { FaGear, FaHashtag } from "react-icons/fa6";
import Modal from './sidebar/createserver';
import ModalCreateChannel from './sidebar/createchannel'
import { MyContext } from '@/app/context';
import Image from 'next/image';
import { IoIosArrowDown } from 'react-icons/io';
import Usertousersidebar from './sidebar/usertousersidebar';

export default function sidebar() {

    const router = useRouter()
    const [userData2, setUserData2] = useState({})
    const [userServs, setUserServs] = useState([])
    const [generalData, setGeneralData] = useState({})
    const [modal, setModal] = useState(false)
    const [modal_dois, setModal_dois] = useGlobalState("modal_open_2")
    const [SingleServData, setSingleServData] = useState({})
    const [modalOpen, setModalOpen] = useGlobalState('modalOpen')
    const [userHasServer, setUserHasServer] = useState(null)
    const [isServerSelected, setIsServerSelected] = useGlobalState('isServerSelected')
    const [ServerData, setServerData] = useGlobalState('defaultCurrency')
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [ChannelSelectedId, SetChannelSelectedId] = useGlobalState('ChannelSelectedId');
    const [userCreatedChat, setUserCreatedChat] = useGlobalState('userCreatedChat')
    const [userMessagesMode, setMessagesMode] = useGlobalState('userMessagesMode')
    const [userData, setUserData] = useGlobalState('userData')
    const [DadosMsgsNotRead, setDadosMsgsNotRead] = useState(0)
    const [NumberMessageNotRead, setNumberMessageNotRead] = useState(0)

    // Função de deslogar
    function logout() {
        signOut(auth)
        router.push('/login/signin')
        localStorage.removeItem('logged')
        localStorage.removeItem('Uid')
        window.location.reload()
    }

    async function getUserData() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserData2(user);
                const docRef = doc(db, "usuarios", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log(docSnap.data());
                    setGlobalState('userData', docSnap.data());

                    const SideBarServers = async () => {
                        if (docSnap.data().servs.length !== 0) {
                            const q = query(collection(db, "servidores"), where("id", "in", docSnap.data().servs));
                            const querySnapshot = await getDocs(q);
                            const array = [];
                            querySnapshot.forEach((doc) => {
                                array.push(doc.data());
                            });
                            setUserServs(array);
                            setUserHasServer(true);
                            setGeneralData(docSnap.data());

                            const userId = docSnap.data().uid;
                            const chatsRef = collection(db, "chatsUsuariosFilho");

                            // Query para pegar todos os chats onde user1 ou user2 é igual ao userId
                            const queryUser1 = query(chatsRef, where("user1", "==", userId));
                            const queryUser2 = query(chatsRef, where("user2", "==", userId));

                            // Função para buscar as mensagens de um chat
                            async function getMessages(chatId) {
                                const messagesRef = collection(db, `chatsUsuariosFilho/${chatId}/mensagensUserParUser`);
                                const messagesSnapshot = await getDocs(messagesRef);
                                const messages = [];
                                let unreadMessagesCount = 0;

                                messagesSnapshot.forEach((messageDoc) => {
                                    const messageData = { id: messageDoc.id, ...messageDoc.data() };
                                    messages.push(messageData);

                                    // Contabiliza as mensagens não lidas apenas se o usuário atual for o destinatário
                                    if (!messageData.isRead && messageData.receiver === userId) {
                                        unreadMessagesCount++;
                                    }
                                });

                                return { messages, unreadMessagesCount };
                            }

                            const processChats = async (querySnapshot) => {
                                const chatsWithMessages = [];
                                const unreadMessagesByChat = {};
                                let totalUnreadMessages = 0;

                                for (const docSnapshot of querySnapshot.docs) {
                                    const chatData = { id: docSnapshot.id, ...docSnapshot.data() };
                                    const { messages, unreadMessagesCount } = await getMessages(docSnapshot.id);
                                    chatsWithMessages.push({ chat: chatData, messages: messages });

                                    // Armazena a contagem de mensagens não lidas por chat
                                    unreadMessagesByChat[docSnapshot.id] = unreadMessagesCount;
                                    totalUnreadMessages += unreadMessagesCount;
                                    console.log("Total de mensagens não lidas em todos os chats:", totalUnreadMessages);

                                }

                                // Exibe a quantidade de mensagens não lidas por chat
                                console.log("Mensagens não lidas por chat:", unreadMessagesByChat);
                                setNumberMessageNotRead(totalUnreadMessages)
                                setGlobalState('totalNumberMessageNotRead', totalUnreadMessages)
                                setGlobalState('chatsNumberMessageNotRead', unreadMessagesByChat)
                                // Exibe os chats e mensagens encontrados
                                // console.log("Atualização nos chats e mensagens:", chatsWithMessages);
                            };

                            // Listener para chats onde user1 é igual ao userId
                            onSnapshot(queryUser1, processChats);

                            // Listener para chats onde user2 é igual ao userId
                            onSnapshot(queryUser2, processChats);
                        } else {
                            setUserHasServer(false);
                            console.log('Não tem servidor');
                        }
                    };
                    SideBarServers();
                } else {
                    console.log("No such document!");
                }
            } else {
                console.log('Deslogado');
            }
        });
        console.log('Foi');
    }


    useEffect(() => {
        console.log(NumberMessageNotRead)
    }, [NumberMessageNotRead])



    // função de pegar os chats do servidor selecionado
    const getChats = async (ServerId) => {
        try {
            // Cria a referência à coleção 'chats' e cria a consulta
            const q = query(collection(db, 'chats'), where('serverId', '==', ServerId));
            const querySnapshot = await getDocs(q);

            // Itera sobre os documentos retornados e armazena-os no state
            let chatsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Separa o chat 'geral'
            const generalChat = chatsData.find(chat => chat.name === 'Geral');
            chatsData = chatsData.filter(chat => chat.name !== 'Geral');

            // Adiciona o chat 'geral' no início do array
            if (generalChat) {
                chatsData.unshift(generalChat);
                setGlobalState('ChannelSelectedId', generalChat.id)

            }

            setChats(chatsData);
            console.log(chatsData);
            setGlobalState('ServerChannelsData', chatsData);
        } catch (error) {
            console.error('Error fetching server chats:', error);
        }
    };

    const getMessages = async (chatId: unknown) => {
        try {
            const q = query(collection(db, 'mensagens'), where('chatId', '==', chatId));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(doc => {
                console.log(doc.id, ' => ', doc.data());
            });
        } catch (error) {
            console.error('Error fetching messages for chat:', error);
        }
    };

    //  função de selecionar o servidor e pegar suas inforações
    function OpenServer(e: any) {
        const id = e
        const data = userServs.find(item => item.id === id)
        setSingleServData(data)
        getChats(data?.id)
        console.log(data)
        setGlobalState("defaultCurrency", data)
        setGlobalState("isServerSelected", true)
        setGlobalState('ChannelSelectedId', '')
        setGlobalState('userMessagesMode', false)
        setGlobalState('friendchatopen', false)
        setGlobalState('chatfriendopenuid', null)

    }

    useEffect(() => {
        console.log(userMessagesMode)
    }, [userMessagesMode])

    // Função pra abrir ou fechar o modal
    function modalSwitch() {
        setGlobalState('modalOpen', 1)
        setModal(true)
    }

    useEffect(() => {
        getUserData()

    }, [modal])



    useEffect(() => {
        if (userCreatedChat === 1) {
            getChats(ServerData.id)
        }
    }, [userCreatedChat])

    useEffect(() => {
        getUserData()

    }, [])

    const rectangles1 = ['110px', '70px', '140px', '90px', '10%', '80%'];
    const rectangles2 = ['100px', '80px', '100px', '70px', '70%', '80%'];

    // Funções de renderização..
    const MainBlock = ({ rectangles }: any) => (
        <Box className="w-full flex-col flex mt-10">
            <Box className="w-[35%] h-[20px] rounded-[5px] bg-[#4F545C]"></Box>
            {rectangles.map((width: any, index: React.Key | null | undefined) => (
                <CircleWithRectangle key={index} width={width} />
            ))}
        </Box>
    );

    // Funções de renderização..

    const CircleWithRectangle = ({ width }: any) => (
        <Box className="flex mt-5 pl-2">
            <Box className="w-[18px] mr-2 rounded-full h-[18px] bg-[#4F545C]"></Box>
            <Box className="rounded-[7px] bg-[#4F545C]" style={{ width, height: '18px' }}></Box>
        </Box>
    )


    return (

        //Div Geral - Tamanho do sidebar inteiro
        <Box width={'430px'} display={'flex'} height={'100%'} bg={'#2b2d31'}>
            <Box bg={'#202225'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'} width={'75px'}>
                <Box w={'80%'} height={'98%'} display={'flex'} flexDir={'column'}>
                    <Box w={'100%'} height={'58px'} position={'relative'} display={'flex'} justifyContent={'center'} >
                        <Box _hover={{ 'bg': '#5865f2' }} position={'relative'} cursor={'pointer'} onClick={() => { setNumberMessageNotRead(0), [setGlobalState('userMessagesMode', true), setGlobalState('isServerSelected', false)] }} lineHeight={'center'} bg={userMessagesMode ? '#5865f2' : '#36393F'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderRadius={'47px'} w={'47px'} height={'47px'}>
                            <FaDiscord color='#DCDDDE' fontSize={'25px'} />
                            {NumberMessageNotRead !== 0 ? <Box width={'18px'} height={'18px'} display={'flex'} justifyContent={'center'} alignItems={'center'} position={'absolute'} right={'-2px'} rounded={'18px'} bottom={'0px'} bg={'red'} color={'white'}>
                                <Text color={'white'} fontSize={'13px'} fontWeight={'700'}>{NumberMessageNotRead}</Text>
                            </Box> : <></>}
                        </Box>
                        <Box width={'60%'} height={'2px'} bg={'#36393F'} position={'absolute'} bottom={'0'} left={'20%'}>

                        </Box>
                    </Box>
                    <Box gap={'5px'} w={'100%'} mt={'10px'} display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'center'} height={'auto'}>

                        {/* Aqui é a condição que renderiza as divs dos servidores */}
                        {userServs ? userServs.map((e, index) =>
                        (
                            <Box key={index} className={`w-full  flex justify-center `}>
                                {e.serverImage ?
                                    <Box className={`z-10 m-1 h-auto`}>
                                        <Box>
                                            <Image width={100} height={100} onClick={() => OpenServer(e.id)} id={e.id} src={e.serverImage}
                                                className='w-full h-[60px] rounded-full cursor-pointer object-cover' alt='' />
                                        </Box>

                                    </Box>
                                    : <Box onClick={() => OpenServer(e.id)} id={e.id} className={`w-[100%] z-10 rounded-[17px] flex 
                                    justify-center m-1 items-center h-[55px] cursor-pointer bg-[#5865F2]`}>
                                        <Text as={'span'} className='text-[16px] text-white'>
                                            {e.name.split(" ").map(w => w[0]).join("").slice(0, 3)}
                                        </Text>
                                    </Box>}

                            </Box>
                        )
                        ) : <></>}

                    </Box>
                    <Box display={'flex'} position={'relative'} flexDir={'column'} justifyContent={'center'} alignItems={'center'} w={'100%'} mt={'10px'} height={'auto'}>

                        {/* Essa é a Div da linha */}

                        <Box width={'60%'} height={'2px'} bg={'#36393F'} position={'absolute'} top={'0'} left={'20%'}>

                        </Box>

                        {/* Essa é a Div de add servidor */}
                        <Box cursor={'pointer'} onClick={() => modalSwitch()} display={'flex'} justifyContent={'center'} alignItems={'center'} mt={'10px'} width={'50px'} height={'50px'} borderRadius={'50px'} bg={'#36393F'}>
                            <IoAddSharp fontSize={'30px'} color='#3BA55D' />
                        </Box>

                    </Box>

                </Box>
            </Box>

            {/* Aqui é a Div GRANDE (Renderização dos canais/amigos) */}

            <Box flex={'1'} h={'full'}>
                <Box width={'100%'} height='100%' bg='bç' justifyContent={'space-between'} display={'flex'} flexDir={'column'}>

                    {/* Condição pra saber se o usuario há servidores e se selecionou um*/}
                    {/* AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII::: COMEÇA */}

                    {
                        userHasServer && isServerSelected && userMessagesMode != true ? <Box height="calc(100% - 50px)" width={'full'}>

                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'} height={'50px'}>
                                <Box width={'90%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={'90%'}>
                                    <Text fontWeight={'800'} fontSize={'15px'} color={'white'}>{SingleServData?.name}</Text>
                                    <IoIosArrowDown color='white' fontSize={'16px'} />

                                </Box>
                            </Box>

                            <Box display={'flex'} justifyContent={'center'} width={'100%'} height={'100%'}>

                                <Box width={'90%'} height={'90%'}>

                                    {/* Box que mostra os canais de texto */}

                                    <Box position={'relative'} display={'flex'} alignItems={'center'} flexDir={'row'}>
                                        <IoIosArrowDown color='#96989D' fontWeight={'800'} fontSize={'12px'} /> <Text mt={'5px'} ml={'3px'} fontWeight={'800'} as={'span'} fontSize={'13px'} color='#96989D'>CANAIS DE TEXTO</Text>
                                        <Box position={'absolute'} right={'0'}>
                                            {/* criar channels aqui */}
                                            <IoAddSharp onClick={() => setGlobalState('modal_open_2', 1)} cursor={'pointer'} fontSize={'16px'} color='#96989D' />
                                        </Box>

                                    </Box>
                                    {/* AQUI É RENDERIZADO OS CHATS */}

                                    {/* <Usertousersidebar/> */}
                                    {chats.map((e, index) => {
                                        const isSelected = e.chatId === ChannelSelectedId;

                                        return (
                                            <Box
                                                cursor={'pointer'}
                                                _hover={{ bg: "#36393F" }}
                                                transition={'all 0.5s'}
                                                onClick={() => {
                                                    getMessages(e.chatId);
                                                    setGlobalState('ChannelSelectedId', e.id);
                                                }}
                                                key={index}
                                                display={'flex'}
                                                alignItems={'center'}
                                                height={'35px'}
                                                width={'100%'}
                                            >
                                                <FaHashtag
                                                    style={{ marginLeft: '5px' }}
                                                    fontSize={'17px'}
                                                    color={isSelected ? 'white' : '#96989D'}
                                                />
                                                <Text color={isSelected ? 'white' : 'gray'} fontSize={'15px'} ml={'5px'}>
                                                    {e?.name}
                                                </Text>
                                            </Box>
                                        );
                                    })}


                                    {/* Box que mostra os canais de voz */}

                                    <Box display={'flex'} alignItems={'center'} flexDir={'row'}>
                                        <IoIosArrowDown color='#96989D' fontWeight={'800'} fontSize={'12px'} /> <Text mt={'5px'} ml={'3px'} fontWeight={'800'} as={'span'} fontSize={'13px'} color='#96989D'>CANAIS DE VOZ</Text>
                                    </Box>

                                    <Box display={'flex'} alignItems={'center'} height={'35px'} width={'100%'}>
                                        <FaHashtag style={{ 'marginLeft': '5px' }} fontSize={'17px'} color='#96989D' />
                                        <Text color={'#96989D'} fontSize={'15px'} ml={'5px'}>Geral</Text>
                                    </Box>



                                </Box>

                            </Box>





                        </Box> : !isServerSelected && userMessagesMode != false ? <>

                            <Usertousersidebar />
                        </>

                            : <>
                                <Box mt={'20px'} className='w-full  flex-col h-auto flex justify-center items-center'>
                                    <Box className='w-[95%] flex items-center flex-1 '>
                                        <Box className='w-full h-[97%]'>
                                            <Box className='w-full flex-col bg-red  flex'>
                                                <Box className="w-[35%] h-[20px] rounded-[5px] bg-[#4F545C]"></Box>
                                                {rectangles1.map((width, index) => (
                                                    <CircleWithRectangle key={index} width={width} />
                                                ))}
                                            </Box>

                                            <MainBlock rectangles={rectangles2} />
                                        </Box>



                                    </Box>


                                </Box>
                            </>}


                    {/* AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII termina */}







                    {/* Aqui é a barra inferior, que fica o nick, foto de perfil e as configs (LOGOUT) */}

                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'} height={'50px'} bg={'#232428'}>
                        <Box display={'flex'} alignItems={'center'} width={'90%'} height={'90%'} >
                            <Box width={'35px'} height={'35px'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderRadius={'35px'} bg={userData?.bgIconColor}>
                                <FaDiscord color='white' fontSize={'25px'} />
                            </Box>
                            <Box height={'full'} flex={'2'}>
                                <Box display={'flex'} flexDir={'column'} pl='2px' width={'100%'} height={'100%'} >
                                    <Text as={'span'} mt={'6px'} display={'inline-block'} ml={'5px'} color={'white'} fontWeight={'900'} fontSize={'13px'}>{userData?.username}</Text>
                                    <Text as={'span'} mt='-5px' display={'inline-block'} ml={'3px'} color={'#96989D'} fontSize={'11.5px'}>#{userData?.uid}</Text>
                                </Box>
                            </Box>
                            <Box flex={'1'} height={'full'}>
                                <Box onClick={() => logout()} cursor={'pointer'} _hover={{ 'bg': '#36393F' }} display={'flex'} transition={'0.2s all'} justifyContent={'center'} alignItems={'center'} width={'100%'} height={'100%'}>
                                    <FaGear color='#96989D' fontSize={'19px'} />

                                </Box>
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Aqui fica o modal de criação de servidor */}
            {modal ? (
                <MyContext.Provider value={{ modal, setModal }}>
                    <Modal />
                </MyContext.Provider>


            ) : <></>}
            {modal_dois ?
                <ModalCreateChannel />
                : <></>}
        </Box>

    )
}
