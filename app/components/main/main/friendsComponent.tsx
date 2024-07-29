import { Box, Text, Stack, Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaUserFriends } from "react-icons/fa";
import { db } from '@/db/firebase';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, DocumentData } from "firebase/firestore";
import { useGlobalState } from '@/globalstate';
import { MdCheck, MdClose } from "react-icons/md";

export default function friendsComponent() {
    const [selected, setSelected] = useState(0)
    const [userData, setUserData] = useGlobalState('userData')

    function HeaderFriendsComponent() {
        return (
            <Box width={'100%'} display={'flex'} alignItems={'center'} height={'40px'}>
                <Stack mr={'15px'} flexDirection={'row'} alignItems={'center'}>
                    <FaUserFriends style={{ marginRight: '10px' }} fontSize={'20px'} color='white' />
                    <Text fontWeight={'500'} color={'white'}>Amigos</Text>
                </Stack>
                <Box width={'1px'} height={'60%'} bg={'gray'}></Box>
                <Stack ml={'15px'} mr={'25px'} justifyContent={'center'} alignContent={'center'}>
                    <Text fontWeight={'500'} color={'#96989D'}>Disponivel</Text>

                </Stack>
                <Stack mr={'25px'} justifyContent={'center'} alignContent={'center'}>
                    <Text fontWeight={'500'} color={'#96989D'}>Todos</Text>

                </Stack>
                <Stack onClick={(() => setSelected(2))} mr={'25px'} justifyContent={'center'} alignContent={'center'}>
                    <Text fontWeight={'500'} color={'#96989D'}>Pendente</Text>

                </Stack>
                <Stack mr={'25px'} justifyContent={'center'} alignContent={'center'}>
                    <Text fontWeight={'500'} color={'#96989D'}>Bloqueado</Text>

                </Stack>
                <Stack justifyContent={'center'} alignContent={'center'}>

                    <Button onClick={() => { setSelected(1) }} bg={'#248046'} height={'25px'} fontSize={'14px'} color={'white'}>Adicionar amigo</Button>

                </Stack>


            </Box>
        )
    }

    function AmigosPendentesFriendList() {
        const [pendingFriendRequestsData, setPendingFriendRequestsData] = useState([]);
        // async function acceptFriendRequest(userData, friendUid) {
        //     try {
        //         // Adicionar amigo a ambos os usuários
        //         await updateDoc(doc(db, "users", currentUserId), {
        //             friends: arrayUnion(friendUid),
        //             friendRequests: arrayRemove(friendUid)
        //         });

        //         await updateDoc(doc(db, "users", friendUid), {
        //             friends: arrayUnion(currentUserId)
        //         });

        //         console.log("Friend request accepted.");
        //     } catch (error) {
        //         console.error("Error accepting friend request:", error);
        //     }
        // }



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
        }, [userData.uid]); // Executa quando userData.uid muda


        return (
            <Box>
                <SearchinputComponentFriend />
                <Text mt={'15px'} color={'#96989D'}>Pendente</Text>
                <Box mt={'10px'} width={'100%'} height={'1px'} bg={'#525254'}></Box>

                <Box display={'flex'} width={'100%'} mt={'10px'}>
                    {pendingFriendRequestsData.map((request, index) => (
                        <Box width={'100%'} key={index} display="flex" alignItems="center" mb="10px">
                            <Box mr="10px" width="40px" height="40px" borderRadius="40px" bg={request.bgIconColor}></Box>
                            <Box flex="1" mr="10px">
                                <Text color="white">{request.username}</Text>
                                <Text color="#96989D">Pedido de amizade recebido</Text>
                            </Box>
                            <Box width="90px">
                                <Box justifyContent="space-between" display="flex">
                                    <Box display="flex" justifyContent="center" alignItems="center" width="40px" height="40px" borderRadius="40px" bg="#202225">
                                        <MdCheck fontSize="20px" color="white" />
                                    </Box>
                                    <Box display="flex" justifyContent="center" alignItems="center" width="40px" height="40px" borderRadius="40px" bg="#202225">
                                        <MdClose fontSize="20px" color="white" />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    ))}

                </Box>
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
            } catch (error) {
                console.error("Error sending friend request:", error);
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
                        />
                        <InputRightElement mr={'10px'} width={'200px'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
                            <Button onClick={sendFriendRequest} fontSize={'14px'} color={inputSearch.length !== 0 ? 'white' : '#96989D'} bg={inputSearch.length !== 0 ? '#5865f2' : '#3b428a'} width={'100%'} h='70%'>
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
                    : selected === 1 ? <SearchInputAddFriend /> : selected === 2 ? <AmigosPendentesFriendList /> : <></>
                }
            </Box>
        </Box>
    )
}
