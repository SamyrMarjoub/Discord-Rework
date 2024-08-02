import { Box, Text, Stack, Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaDiscord, FaUserFriends } from "react-icons/fa";
import { db } from '@/db/firebase';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, DocumentData, setDoc } from "firebase/firestore";
import { setGlobalState, useGlobalState } from '@/globalstate';
import { MdCheck, MdClose } from "react-icons/md";
import Image from 'next/image';
import pendente from '@/public/pendente.svg'
import disponivel from '@/public/disponivel.svg'
import blocked from '@/public/bloqueado.svg'
import { IoChatbubbleSharp } from "react-icons/io5";
import { useToast } from '@chakra-ui/react'

export default function friendsComponent() {
    const [selected, setSelected] = useState(0)
    const [userData, setUserData] = useGlobalState('userData')
    const [friendchatopen, setFriendChatOpen] = useGlobalState('friendchatopen')

    const toast = useToast()

    function HeaderFriendsComponent() {
        return (
            <Box width={'100%'} display={'flex'} alignItems={'center'} height={'40px'}>
                <Stack mr={'15px'} flexDirection={'row'} alignItems={'center'}>
                    <FaUserFriends style={{ marginRight: '10px' }} fontSize={'20px'} color='white' />
                    <Text fontWeight={'500'} color={'white'}>Amigos</Text>
                </Stack>
                <Box width={'1px'} height={'60%'} bg={'gray'}></Box>
                <Stack onClick={() => { setSelected(5) }} ml={'15px'} mr={'25px'} justifyContent={'center'} alignContent={'center'}>
                    <Text _hover={{ 'color': 'white' }} cursor={'pointer'} fontWeight={'500'} color={selected === 5 ? 'white' : '#96989D'}>Disponivel</Text>

                </Stack>
                <Stack onClick={() => { setSelected(4) }} mr={'25px'} justifyContent={'center'} alignContent={'center'}>
                    <Text _hover={{ 'color': 'white' }} cursor={'pointer'} fontWeight={'500'} color={selected === 4 ? 'white' : '#96989D'}>Todos</Text>

                </Stack>
                <Stack onClick={(() => setSelected(2))} mr={'25px'} justifyContent={'center'} alignContent={'center'}>
                    <Text _hover={{ 'color': 'white' }} cursor={'pointer'} fontWeight={'500'} color={selected === 2 ? 'white' : '#96989D'} >Pendente</Text>

                </Stack>
                <Stack onClick={() => { setSelected(3) }} mr={'25px'} justifyContent={'center'} alignContent={'center'}>
                    <Text _hover={{ 'color': 'white' }} cursor={'pointer'} fontWeight={'500'} color={selected === 3 ? 'white' : '#96989D'}>Bloqueado</Text>

                </Stack>
                <Stack justifyContent={'center'} alignContent={'center'}>

                    <Button _hover={'none'} onClick={() => { setSelected(1) }} bg={'#248046'} height={'25px'} fontSize={'14px'} color={'white'}>Adicionar amigo</Button>

                </Stack>


            </Box>
        )
    }
    function AllFriendComponent() {

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


        return (
            <Box height="calc(100% - 40px)">
                {userData.friends.length === 0 ? (
                    <Box display="flex" flexDir={'column'} justifyContent="center" alignItems="center" height="100%">
                        <Image
                            src={disponivel} // Substitua pelo caminho da sua imagem
                            alt="No friend requests"
                        />
                        <Text mt="20px" color="#96989D">Você não tem amigos :( .</Text>
                    </Box>
                ) : (
                    <>
                        <SearchinputComponentFriend />
                        <Text mt="15px" color="#96989D">Todos os amigos - {amigos.length}</Text>
                        <Box mt="10px" width="100%" height="1px" bg="#525254">
                        </Box>

                        <Box display="flex" width="100%">
                            {amigos.map((request, index) => (
                                <Box onClick={()=>{setGlobalState('friendchatopen',true), setGlobalState('chatfriendopenuid', request.uid)}} borderBottom={'1px solid #525254'} cursor={'pointer'} _hover={{ 'bg': '#0000001a' }} transition={'all 0.2s'}
                                    width="100%" key={index} p='10px' display="flex" alignItems="center" mb="10px">
                                    <Box display={'flex'} justifyContent='center' alignItems={'center'} mr="10px"
                                        width="40px" height="40px" borderRadius="40px" bg={request.bgIconColor}>
                                        <FaDiscord color='white' fontSize={'20px'} />

                                    </Box>
                                    <Box flex="1" mr="10px">
                                        <Text color="white">{request.username}</Text>
                                    </Box>
                                    <Box width="90px">
                                        <Box justifyContent="flex-end" display="flex">
                                            <Box display="flex" justifyContent="center" alignItems="center" width="40px" height="40px" borderRadius="40px" bg="#202225">
                                                <IoChatbubbleSharp fontSize="20px" color="white" />
                                            </Box>

                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
            </Box>
        )
    }
    function BlockedUsersComponent() {
        return (
            <>
                <Box display="flex" flexDir={'column'} justifyContent="center" alignItems="center" height="calc(100% - 40px)">
                    <Image
                        src={blocked} // Substitua pelo caminho da sua imagem
                        alt="future"
                    />
                    <Text mt="20px" color="#96989D">Você não pode desbloquear o Wumpus.</Text>
                </Box>
            </>
        )
    }
    function UsersDisponiveisComponent() {

        return (
            <>

                <Box display="flex" flexDir={'column'} justifyContent="center" alignItems="center" height="calc(100% - 40px)">
                    <Image
                        src={disponivel} // Substitua pelo caminho da sua imagem
                        alt="future"
                    />
                    <Text mt="20px" color="#96989D">Aqui ficarão os usuarios online. Funçãoa atualmente em construção.</Text>
                </Box>
            </>
        )
    }
    function AmigosPendentesFriendList() {
        const [pendingFriendRequestsData, setPendingFriendRequestsData] = useState([]);

        async function acceptFriendRequest(action) {
            const usersRef = collection(db, "usuarios");
            const currentUserQuery = query(usersRef, where("uid", "==", userData.uid));
            const pendingFriendRequestQuery = query(usersRef, where("uid", "==", pendingFriendRequestsData[0].uid));

            try {

                const currentUserSnapshot = await getDocs(currentUserQuery);
                if (currentUserSnapshot.empty) {
                    console.error(`User document with UID ${userData.uid} does not exist.`);
                    return;
                }
                const userDocRef = currentUserSnapshot.docs[0].ref;

                const pendingFriendRequestSnapshot = await getDocs(pendingFriendRequestQuery);
                if (pendingFriendRequestSnapshot.empty) {
                    console.error(`User document with UID ${pendingFriendRequestsData[0].uid} does not exist.`);
                    return;
                }
                const pendingFriendRequestDocRef = pendingFriendRequestSnapshot.docs[0].ref;

                if (action) {
                    // Add friend to both users
                    await updateDoc(userDocRef, {
                        friends: arrayUnion(pendingFriendRequestsData[0].uid),
                        friendRequests: arrayRemove(pendingFriendRequestsData[0].uid)
                    });

                    await updateDoc(pendingFriendRequestDocRef, {
                        friends: arrayUnion(userData.uid)
                    });

                    console.log("Friend request accepted.");
                } else {
                    // Remove the friend request from the current user's pending friend requests
                    await updateDoc(userDocRef, {
                        friendRequests: arrayRemove(pendingFriendRequestsData[0].uid)
                    });

                    console.log("Friend request rejected.");
                }
            } catch (error) {
                console.error("Error handling friend request:", error);
            }
        }



        const getPendingFriendRequests = async () => {
            const usersRef = collection(db, "usuarios");
            const q1 = query(usersRef, where("uid", "==", userData.uid));
            const querySnapshot1 = await getDocs(q1);

            if (!querySnapshot1.empty) {
                let pendingData: ((prevState: never[]) => never[]) | DocumentData[] = [];

                for (const doc of querySnapshot1.docs) {
                    const friendRequests = doc.data().friendRequests || [];

                    for (const friendUid of friendRequests) {
                        const friendQuery = query(usersRef, where("uid", "==", friendUid));
                        const friendSnapshot = await getDocs(friendQuery);

                        if (!friendSnapshot.empty) {
                            friendSnapshot.docs.forEach(friendDoc => {
                                pendingData.push(friendDoc.data());
                            });
                        }
                    }
                }

                setPendingFriendRequestsData(pendingData);
                console.log("Pending friend requests data:", pendingData);
            } else {
                console.log("Nenhum documento encontrado.");
            }
        };

        useEffect(() => {
            getPendingFriendRequests();
        }, [userData.uid]);

        return (
            <Box height="calc(100% - 40px)">
                {pendingFriendRequestsData.length === 0 ? (
                    <Box display="flex" flexDir={'column'} justifyContent="center" alignItems="center" height="100%">
                        <Image
                            src={pendente} // Substitua pelo caminho da sua imagem
                            alt="No friend requests"
                        />
                        <Text mt="20px" color="#96989D">Não há pedido de amizades pendentes. Fique com o Wumpus enquanto isso</Text>
                    </Box>
                ) : (
                    <>
                        <SearchinputComponentFriend />
                        <Text mt="15px" color="#96989D">Pendente - {pendingFriendRequestsData.length}</Text>

                        <Box mt="10px" width="100%" height="1px" bg="#525254"></Box>

                        <Box display="flex" width="100%">
                            {pendingFriendRequestsData.map((request, index) => (
                                <Box borderBottom={'1px solid #525254'} p='10px' cursor={'pointer'} _hover={{ 'bg': '#0000001a' }} transition={'all 0.2s'} width="100%" key={index} display="flex" alignItems="center" mb="10px">
                                    <Box mr="10px" width="40px" height="40px" borderRadius="40px" bg={request.bgIconColor}></Box>
                                    <Box flex="1" mr="10px">
                                        <Text color="white">{request.username}</Text>
                                        <Text color="#96989D">Pedido de amizade recebido</Text>
                                    </Box>
                                    <Box width="90px">
                                        <Box justifyContent="space-between" display="flex">
                                            <Box display="flex" justifyContent="center" alignItems="center" width="40px" height="40px" borderRadius="40px" bg="#202225">
                                                <MdCheck onClick={() => acceptFriendRequest(true)} fontSize="20px" color="white" />
                                            </Box>
                                            <Box display="flex" justifyContent="center" alignItems="center" width="40px" height="40px" borderRadius="40px" bg="#202225">
                                                <MdClose onClick={() => acceptFriendRequest(false)} fontSize="20px" color="white" />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
            </Box>

        )
    }
    function SearchinputComponentFriend() {
        return (
            <Box w={'100%'} height={'auto'}>
                <Input bg={'#202225'} border='none' mt={'20px'} w={'100%'} height={'40px'} placeholder='Buscar' />
            </Box>
        )
    }
    function SearchInputAddFriend() {

        const [inputSearch, setInputSearch] = useState('')

        async function sendFriendRequest() {
            if (!inputSearch.trim()) {
                console.error("Input search is empty");
                return;
            }

            try {
                const usersRef = collection(db, "usuarios");

                // Criar duas queries para procurar pelo uid ou username
                const q1 = query(usersRef, where("uid", "==", inputSearch));
                const q2 = query(usersRef, where("username", "==", inputSearch));

                // Executar as consultas
                const querySnapshot1 = await getDocs(q1);
                const querySnapshot2 = await getDocs(q2);

                // Combinar os resultados
                const allDocs = [...querySnapshot1.docs, ...querySnapshot2.docs];

                if (allDocs.length === 0) {
                    console.log("No matching documents.");
                    toast({
                        title: 'Solicitação não enviada',
                        description: 'No matching documents',
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                        position: 'top'
                    })
                    return;
                }

                // Supondo que apenas um usuário seja encontrado
                const targetUserDoc = allDocs[0];
                const targetUserId = targetUserDoc.id;

                // Adicionar solicitação de amizade
                await updateDoc(doc(db, "usuarios", targetUserId), {
                    friendRequests: arrayUnion(userData.uid)  // 
                });

                console.log("Friend request sent.");
                toast({
                    title: 'Solicitação enviada',
                    description: "Oba! Foi mandado a solicitação de amizade.",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                    position: 'top'
                })
            } catch (error) {
                console.error("Error sending friend request:", error);
                toast({
                    title: 'Solicitação não enviada',
                    description: 'Ocorreu um erro ao enviar a solicitação de amizade',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                    position: 'top'
                })
            }

        }




        return (

            <Box>
                <Box>
                    <Text mt={'20px'} fontWeight={'500'} color={'white'}>
                        ADICIONAR AMIGO
                    </Text>
                    <Text mt={'5px'} fontSize={'13px'} color={'#96989D'}>
                        Você pode adiconar amigos com o nome de usuário ou pelo uid deles
                    </Text>
                </Box>
                <Box mt={'10px'}>
                    <InputGroup>
                        <Input border={'none'}
                            pr='4.5rem'
                            type={'text'}
                            placeholder='Você pode adiconar amigos com o nome de usuário/uid deles'
                            bg='#202225'
                            height={'50px'}
                            color={'white'}
                            onChange={(e) => setInputSearch(e.target.value)}
                            value={inputSearch}
                        />
                        <InputRightElement mr={'10px'} width={'200px'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
                            <Button _hover={'none'} cursor={inputSearch.length === 0 ? 'not-allowed' : 'pointer'} onClick={sendFriendRequest} fontSize={'14px'} color={inputSearch.length !== 0 ? 'white' : '#96989D'} bg={inputSearch.length !== 0 ? '#5865f2' : '#3b428a'} width={'100%'} h='70%'>
                                Enviar pedido de amizade
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Box>
            </Box>
        )
    }
    return (
        <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
            <Box width={'95%'} height={'100%'}>
                <HeaderFriendsComponent />
                {selected === 0 ?
                    <SearchinputComponentFriend />
                    : selected === 1 ? <SearchInputAddFriend /> : selected === 2 ? <AmigosPendentesFriendList />
                        : selected === 3 ? <BlockedUsersComponent /> : selected === 4 ? <AllFriendComponent /> : selected === 5 ? <UsersDisponiveisComponent /> : <></>
                }
            </Box>
        </Box>
    )
}
