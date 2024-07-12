import { auth, db } from '@/db/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { FaHashtag, FaMicrophone } from 'react-icons/fa';
import { Input, InputGroup, InputLeftElement, Box, Text } from "@chakra-ui/react";
import { IoIosLock } from 'react-icons/io';
import Switch from 'react-switch';

export default function createchannel() {

    const [local, setLocal] = useState(1)
    const [data, setData] = useState({})

    const [checked, setChecked] = useState(false);

    const handleChange = (nextChecked: boolean | ((prevState: boolean) => boolean)) => {
        setChecked(nextChecked);
    };

    useEffect(() => {
        console.assert(local)
    }, [local])

    useEffect(() => {
        const d = document.getElementById('modal-2')
        const m = document.getElementById('menu-2')
        d.classList.add('animacaoBlack')
        m.classList.add('animacaoMenu')

        const citiesRef = collection(db, "usuarios");
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // ...
                const q = query(citiesRef, where("id", "==", user.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // console.log(doc.id, " => ", doc.data());
                    setData(doc.data())
                });
            } else {
                // User is signed out
                // ...
            }
        });


    }, [])
    function CloseModal() {
        const d = document.getElementById('modal-2')
        const m = document.getElementById('menu-2')
        d.classList.remove('animacaoBlack')
        m.classList.remove('animacaoMenu')
        d.classList.add('animacaoBlackSaida')
        m.classList.add('animacaoMenuSaida')

        setTimeout(() => {
            setModal(false)

        }, 200)
    }

    function MainComponent() {
        return (
            <Box width={'100%'} h='100%'>
                <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} height={'85%'}>
                    <Box bg={'#313338'} width={'90%'} height={'90%'}>

                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Text color={'white'} fontSize={'17px'} fontWeight={'500'} >Criar Canal</Text>
                            <AiOutlineClose color='#73767d' fontSize={'25px'} cursor={'pointer'} />
                        </Box>

                        <Box mt={'30px'} mb={'10px'} color={'#b5bac1'}> <Text fontSize={'15px'} fontWeight={'600'}>TIPO DE CANAL</Text> </Box>

                        <Box w={'100%'} >
                            {/* Aqui ficam as divs de Seleção de tipo de canal */}
                            <Box bg={'#43444b'} pb={'10px'} pt={'10px'} display={'flex'} color={'#43444b'} w={'100%'}>
                                <Box width={'60px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <FaHashtag color='#b5bac1' fontSize={'30px'} />
                                </Box>
                                <Box>
                                    <Text color={'#b5bac1'} fontWeight={'500'}>Texto</Text>
                                    <Text color={'#96989D'} fontWeight={'300'} fontSize={'14px'}>Envie mensagens, imagens, GIFs, emojis, opniões e piadas</Text>
                                </Box>
                                <Box width={'60px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Box
                                        position="relative"
                                        width="25px"
                                        border="2px solid white"
                                        height="25px"
                                        borderRadius="25px"
                                    >
                                        <Box
                                            pos="absolute"
                                            left="50%"
                                            top="50%"
                                            width="75%"
                                            height="75%"
                                            bg="white"
                                            borderRadius="75%"
                                            transform="translate(-50%, -50%)"
                                        ></Box>
                                    </Box>

                                </Box>

                            </Box>
                            <Box mt={'10px'} pb={'10px'} pt={'10px'} display={'flex'} bg={'#2b2d31'} w={'100%'}>
                                <Box width={'60px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>

                                    <FaMicrophone color='#b5bac1' fontSize={'30px'} />

                                </Box>
                                <Box>
                                    <Text color={'#b5bac1'} fontWeight={'500'}>Voz</Text>
                                    <Text color={'#96989D'} fontWeight={'300'} fontSize={'14px'}>Passe tempo com a turma com voz, vídeo e compartilhamento de tela</Text>
                                </Box>
                                <Box width={'60px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Box
                                        position="relative"
                                        width="25px"
                                        border="2px solid white"
                                        height="25px"
                                        borderRadius="25px"
                                    >
                                        <Box
                                            pos="absolute"
                                            left="50%"
                                            top="50%"
                                            width="75%"
                                            height="75%"

                                            borderRadius="75%"
                                            transform="translate(-50%, -50%)"
                                        ></Box>
                                    </Box>

                                </Box>
                            </Box>

                            {/* Aqui é a Box de nome de canal */}
                            <Box mt={'20px'}>
                                <Text color={'white'} fontWeight={'600'}>NOME DO CANAL</Text>
                                <InputGroup mt={'10px'} >
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={<FaHashtag style={{ marginLeft: '5px' }} fontSize={'20px'} color="#b5bac1" />}
                                        height="100%"
                                    />
                                    <Input w={'100%'} bg={'#1e1f22'} h='40px' placeholder='novo-canal' paddingLeft="2rem" />
                                </InputGroup>
                            </Box>

                            {/* Box de Config de privacidade */}

                            <Box mt={'20px'} display={'flex'}>
                                <Box mr={'5px'}>
                                    <IoIosLock style={{ marginTop: '3px' }} color='#b5bac1' fontSize={'15px'} />
                                </Box>
                                <Box>
                                    <Text color={'white'}>Canal privado</Text>
                                </Box>
                                <Box w={'auto'} flex={'1'} display={'flex'} justifyContent={'flex-end'}>
                                    {/* <Switch placeholder='teste' colorScheme='red' /> */}
                                    <Switch
                                        onChange={handleChange}
                                        checked={checked}
                                        offColor="#888"
                                        onColor="#23a55a"
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        width={40}
                                        height={24}

                                    />
                                </Box>


                            </Box>
                            <Box>
                                <Text fontSize={'12px'} color={'#96989D'}>Somente membros e cargos selecionados verão esse canal</Text>
                            </Box>

                        </Box>
                    </Box>
                </Box>
                <Box width={'100%'} display={'flex'} justifyContent={'center'} height={'15%'} bg='#2b2d31'>
                    <Box width={'90%'} display={'flex'} height={'90%'} alignItems={'center'} justifyContent={'flex-end'}>
                        <Input value={'Cancelar'} fontSize={'13px'} cursor={'pointer'} color={'white'} type='Button' height={'30px'} mr={'15px'} />
                        <Input width={'100px'} color={'white'} cursor={'pointer'} value={'Próximo'} bg={'#414991'} fontSize={'13px'} height={'40px'} borderRadius={'5px'} type='Button' />
                    </Box>




                </Box>

            </Box>

        )
    }

    return (
        <Box id='modal-2' className='w-full h-[100vh] bg-[#000000b0] z-10 absolute'>
            <Box className='w-full h-full flex justify-center items-center'>
                <Box id='menu-2' height={'550px'} borderRadius={'15px'} className='w-[460px] flex-col flex justify-center items-center rounded-md' bg={'#313338'}>
                    <MainComponent />
                </Box>

            </Box>
        </Box>
    )
}
